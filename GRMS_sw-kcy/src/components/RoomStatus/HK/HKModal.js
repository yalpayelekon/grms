
import React, { useState , useEffect} from 'react';
import SuccessAlert from '../../CommonComponents/SuccessAlert';
import ErrorAlert from '../../CommonComponents/ErrorAlert';
import { Box, Modal} from "@mui/material";
import DetailsView from "../../RoomServiceDetails/DetailsView";
import Fade from '@mui/material/Fade';

function HKModal({selectedHKOda = selectedHKOda, 
                  show = show, 
                  setShow = setShow,
                  blokNumarasi = blokNumarasi, 
                  katNumarasi = katNumarasi,
                  roomNumberForHK = roomNumberForHK}) {

    const [roomData, setRoomData] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] =  useState(null);
    const [showErrorAlert, setShowErrorAlert] =  useState(null);  
    
    const handleClose = () => {
      setShow(false);
      
    };
  
    return (
      <div> 
        {/* Başarılı alert */}
        {showSuccessAlert && (
          <SuccessAlert message="Veriler başarıyla kaydedildi." />
        )}
        {/* Hata alert */}
        {showErrorAlert && (
          <ErrorAlert message="Hata oluştu." />
        )}
        
        <Modal
          open={show}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)', // Arka planı koyulaştırıyoruz
            },
          }}
        >
          <Fade in={show} timeout={{ enter: 700, exit: 100 }}>
            <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1600,
                    bgcolor: 'background.paper',
                    border: '1px solid #000',
                    boxShadow: 0,
                    p: 4,
                    borderRadius: 4, // border radius ekledik
                    fontFamily: "Poppins"
                  }}>
            <h2 id="modal-title"></h2>
              <p id="modal-description" style={{ fontWeight: 'bold', fontFamily: 'Poppins', fontSize: "18px" }}>
                <span style={{ marginLeft: '24px' }}>
                Room: {selectedHKOda && selectedHKOda.length > 0 ? selectedHKOda[0].odaNumarasi : roomNumberForHK}
              </span>
              </p>
            
            <DetailsView selectedRowData={selectedHKOda}/>
          </Box>
        </Fade>
        </Modal>
    </div>
    )

}

export default HKModal;