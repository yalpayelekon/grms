import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ControlPanel from './ControlPanel';
import SuccessAlert from '../../CommonComponents/SuccessAlert';
import ErrorAlert from '../../CommonComponents/ErrorAlert';
import '../../../css/style.css'; // CSS dosyasını ekleyin
import Swal from 'sweetalert2';
import UISettingsData from '../../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function MekanikModal({ selectedHVACOda, show, setShow, blokNumarasi, katNumarasi, onClickLighting }) {
    
    // admin
    const adminMekanikModalInfoMessageTitle = UISettingsData.adminMekanikModalInfoMessageTitle || "Info";
    const adminMekanikModalInfoMessageSubTitle = UISettingsData.adminMekanikModalInfoMessageSubTitle || 'Data is saved successfully.';
    const adminMekanikModalAlertMessageTitle = UISettingsData.adminMekanikModalAlertMessageTitle || "Error";
    const adminMekanikModalAlertMessageSubTitle =  UISettingsData.adminMekanikModalAlertMessageSubTitle || 'HVAC Communication Error';  
    
    const [roomData, setRoomData] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(null);
    const [showErrorAlert, setShowErrorAlert] = useState(null);

    useEffect(() => {
        if (selectedHVACOda) {
            setRoomData(selectedHVACOda.roomStatusHVACData);
        }
    }, [selectedHVACOda]);

    useEffect(() => {
        const handleOverflow = () => {
            if (show) {
                document.body.style.overflow = 'hidden';

                const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                if (scrollBarWidth > 0) {
                    document.body.style.paddingRight = `${scrollBarWidth}px`;
                }
            } else {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }
        };

        handleOverflow();

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [show]);

    const handleClose = () => {
        setShow(false);
    };

    const updateRoomData = (data) => {
        setRoomData(prevState => ({ ...prevState, ...data }));
    };

    const handleSave = () => {
        setShow(false);
        console.log("selectedHVACOda: ",selectedHVACOda)
        if (selectedHVACOda.roomStatusHVACData.comError === "1") {
            Swal.fire({
                title: adminMekanikModalAlertMessageTitle,
                text: adminMekanikModalAlertMessageSubTitle,
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#28a745' // Green color
            });
            return; // İşlemi durdur
        }
        fetch(`http://127.0.0.1:8000/putRoomStatusHVACData/${blokNumarasi}/${katNumarasi}/${selectedHVACOda.odaNumarasi}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(roomData)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // setShowSuccessAlert(true);
            Swal.fire({
                title: adminMekanikModalInfoMessageTitle,
                text: adminMekanikModalInfoMessageSubTitle,
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#49796B' 
            });
        })
        .catch(error => {
            console.error("PUT error:", error);
            setShowErrorAlert(true);
        });

        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 1000);

        setTimeout(() => {
            setShowErrorAlert(false);
        }, 1000);
    };

    const handleLightingChange = () => {
        handleClose();
        
        setTimeout(() => {
          onClickLighting(selectedHVACOda.odaNumarasi);
      }, 400);
    };

    return (
        <div>
            {showSuccessAlert && (
                <SuccessAlert message="Data was saved successfully." />
            )}
            {showErrorAlert && (
                <ErrorAlert message="Data saving error." />
            )}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title style={{
                        fontFamily: 'Poppins',
                        fontWeight: 'bold',
                        fontSize: '22px',
                    }}>
                        Room: {selectedHVACOda?.odaNumarasi}
                    </Modal.Title>
                    <Button
                        style={{
                            marginLeft: 'auto',
                            fontFamily: 'Poppins',
                            fontWeight: '600',
                            fontSize: '14px',
                            backgroundColor: '#A8C5DA',
                            border: '#A8C5DA',
                            color: "black",
                            borderRadius: 34,
                        }}
                        onClick={handleLightingChange}
                    >
                        LIGHTING
                    </Button>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '800px', overflowY: 'auto' }}>
                    <ControlPanel selectedHVACOda={selectedHVACOda} updateRoomData={updateRoomData} />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{
                            backgroundColor: '#49796B',
                            color: '#FFFFFF',
                            borderColor: '#49796B',
                            fontFamily: "Poppins",
                            fontWeight: "bold",
                            fontSize: "14px"
                        }}
                        onClick={handleSave}>Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MekanikModal;