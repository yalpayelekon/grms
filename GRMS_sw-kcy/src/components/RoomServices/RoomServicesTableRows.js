import { useState, useEffect } from "react";
import {TableBody, TableRow, TableCell, Chip, Box, Typography, Modal} from "@mui/material";
import PropTypes from "prop-types";
import { useMediaQuery } from '@mui/material';
import moreDetailsIcon from "../../assets/icons/roomServices/more-details/moreDetails.png";
import laundryIcon from "../../assets/icons/roomServices/delay-category/laundry.png";
import murIcon from "../../assets/icons/roomServices/delay-category/MUR.png";
import waitingAckIcon from "../../assets/icons/roomServices/acknowledgement/waiting.png";
import alertIcon from "../../assets/icons/roomServices/status-icons/error.png";
import successIcon from "../../assets/icons/roomServices/status-icons/success.png";
import statusAlertIcon from "../../assets/icons/roomServices/status-icons/error-Resp.png";
import DetailsView from "../RoomServiceDetails/DetailsView";
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik
import config from "../../config/config.json"

const RoomServicesTableRows = ({ page, rowsPerPage, order, orderBy, data }) => {

  const isSmallScreen = useMediaQuery('(max-width:1200px)'); 

  // admin
  const adminRoomServicesTableRowsRowHoverBackground = UISettingsData.adminRoomServicesTableRowsRowHoverBackground; // "#ffffff50"
  const adminRoomServicesTableRowsWaitingColor = UISettingsData.adminRoomServicesTableRowsWaitingColor; // "#ff0000"
  const adminRoomServicesTableRowsAcknowledgedColor = UISettingsData.adminRoomServicesTableRowsAcknowledgedColor; // "#00ff00"
  const adminRoomServicesTableRowsRoomIdTextColor = UISettingsData.adminRoomServicesTableRowsRoomIdTextColor; // "#ff0000"
  const adminRoomServicesTableRowsDelayCategoryTextColor = UISettingsData.adminRoomServicesTableRowsDelayCategoryTextColor; // "#00ff00"
  const adminRoomServicesTableRowsActivationTextColor = UISettingsData.adminRoomServicesTableRowsActivationTextColor; // "#0000ff"
  const adminRoomServicesTableRowsAcknowledgementTextColor = UISettingsData.adminRoomServicesTableRowsAcknowledgementTextColor; // "#ff0000"
  const adminRoomServicesTableRowsAckTimeTextColor = UISettingsData.adminRoomServicesTableRowsAckTimeTextColor; // "#00ff00"
  const adminRoomServicesTableRowsStatusTextColor = UISettingsData.adminRoomServicesTableRowsStatusTextColor; // "#0000ff"
  
  const [localData, setLocalData] = useState(data);
  const [openMoreDetails, setOpenMoreDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState([]);

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

    // console.log("rowToUpdate:",rowToUpdate)
    if (rowToUpdate) {
      const url = `${config.apiBaseUrl}${config.endpoints.postRoomServicesAckData}`;
      fetch(url, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blokNumarasi:rowToUpdate.blokNumarasi,  katNumarasi:rowToUpdate.katNumarasi ,roomId: rowToUpdate.roomId })
      })
      .then(response => {
        if (!response.ok) {
          // Hata durumunda konsola hata yazdır
          throw new Error('Network response was not ok');
        }
        console.log("TO DB postRoomServicesAckData", rowToUpdate);
        // Başarı durumunda `localData`'yı güncellemeye gerek olmayabilir, işleme devam edebilirsiniz
        setLocalData(prevData => {
          // `prevData` mevcut `localData`'yı temsil eder
          // Sadece `rowToUpdate`'ı güncelle
          return prevData.map(row => 
            row.id === id ? {
              ...row,
              acknowledgement: "Acknowledged",
              ackTime: formatDateTime(new Date()),
              status: "Waiting Repair",
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

  const handleFix = (id, category) => {
    const updatedData = localData.map((row) => {
      if (row.id === id) {
        const newStatus = category === "MUR" ? "Cleaned" : "Collected";
        return {
          ...row,
          status: newStatus,
          fixedTime: formatDateTime(new Date()),
          acknowledgement: "",
        };
      }
      return row;
    });
    setLocalData(updatedData);
  };

  const fetchRoomDetailData = (row) => { // room service de bulunana room report datasi db den alinir

    const blokNumber = row.blokNumarasi;
    const katNumber = row.katNumarasi;
    const oda_number = row.roomId;
    
    const url = `${config.apiBaseUrl}${config.endpoints.getRoomDetailsData}/${blokNumber}/${katNumber}/${oda_number}/`;
    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data && data.roomDetail) {
          console.log("getRoomDetailsData", data)
          console.log("getRoomDetailsData.roomDetail", data.roomDetail)
          setSelectedRowData(data.roomDetail);
          handleOpen(); // Modal'ı aç
      }
      })
      .catch(error => {
        console.error("Veri alinamadi:", error);
      });
    // setSelectedRowData(dataJson);
  };

  const handleMoreDetails = (row) => {
    console.log("Room Service Details Selected row: ",row);
    setSelectedRow(row);
    fetchRoomDetailData(row)
  };

  const getChipColor = (status) => {
    switch (status) {
      case "Acknowledged":
      case "Cleaned":
      case "Collected":
        return { backgroundColor: adminRoomServicesTableRowsAcknowledgedColor, color: "white" };
      case "Waiting Ack.":
      case "Waiting Repair":
      case "Waiting Resp.":
        return { backgroundColor: adminRoomServicesTableRowsWaitingColor, color: "white" };
      default:
        return { backgroundColor: "default", color: "default" };
    }
  };

  const timeStyle = { color: "white", fontSize: "0.875rem", marginTop: 1 };

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
    if (a.status === "Cleaned" && b.status !== "Cleaned") return 1; 
    if (a.status !== "Cleaned" && b.status === "Cleaned") return -1; 

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

  const getCategoryIcon = (delayCategory) => {
    switch (delayCategory) {
      case "Laundry":
        return laundryIcon;
      case "MUR":
        return murIcon;
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

const formatDuration = (minutes) => {
  if (minutes < 60) {
      // Less than an hour
      return `${minutes} m.`;
  } else {
      // More than an hour
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} h. ${remainingMinutes} m.`;
  }
};

return (
  <TableBody>
    {paginatedData.map((row) => (
      <TableRow key={row.id}
                sx={{
                  backgroundColor: row.status === "Cleaned" ? "#616161" : "inherit", 
                  '&:hover': {
                      backgroundColor: adminRoomServicesTableRowsRowHoverBackground
                  }
              }}>
        <TableCell sx={{ color: "white", padding: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={
                row.status === "Cleaned" || row.status === "Collected"
                  ? successIcon
                  : alertIcon
              }
              alt={
                row.status === "Cleaned" || row.status === "Collected"
                  ? "Success"
                  : "Alert"
              }
              style={{ width: "28px", height: "28px", marginRight: "12px" }}
            />
            <Typography sx={{ color: adminRoomServicesTableRowsRoomIdTextColor, fontSize: "18px" }}>
              {row.roomId}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ color: "white", padding: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Category Icon */}
              {getCategoryIcon(row.delayCategory) && (
                <img
                  src={getCategoryIcon(row.delayCategory)}
                  alt={row.delayCategory}
                  style={{ width: "28px", height: "28px", marginRight: "12px" }}
                />
              )}
              
              {/* Category Text */}
              <Typography sx={{ color: adminRoomServicesTableRowsDelayCategoryTextColor, fontSize: "18px" }}>
                {row.delayCategory}
              </Typography>
              
              {/* Delay Duration */}
              {row.status !== "Cleaned" && (
                <Box
                  sx={{
                    backgroundColor: row.status === "Cleaned" || row.status === "Collected" ? "transparent" : "#E72636",
                    borderRadius: "10px",
                    color: adminRoomServicesTableRowsDelayCategoryTextColor,
                    fontSize: "14px",
                    width: '100px', // Fixed width for background
                    height: "22px",
                    display: 'flex', // Use flexbox to center content
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center', // Center vertically
                    padding: '4px', // Padding inside the container
                    marginLeft: "8px", // Space between category and duration
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Typography sx={{ fontFamily: "Poppins" }}>
                    {formatDuration(row.delayDuration)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </TableCell>

        <TableCell
              sx={{color: adminRoomServicesTableRowsActivationTextColor,fontSize: "18px",textAlign: "center",position: "relative"}}>
              <div style={{ position: "absolute", left: "30px", top: "10px", textAlign: "center" }}>
                  {formatDateTimeForUI(row.activation)}
              </div>
        </TableCell>

        <TableCell sx={{ padding: "16px" }}>
          <Chip
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {row.acknowledgement !== "None" && row.acknowledgement}
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
              backgroundColor:
                row.acknowledgement === "" || row.acknowledgement === "None"
                  ? "transparent"
                  : getChipColor(row.acknowledgement).backgroundColor,
              color:
              adminRoomServicesTableRowsAcknowledgementTextColor,
              fontSize: "16px",
              cursor:
                row.acknowledgement === "Waiting Ack."
                  ? "pointer"
                  : "default",
              "&:hover": {
                backgroundColor:
                  row.acknowledgement === "Waiting Ack." ? "#E72636" : "",
              },
            }}
            onClick={() => {
              if (row.acknowledgement === "Waiting Ack.") {
                handleAcknowledge(row.id);
              }
            }}
            clickable={row.acknowledgement === "Waiting Ack."}
          />
        </TableCell>
        <TableCell
              sx={{color: adminRoomServicesTableRowsAckTimeTextColor,fontSize: "18px",textAlign: "center",position: "relative"}}>
              <div style={{  textAlign: "center" }}>
                {row.acknowledgement === "Waiting Ack." ? "" : formatDateTimeForUI(row.ackTime)}
              </div>
        </TableCell>
        <TableCell sx={{ color: "white", padding: "16px" }}>
          {row.acknowledgement === "Acknowledged" &&
          row.status !== "Cleaned" &&
          row.status !== "Collected" ? (
            <Chip
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={statusAlertIcon}
                    alt="Status Alert"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                  Waiting Resp.
                </Box>
              }
              sx={{
                ...getChipColor("Waiting Resp."),
                color: adminRoomServicesTableRowsStatusTextColor,
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#E72636",
                },
              }}
              // onClick={() => handleFix(row.id, row.delayCategory)} // kcy room service sayfasi waiting resp. tiklanamaz yaptim
              style={{ cursor: "pointer" }}
            />
          ) : row.status === "Cleaned" || row.status === "Collected" ? (
            <Box>
              <Chip
                label=
                {
                  <div style={{ textAlign: 'center' }}>
                    {row.status}: {formatDuration(row.delayDuration)}<br />{formatDateTimeForUITekSatir(row.statusTime)}
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
          ) : null}
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
      backgroundColor: 'rgba(0, 0, 0, 0.05)', // Darkens the background
    },
  }}
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: isSmallScreen ? 800 : 1000,
      maxWidth: 1000, // Maximum width (can expand to 1600px)
      bgcolor: 'background.paper',
      border: '0px solid #000',
      boxShadow: 0,
      p: 4,
      borderRadius: 4,
      // fontFamily: 'Poppins',
      overflowX: 'auto', // Horizontal scroll if content exceeds width
      whiteSpace: 'nowrap', // Prevents wrapping of content
      justifyContent: 'flex-start', // Aligns content to the start (left)
    }}
  >
    <h2 id="modal-title"></h2>
    {selectedRow && (
      <p id="modal-description" style={{ fontWeight: 'bold', fontSize: "18px" }}>
        <span style={{ marginLeft: '24px' }}>
          Room: {selectedRow.roomId}
        </span>
        <DetailsView selectedRowData={selectedRowData} />
      </p>
    )}
  </Box>
</Modal>

      </TableRow>
    ))}
  </TableBody>
  );
};

RoomServicesTableRows.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default RoomServicesTableRows;
