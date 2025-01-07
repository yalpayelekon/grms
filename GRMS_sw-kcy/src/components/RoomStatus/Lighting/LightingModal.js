import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box, Grid, List, ListItem, ListItemText, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import { Form,  Button, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UISettingsData from '../../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik
import config from "../../../config/config.json"

const LightingModal = ({ selectedLightingOda, isLightingModalOpen, setIsLightingModalOpen, onClickHVAC=onClickHVAC }) => {
    
    // admin
    const adminLightingModalInfoMessageTitle = UISettingsData.adminLightingModalInfoMessageTitle || "Infos";
    const adminLightingModalInfoMessageSubTitle = UISettingsData.adminLightingModalInfoMessageSubTitle || 'Data is saved successfullyy.';
    const adminLightingModalAlertMessageTitle = UISettingsData.adminLightingModalAlertMessageTitle || "Errors";
    const adminLightingModalAlertMessageSubTitle =  UISettingsData.adminLightingModalAlertMessageSubTitle || 'Data is not saved successfullyy.';  
    const adminLightingModalHVACButtonColor = UISettingsData.adminControlPanelLightingButton || '#A8C5DA'; // bunun ayari ile hvac da lighting butonu rengi ayari ayni

    const imgRef = useRef(null);
    const [localLightingOda, setLocalLightingOda] = useState({
        blokNumarasi: "",
        katNumarasi: "",
        odaNumarasi: "",
        deviceType: "",
        ip: "",
        outputDevices: []
    });

    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedDeviceName, setSelectedDeviceName] = useState(null); // Liste için seçilen cihaz adı
    const [selectedDeviceAddress, setSelectedDeviceAddress] = useState(null); // Liste için seçilen cihaz adresi

    useEffect(() => {
        setLocalLightingOda(selectedLightingOda || {
            blokNumarasi: "",
            katNumarasi: "",
            odaNumarasi: "",
            deviceType: "",
            ip: "",
            outputDevices: []
        });
    }, [selectedLightingOda]);

    const handleClose = () => setIsLightingModalOpen(false);

    const handleDeviceClick = (device) => {
        setSelectedDevice(device);
        setSelectedDeviceName(device.name); // Liste seçimi için cihaz adını güncelle
        setSelectedDeviceAddress(device.address); // Liste seçimi için cihaz adresini güncelle

        // Listeyi güncellemek için seçili cihazın adını ve adresini bul
        const selectedDeviceName = device.name;
        const selectedDeviceAddress = device.address;

        // Cihazı seçili hale getir
        const updatedDevices = localLightingOda.outputDevices.map((d) => ({
            ...d,
            isSelected: d.name === selectedDeviceName && d.address === selectedDeviceAddress // Seçili cihaz ile eşleşenleri işaretle
        }));

        setLocalLightingOda({
            ...localLightingOda,
            outputDevices: updatedDevices
        });
    };

    const handleButtonClick = (device) => {
        // Seçili cihazı güncelle
        setSelectedDevice(device);

        // Listeyi güncellemek için seçili cihazın adını ve adresini bul
        const selectedDeviceName = device.name;
        const selectedDeviceAddress = device.address;

        // Cihazı seçili hale getir
        const updatedDevices = localLightingOda.outputDevices.map((d) => ({
            ...d,
            isSelected: d.name === selectedDeviceName && d.address === selectedDeviceAddress // Seçili cihaz ile eşleşenleri işaretle
        }));

        setLocalLightingOda({
            ...localLightingOda,
            outputDevices: updatedDevices
        });

        setSelectedDeviceName(selectedDeviceName); // Liste seçimi için cihaz adını güncelle
        setSelectedDeviceAddress(selectedDeviceAddress); // Liste seçimi için cihaz adresini güncelle
    };

    const ScrollableList = styled('div')(({ theme }) => ({
        maxHeight: 650, // Sabit yükseklik
        overflowY: 'auto', // Y ekseninde scroll
        border: `1px solid ${theme.palette.divider}`, // Opsiyonel: border eklemek
        padding: theme.spacing(1) // Opsiyonel: padding eklemek
    }));

    const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
        padding: theme.spacing(0.5), // Satırlar arası mesafeyi daraltmak için padding ayarları
        backgroundColor: selected ? 'yellow' : 'transparent', // Seçili satır için arka plan rengi
        color: selected ? 'black' : 'inherit', // Seçili satırda yazı rengini ayarla
    }));

    const handleSwitchChange = (event) => {
        if (selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                isOn: event.target.checked
            });
        }
    };

    const handleHVACChange = (number) => {
        handleClose()

        // 1 saniye bekle
        setTimeout(() => {
            onClickHVAC(number);
        }, 400);
      };

    const handleChange = (event) => {
        let value = event.target.value;

        if (value < 0) {
            value = 0;
        } else if (value > 254) {
            value = 254;
        }

        if (selectedDevice) {
            setSelectedDevice({
                ...selectedDevice,
                actualLevel: value
            });

            const updatedDevices = localLightingOda.outputDevices.map((device) =>
                device.name === selectedDevice.name && device.address === selectedDevice.address
                    ? { ...device, actualLevel: value }
                    : device
            );

            setLocalLightingOda({
                ...localLightingOda,
                outputDevices: updatedDevices
            });
        }
    };


    const handleActualLevelChange = (odaNumarasi) => {
        console.log('Selected Device Information:');
        console.log('Name:', selectedDevice.name);
        console.log('Address:', selectedDevice.address);
        console.log('Status:', selectedDevice.status);
        console.log('Device Type:', selectedDevice.deviceType);
        console.log('Actual Level:', selectedDevice.actualLevel);
        console.log('Blok Numarasi:', localLightingOda.blokNumarasi);
        console.log('Kat Numarasi:', localLightingOda.katNumarasi);
        console.log('Oda Numarasi:', localLightingOda.odaNumarasi);
        console.log('ip:', localLightingOda.ip);

        const url = `${config.apiBaseUrl}${config.endpoints.putControllerActualLevelData}/${localLightingOda.ip}`;
        // const url = `http://127.0.0.1:8000/putControllerActualLevelData/${localLightingOda.blokNumarasi}/${localLightingOda.katNumarasi}/${localLightingOda.odaNumarasi}/${localLightingOda.ip}`
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: selectedDevice.name,
                address: selectedDevice.address,
                status: selectedDevice.status,
                deviceType: selectedDevice.deviceType,
                actualLevel: selectedDevice.actualLevel
            })
        }).then(response => {
            console.log("putControllerActualLevelData:", response )
            if (!response.ok) {
                console.log("putControllerActualLevelData hatasi")
                setIsLightingModalOpen(false)
                Swal.fire({
                    title: adminLightingModalAlertMessageTitle,
                    text: adminLightingModalAlertMessageSubTitle,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
                throw new Error('Network response was not ok');
            }

            setIsLightingModalOpen(false)
            
            Swal.fire({
                title: adminLightingModalInfoMessageTitle,
                text: adminLightingModalInfoMessageSubTitle,
                icon: 'info',
                confirmButtonText: 'Ok',
            });
        })
        .catch(error => {
            console.error("PUT error:", error);
        });

    };

    const handleGetScaledCoordinates = (btn, imgRef) => {
        if (!imgRef.current) return {};
    
        const imgElement = imgRef.current;
        const naturalWidth = imgElement.naturalWidth;
        const naturalHeight = imgElement.naturalHeight;
        const displayedWidth = imgElement.clientWidth;
        const displayedHeight = imgElement.clientHeight;
    
        const scaleX = displayedWidth / naturalWidth;
        const scaleY = displayedHeight / naturalHeight;
    
        const scaledCoordinates = {
            scaledX1: btn.x1 ? btn.x1 * scaleX : null,
            scaledY1: btn.y1 ? btn.y1 * scaleY : null,
            scaledX2: btn.x2 ? btn.x2 * scaleX : null,
            scaledY2: btn.y2 ? btn.y2 * scaleY : null,
        };
    
        return scaledCoordinates;
    };

    return (
        <Modal
            open={isLightingModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Arka planı koyulaştırıyoruz
                },
            }}
        >
            <Fade in={isLightingModalOpen} timeout={{ enter: 700, exit: 300 }}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1000,
                    height: 800,
                    bgcolor: 'background.paper',
                    border: '1px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2, // border radius ekledik
                    fontFamily: "Poppins"
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '13px' }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            id="modal-title"
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: '22px',
                                marginBottom: '13px',
                            }}
                            >
                            Room: {localLightingOda.odaNumarasi} -- {localLightingOda.deviceType}: {localLightingOda.ip}
                        </Typography>
                        <Button
                            style={{
                                marginLeft: 'auto',  // Push the button to the right
                                fontFamily: 'Poppins',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                backgroundColor: adminLightingModalHVACButtonColor,  // Bootstrap primary color
                                border: adminLightingModalHVACButtonColor,
                                color: "black"
                            }}
                            onClick={() => handleHVACChange(localLightingOda.odaNumarasi)} // Butona tıklanınca fonksiyon çağrılır
                            sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '14px' }}
                        >
                            HVAC
                        </Button>
                    </Box>
                    <Grid container spacing={2} sx={{ backgroundColor: 'white' }}>
                        {/* Sol Taraf - Liste */}
                        <Grid item xs={3}>
                            <ScrollableList>
                                <List>
                                    {localLightingOda.outputDevices.length > 0 ? (
                                        localLightingOda.outputDevices.map((device, index) => (
                                            <StyledListItem 
                                                button
                                                key={index}
                                                onClick={() => handleDeviceClick(device)}
                                                selected={selectedDeviceName === device.name && selectedDeviceAddress === device.address} // Seçili cihazı kontrol et
                                            >
                                                <ListItemText 
                                                    primary={`${device.name} - (Address: ${device.address})`} // Ad ve adresi birleştirerek göster
                                                />
                                            </StyledListItem>
                                        ))
                                    ) : (
                                        <Typography variant="body1" sx={{ color: 'white' }}>
                                            No devices available.
                                        </Typography>
                                    )}
                                </List>
                            </ScrollableList>
                        </Grid>
                        {/* Sağ Taraf - Detaylar */}
                        <Grid item xs={9} sx={{ backgroundColor: 'white' }}>
                            <Grid container spacing={0}>
                                {/* İlk Satır: Kırmızı Arka Plan ve İçerik */}
                                <Grid item xs={12} sx={{ backgroundColor: 'white', height: '280px', padding: 2 }}>
                                    {selectedDevice ? (
                                        <Typography 
                                            variant="body1" 
                                            sx={{ color: 'black', display: 'flex', alignItems: 'center', fontWeight: '600',fontSize: '16px', fontFamily: "Poppins" }}
                                        >
                                            <Box sx={{ flexGrow: 1 }}>
                                                <div class="container">
                                                    <strong>Device Name:</strong> {selectedDevice.name}<br />
                                                    <strong>Address:</strong> {selectedDevice.address}<br />
                                                    <strong>Status:</strong> {selectedDevice.status}<br />
                                                    <strong>Device Type:</strong> {selectedDevice.deviceType}
                                                    {/* <strong>Actual Level:</strong> {selectedDevice.actualLevel}<br /> */}
                                                    <Form.Group controlId="setActualLevel" style={{ display: 'flex', alignItems: 'center', width: '250px', whiteSpace: 'nowrap' }}>
                                                        <Form.Label
                                                            style={{
                                                            fontWeight: '600',
                                                            fontSize: '16px',
                                                            fontFamily: "Poppins",
                                                            marginRight: '10px'
                                                            }}
                                                        >
                                                            Actual Level:
                                                        </Form.Label>
                                                        <InputGroup>
                                                            <Form.Control 
                                                            type="number"
                                                            value={selectedDevice.actualLevel}
                                                            onChange={handleChange}
                                                            style={{ height: '25px', alignItems: 'center', display: 'flex', justifyContent: 'center', borderColor: "black", width: '80px', marginTop: "-10px" }} 
                                                            />
                                                        </InputGroup>
                                                        <Button
                                                            style={{
                                                                fontFamily: 'Poppins',
                                                                fontWeight: '600',
                                                                fontSize: '14px',
                                                                backgroundColor: '#A8C5DA',  // Bootstrap primary color
                                                                border: '#A8C5DA',
                                                                color: "black",
                                                                height: "25px", 
                                                                marginTop: "-10px",
                                                                marginLeft: "10px",
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }} 
                                                            onClick={() => handleActualLevelChange(localLightingOda.odaNumarasi)} // Butona tıklanınca fonksiyon çağrılır
                                                        >
                                                            SET
                                                    </Button>
                                                    </Form.Group>
                                                </div>
                                            </Box>
                                        </Typography>
                                    ) : (
                                        <Typography variant="body1" sx={{ color: 'white' }}>
                                            Select a device to see details.
                                        </Typography>
                                    )}
                                </Grid>
                                
                                <Grid item xs={12} sx={{ backgroundColor: 'white', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        {localLightingOda.roomPlanImage ? (
                                            <img 
                                                src={localLightingOda.roomPlanImage} 
                                                alt="Room Plan" 
                                                ref={imgRef} 
                                                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 10 }} 
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                                Image cannot be found.
                                            </Typography>
                                        )}
                                        {/* Butonlar */}
                                        {localLightingOda.outputDevices.map((device, index) => {
                                            return device.roomButton ? device.roomButton.map((btn, btnIndex) => {
                                                const buttonColor = device.status === 'No' ? 'green' : 'red';
                                                const lineColor = device.status === 'No' ? 'green' : 'red';
                                                const isSelected = selectedDevice && selectedDevice.name === device.name && selectedDevice.address === device.address;
                                                const scaledCoordinates = handleGetScaledCoordinates(btn, imgRef);
                                                return (
                                                    <React.Fragment key={`${index}-${btnIndex}`}>
                                                        {btn.x2 === "" && btn.y2 === "" && (
                                                            <Tooltip 
                                                                title={device.name}
                                                                placement="top"
                                                                arrow
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: `${scaledCoordinates.scaledY1}px`,
                                                                        left: `${scaledCoordinates.scaledX1}px`,
                                                                        width: '15px',
                                                                        height: '15px',
                                                                        backgroundColor: buttonColor,
                                                                        borderRadius: '50%',
                                                                        transform: 'translate(-50%, -50%)',
                                                                        cursor: 'pointer',
                                                                        border: isSelected ? '3px solid white' : '1px solid black',
                                                                        opacity: 1,
                                                                    }}
                                                                    onClick={() => handleButtonClick(device)}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                        {btn.x2 !== "" && btn.y2 !== "" && (
                                                            <svg
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    pointerEvents: 'none',
                                                                }}
                                                            >
                                                                <line
                                                                    x1={scaledCoordinates.scaledX1}
                                                                    y1={scaledCoordinates.scaledY1}
                                                                    x2={scaledCoordinates.scaledX2}
                                                                    y2={scaledCoordinates.scaledY2}
                                                                    stroke={lineColor}
                                                                    strokeWidth={4}
                                                                    onClick={() => handleButtonClick(device)}
                                                                    style={{ 
                                                                        cursor: 'pointer', 
                                                                        pointerEvents: 'visibleStroke', 
                                                                        stroke: lineColor, 
                                                                        stroke: isSelected ? 'white' : lineColor,}}
                                                                />
                                                                <circle
                                                                    cx={scaledCoordinates.scaledX1}
                                                                    cy={scaledCoordinates.scaledY1}
                                                                    r="7"
                                                                    fill={lineColor}
                                                                    onClick={() => handleButtonClick(device)}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        pointerEvents: 'visiblePainted',
                                                                        stroke: isSelected ? 'white' : 'black',
                                                                        strokeWidth: isSelected ? 2 : 0,
                                                                    }}
                                                                />
                                                                <circle
                                                                    cx={scaledCoordinates.scaledX2}
                                                                    cy={scaledCoordinates.scaledY2}
                                                                    r="7"
                                                                    fill={lineColor}
                                                                    onClick={() => handleButtonClick(device)}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        pointerEvents: 'visiblePainted',
                                                                        stroke: isSelected ? 'white' : 'black',
                                                                        strokeWidth: isSelected ? 2 : 0,
                                                                    }}
                                                                />
                                                            </svg>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            }) : null;
                                        })}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        </Modal>
    );
};

export default LightingModal;