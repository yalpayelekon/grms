import { useState, useEffect } from "react";
import {TableBody, TableRow, TableCell, Chip, Box, Typography, Modal} from "@mui/material";
import PropTypes from "prop-types";
import moreDetailsIcon from "../../icons/alarms/more-details/moreDetails.png";
import lightingIcon from "../../icons/alarms/category/lighting.png";
import hvacIcon from "../../icons/alarms/category/HVAC.png";
import rcuIcon from "../../icons/alarms/category/RCU.png";
import doorSystIcon from "../../icons/alarms/category/doorSyst.png";
import pmsIcon from "../../icons/alarms/category/PMS.png";
import emergIcon from "../../icons/alarms/category/emerg.png";
import openDoorIcon from "../../icons/alarms/category/openDoor.png";
import longInactIcon from "../../icons/alarms/category/longInact.png";
import waitingAckIcon from "../../icons/alarms/acknowledgement/waiting.png";
import alertIcon from "../../icons/alarms/status-icons/error.png";
import successIcon from "../../icons/alarms/status-icons/success.png";
import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const AlarmsTableRows = ({ page, rowsPerPage, order, orderBy, data }) => {
       
    // admin
    const adminAlarmsTableRowsRowHoverBackground = UISettingsData.adminAlarmsTableRowsRowHoverBackground; // "#ffffff50"
    const adminAlarmsTableRowsWaitingColor = UISettingsData.adminAlarmsTableRowsWaitingColor; // "#ffffff"
    const adminAlarmsTableRowsAcknowledgedColor = UISettingsData.adminAlarmsTableRowsAcknowledgedColor; // "#00ff00"
    const adminAlarmsTableRowsMalfunctionTextColor = UISettingsData.adminAlarmsTableRowsMalfunctionTextColor; // "#ffab00"
    const adminAlarmsTableRowsIncidentTimeTextColor = UISettingsData.adminAlarmsTableRowsIncidentTimeTextColor; // "#ff0000"
    const adminAlarmsTableRowsCategoryTextColor = UISettingsData.adminAlarmsTableRowsCategoryTextColor; // "#00ff00"
    const adminAlarmsTableRowsAcknowledgementTextColor = UISettingsData.adminAlarmsTableRowsAcknowledgementTextColor; // "#0000ff"
    const adminAlarmsTableRowsAckTimeTextColor = UISettingsData.adminAlarmsTableRowsAckTimeTextColor; // "#ff0000"
    const adminAlarmsTableRowsStatusTextColor = UISettingsData.adminAlarmsTableRowsStatusTextColor; // "#00ff00"


    const [localData, setLocalData] = useState(data);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openMoreDetails, setOpenMoreDetails] = useState(false);
    
    const handleOpen = () => setOpenMoreDetails(true);
    const handleClose = () => setOpenMoreDetails(false);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const hours = ("0" + date.getHours()).slice(-2); // 24 saat formatında
        const minutes = ("0" + date.getMinutes()).slice(-2);
      
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };

    const handleAcknowledge = (id) => {
  
        // `localData` içinde belirtilen `id`'ye sahip öğeyi bul
        const rowToUpdate = localData.find(row => row.id === id);

        console.log("rowToUpdate:", rowToUpdate)
        
        if (rowToUpdate) {
            fetch('http://127.0.0.1:8000/postAlarmsAckData/', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                // Sadece oda numarasını göndereceğiz
                body: JSON.stringify({ 
                    blokNumarasi:rowToUpdate.blokNumarasi,  
                    katNumarasi:rowToUpdate.katNumarasi,
                    odaNumarasi: rowToUpdate.odaNumarasi,
                    alarmType: rowToUpdate.category,
                    address: rowToUpdate.address,
                })
            })
            .then(response => {
                if (!response.ok) {
                // Hata durumunda konsola hata yazdır
                throw new Error('Network response was not ok');
                }
                console.log("TO DB postAlarmsAckData", rowToUpdate);
                // Başarı durumunda `localData`'yı güncellemeye gerek olmayabilir, işleme devam edebilirsiniz
                setLocalData(prevData => {
                // `prevData` mevcut `localData`'yı temsil eder
                // Sadece `rowToUpdate`'ı güncelle
                return prevData.map(row => 
                    row.id === id ? {
                    ...row,
                    acknowledgement: "Acknowledged",
                    ackTime: formatDateTime(new Date()),
                    status: "Waiting Repair/Control",
                    } : row
                );
                });
            })
            .catch(error => {
                console.error("POST error:", error);
            });
        } else {
        console.error("Row not found for id:", id);
        }
    };

    const handleMoreDetails = (row) => {
        setSelectedRow(row);
        console.log("selectedRow: ",row)
        handleOpen(); // Modal'ı aç
        console.log(JSON.stringify(row, null, 2));
    };

    const getChipColor = (status) => {
        if (status === "Acknowledged" || status === "Fixed") {
        return { backgroundColor: adminAlarmsTableRowsAcknowledgedColor };
        } else if (status === "Waiting Ack." || status === "Waiting Repair/Control") {
        return { backgroundColor: adminAlarmsTableRowsWaitingColor };
        } else {
        return { backgroundColor: "default", color: "default" };
        }
    };

    const parseDateString = (dateString) => {
        if (!dateString) return new Date(0); 
        const [date, time, period] = dateString.split(" ");
        const [year, month, day] = date.split("-");
        const [hours, minutes] = time.split(":");
        const hours24 =
            period === "P.M." ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12;
        return new Date(year, month - 1, day, hours24, minutes);
    };

    const sortedData = localData.sort((a, b) => {
        if (a.status === "Fixed" && b.status !== "Fixed") return 1; // `a` "Fixed" ve `b` değilse, `a`'yı sona taşı
        if (a.status !== "Fixed" && b.status === "Fixed") return -1; // `b` "Fixed" ve `a` değilse, `b`'yi sona taşı
    
        if (orderBy === "ackTime" || orderBy === "incidentTime") {
            const dateA = parseDateString(a[orderBy]);
            const dateB = parseDateString(b[orderBy]);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        } else {
            return order === "asc"
                ? a[orderBy].localeCompare(b[orderBy])
                : b[orderBy].localeCompare(a[orderBy]);
        }
    });

    const paginatedData = sortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const getCategoryIcon = (category) => {
        switch (category) {
        case "Lighting":
            return lightingIcon;
        case "HVAC":
            return hvacIcon;
        case "RCU":
            return rcuIcon;
        case "Helvar":
            return rcuIcon;
        case "Door Syst.":
            return doorSystIcon;
        case "PMS":
            return pmsIcon;
        case "Emergency": // aslında open door ve long inact birer emergency
            return emergIcon;
        case "Open Door":
            return openDoorIcon;
        case "Long Inact.":
            return longInactIcon;
        default:
            return null;
        }
    };

    const formatDateTimeForUI = (dateTimeString) => {

        // If dateTimeString is undefined or null, return null to render nothing
        if (!dateTimeString) {
            return null;
        }

        const [dateString, timeString] = dateTimeString.split(" ");
        const [year, month, day] = dateString.split("-");
        const [hours, minutes] = timeString.split(":");
    
        // Tarih ve saat nesnesi oluştur
        const date = new Date(year, month - 1, day, hours, minutes);
    
        // Saatleri 12 saat formatına dönüştür
        let formattedHours = date.getHours();
        const ampm = formattedHours >= 12 ? 'PM' : 'AM';
        formattedHours = formattedHours % 12;
        formattedHours = formattedHours ? formattedHours : 12; // Saat 0 ise 12 olarak göster
    
        // Formatlı tarih ve saat
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    
        return (
            <div>
                <div>{formattedDate}</div>
                <div>{formattedTime}</div>
            </div>
        );
    };

    const formatDateTimeForUITekSatir = (dateTimeString) => {

        if (!dateTimeString) {
            return null;
          }
          
        const [dateString, timeString] = dateTimeString.split(" ");
        const [year, month, day] = dateString.split("-");
        const [hours, minutes] = timeString.split(":");
    
        // Tarih ve saat nesnesi oluştur
        const date = new Date(year, month - 1, day, hours, minutes);
    
        // Saatleri 12 saat formatına dönüştür
        let formattedHours = date.getHours();
        const ampm = formattedHours >= 12 ? 'PM' : 'AM';
        formattedHours = formattedHours % 12;
        formattedHours = formattedHours ? formattedHours : 12; // Saat 0 ise 12 olarak göster
    
        // Formatlı tarih ve saat
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    
        return (
            <div>{formattedDate} {formattedTime}
            </div>
        );
    };

    return (
        <TableBody>
        {paginatedData.map((row) => (
            <TableRow key={row.id}
                sx={{
                    backgroundColor: row.status === "Fixed" ? "#616161" : "inherit", // Sarı arka plan rengi (#FFFACD)
                    '&:hover': {
                        backgroundColor: adminAlarmsTableRowsRowHoverBackground // Hover durumunda arka plan rengini biraz daha açık yapıyoruz
                    }
                }}>
            <TableCell sx={{ color: "white", padding: "16px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                    src={row.status === "Fixed" ? successIcon : alertIcon}
                    alt={row.status === "Fixed" ? "Success" : "Alert"}
                    style={{ width: "28px", height: "28px", marginRight: "12px" }}
                />
                <Typography sx={{ color: adminAlarmsTableRowsMalfunctionTextColor, fontSize: "18px" }}>
                    {row.malfunction}
                </Typography>
                </Box>
            </TableCell>

            <TableCell
                sx={{color: adminAlarmsTableRowsIncidentTimeTextColor ,fontSize: "18px",textAlign: "center",position: "relative"}}>
                <div style={{ textAlign: "center" }}>
                    {formatDateTimeForUI(row.incidentTime)}
                </div>
            </TableCell>
            
            <TableCell sx={{ color: "white", padding: "16px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                {getCategoryIcon(row.category) && (
                    <img
                    src={getCategoryIcon(row.category)}
                    alt={row.category}
                    style={{ width: "28px", height: "28px", marginRight: "12px" }}
                    />
                )}
                <Typography sx={{ color: adminAlarmsTableRowsCategoryTextColor, fontSize: "18px" }}>
                    {row.category}
                </Typography>
                </Box>
            </TableCell>
            <TableCell sx={{ padding: "16px" }}>
            {row.acknowledgement && row.acknowledgement !== "None" && (
                <Chip
                    label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {row.acknowledgement}
                        {row.acknowledgement === "Waiting Ack." && (
                        <img
                            src={waitingAckIcon}
                            alt="Waiting Ack."
                            style={{
                            width: "20px",
                            height: "20px",
                            marginLeft: "8px",
                            }}
                        />
                        )}
                    </Box>
                    }
                    sx={{
                    ...getChipColor(row.acknowledgement),
                    color: adminAlarmsTableRowsAcknowledgementTextColor,
                    fontSize: "16px",
                    cursor: row.acknowledgement === "Waiting Ack." ? "pointer" : "default",
                    "&:hover": {
                        backgroundColor: row.acknowledgement === "Waiting Ack." ? "#E72636" : "",
                    },
                    }}
                    onClick={() => {
                    if (row.acknowledgement === "Waiting Ack.") {
                        handleAcknowledge(row.id);
                    }
                    }}
                    clickable={row.acknowledgement === "Waiting Ack."}
                />
                )}
            </TableCell>
            <TableCell
                sx={{color: adminAlarmsTableRowsAckTimeTextColor,fontSize: "18px",textAlign: "center",position: "relative"}}>
                <div style={{ textAlign: "center" }}>
                    {row.acknowledgement === "Waiting Ack." ? "" : formatDateTimeForUI(row.ackTime)}
                </div>
            </TableCell>
            <TableCell sx={{ color: "white", padding: "16px" }}>
                {row.acknowledgement === "Acknowledged" && row.status !== "Fixed" ? (
                    <Chip
                    label="Waiting Repair/Control"
                    sx={{
                        ...getChipColor("Waiting Repair/Control"),
                        color: adminAlarmsTableRowsStatusTextColor,
                        fontSize: "16px",
                        "&:hover": {
                        backgroundColor: "#E72636",
                        },
                    }}
                    style={{ cursor: "pointer" }}
                    />
                ) : row.status === "Fixed" ? (
                    <Box>
                    <Chip
                        label={
                        <div style={{ textAlign: 'center' }}>
                            {row.status}<br />{formatDateTimeForUITekSatir(row.statusTime)}
                        </div>
                        }
                        sx={{
                        backgroundColor: "#49796B",
                        color: "white",
                        fontSize: "16px",
                        height: 'auto',
                        }}
                    />
                    </Box>
                ) : (
                    <Chip
                    label={row.status === "None" ? "" : row.acknowledgement}
                    sx={{
                        ...getChipColor(row.acknowledgement),
                        backgroundColor: row.status === "None" ? "transparent" : undefined,
                        color: row.status === "None" ? "transparent" : "white",
                        fontSize: "16px",
                        cursor: row.status === "None" ? "default" : undefined,
                        "&:hover": {
                        backgroundColor: row.status === "None" ? "transparent" : "#E72636",
                        },
                        pointerEvents: row.status === "None" ? "none" : "auto",
                        opacity: row.status === "None" ? 0.5 : 1,
                    }}
                    />
                )}
                </TableCell>
            <TableCell sx={{ padding: "16px" }}>
                <img
                src={moreDetailsIcon}
                alt="More Details"
                onClick={() => handleMoreDetails(row)}
                style={{
                    marginLeft: "50px",
                    cursor: "pointer",
                    width: "48px",
                    height: "24px",
                  }}
                />
            </TableCell>
            <Modal
                open={openMoreDetails}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{
                    '& .MuiBackdrop-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)', // Arka planı koyulaştırıyoruz
                    },
                  }}
          >
                <Box sx={{
                        position: 'absolute',
                        top: '25%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        border: '0px solid #000',
                        boxShadow: 0,
                        p: 4,
                        borderRadius: 4, // border radius ekledik
                        fontFamily: "Poppins"
                        }}>
                <h2 id="modal-title">Alarms Details</h2>
                {selectedRow && (
                    <div id="modal-description">
                        <p style={{ fontSize: '18px' , fontFamily: "Poppins"}}>
                        Room Number: {selectedRow.malfunction}
                        </p>
                        {selectedRow.category === "RCU" ? (
                        <div>
                            <p>{selectedRow.category}</p>
                            <p>{selectedRow.rcuAlarmDetails.ip}</p>
                        </div>
                        ) : selectedRow.category === "Helvar" ? (
                        <div>
                            <p>{selectedRow.category}</p>
                            <p>Helvar</p>
                        </div>
                        ) : selectedRow.category === "Lighting" ? (
                        <div>
                            <div>
                                <p>Lighting</p>
                                <p>Controller Type: {selectedRow.lightingAlarmDetails.controllerType}</p>
                                <p>Name: {selectedRow.lightingAlarmDetails.name}</p>
                                <p>Address: {selectedRow.lightingAlarmDetails.address}</p>
                                <p>Device Type: {selectedRow.lightingAlarmDetails.deviceType}</p>
                            </div>
                        </div>
                        ): selectedRow.category === "Emergency" ? (
                            <div>
                                <p>Open Door</p>
                            </div>
                        ) :(
                        <p>{selectedRow.category}</p>
                        )}
                    </div>
                    )}
            </Box>
          </Modal>
        </TableRow>
        ))}
        </TableBody>
    );
};

AlarmsTableRows.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default AlarmsTableRows;
