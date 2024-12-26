import React from 'react';
import {Box, Stack, Button} from '@mui/material';

import LightingActive from '../../icons/roomStatus/LightingActive.png';
import AnyLightingActive from '../../icons/roomStatus/AnyLightingActive.png';
import HvacActive from '../../icons/roomStatus/HvacActive.png';
import HvacActiveCold from '../../icons/roomStatus/HvacActiveCold.png';
import HvacActiveHot from '../../icons/roomStatus/HvacActiveHot.png';
import dnd from '../../icons/roomStatus/dnd.png';
import dndyellow from '../../icons/roomStatus/dndyellow.png';
import lnd from '../../icons/roomStatus/lnd.png';
import lndyellow from '../../icons/roomStatus/lndyellow.png';
import lndDelayed from '../../icons/roomStatus/lndDelayed.png';
import mur from '../../icons/roomStatus/mur.png';
import muryellow  from '../../icons/roomStatus/muryellow.png';
import murDelayed from '../../icons/roomStatus/murDelayed.png';
import redadamvaliz from '../../icons/roomStatus/redadamvaliz.png';
import redvaliz from '../../icons/roomStatus/redvaliz.png';
import greenadamvaliz from '../../icons/roomStatus/greenadamvaliz.png';
import greenhousekeeping from '../../icons/roomStatus/greenhousekeeping.png'
import greenvaliz from '../../icons/roomStatus/greenvaliz.png';
import white from '../../icons/roomStatus/white.png';
import whitehousekeeping from '../../icons/roomStatus/whitehousekeeping.png';
import onlyRed from '../../icons/roomStatus/onlyRed.png';
import redhousekeeping from '../../icons/roomStatus/redhousekeeping.png';
import Tooltip from '@mui/material/Tooltip';
import delayedIcon from '../../icons/roomStatus/delayed.png';

const buttonWidth = 100
const buttonHeight = 100

const HKWidth = 23
const HKHeight = 28

const LightingHVACWidth = 33
const LightingHVACHeight = 33

const ModalItem = ({ onClickHVAC, onClickLighting, onClickHK, number, roomStatus, isLigthingVisible, isHVACVisible, isHKVisible, opacity, roomStateErrorList}) => {
  
  const handleHVACChange = () => {
    onClickHVAC(number);
  };

  const handleLightingChange = () => {
    onClickLighting(number);
  };

  const handleHKChange = () => {
    onClickHK(number);
  };

  // Tooltip içeriği olarak gösterilecek mesajı oluştur
  const tooltipContent = roomStateErrorList.length > 0 ? (
    <div style={{ textAlign: 'center' }}>
      {roomStateErrorList.map((error, index) => (
        <p key={index} style={{ margin: 0, fontSize: '15px' }}>
          {error}
        </p>
      ))}
    </div>
  ) : null; // Eğer liste boşsa tooltip içeriği null olur

  const tooltipContentLighting = (
    <div style={{ textAlign: 'center', fontSize: '14px', padding: '5px', fontFamily: "Poppins", color: "white", backgroundColor: "transparent" }}>
      Lighting
    </div>
  );

  const tooltipContentHVAC = (
    <div style={{ textAlign: 'center', fontSize: '14px', padding: '5px', fontFamily: "Poppins", color: "white", backgroundColor: "transparent" }}>
      HVAC
    </div>
  );

  const tooltipContentHK = (
    <div style={{ textAlign: 'center', fontSize: '14px', padding: '5px', fontFamily: "Poppins", color: "white", backgroundColor: "transparent" }}>
      House Keeping
    </div>
  );

  
  return(
    <Box sx={{padding: 2 ,borderRadius: '10px'}}>
      <Box position="relative" display="inline-block">
        <Tooltip title={tooltipContent} placement="top" arrow>
          <Button id="1" variant="contained" style={{ width: buttonWidth, height: buttonHeight, borderRadius: '10px' , background:'transparent', opacity:opacity, boxShadow: 'none'}} disableRipple>
          <img  src=
              {
                roomStatus ? 
                (
                  roomStatus.roomState === "0" ? 
                  white : 
                  roomStatus.roomState === "1" ? 
                  whitehousekeeping : 
                  roomStatus.roomState === "2" ? 
                  greenvaliz : 
                  roomStatus.roomState === "3" ? 
                  greenadamvaliz : 
                  roomStatus.roomState === "4" ? 
                  greenhousekeeping : 
                  roomStatus.roomState === "5" ? 
                  redvaliz : 
                  roomStatus.roomState === "6" ? 
                  redadamvaliz : 
                  roomStatus.roomState === "7" ? 
                  onlyRed : 
                  roomStatus.roomState === "8" ? 
                  redhousekeeping : 
              
                  null
                ) 
                : null
              }
            alt="Icon" 
            style={{ width: buttonWidth, height: buttonHeight, cursor: 'pointer' }} 
          />
          </Button>
        </Tooltip>
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
          style={{
            position: 'absolute',
            top: '-1%',
            left: '4%',
            backgroundColor: 'rgba(255, 255, 255, 0.0)', // Şeffaf arka plan
            padding: '2px',
            borderRadius: '16px',
            fontFamily: 'Poppins',
            fontWeight: '600', //yazı kalınlığı
            fontSize: '16px',
            opacity:opacity
          }}
        >
          <div style={{
            display: 'inline-block',
            maxWidth: '40px',  // Maksimum genişlik
            whiteSpace: 'normal',  // Satırlara yayılmasını sağlar
          }}>
            {number}
          </div>
        </Stack>
  
        {/* Lighting and HVAC */}
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
          style={{
            position: 'absolute',
            top: "-10%",
            right: "-20%",
            backgroundColor: 'transparent',
            padding: '2px',
            borderRadius: '8px',
            opacity:opacity
          }}
        >
          <Tooltip title={tooltipContentLighting} placement="top" arrow>
          {roomStatus?.isLightingConnedted === "1" && (
            <img
              id="2"
              src={roomStatus ? 
                (roomStatus.isAnyLightingActive === "1" ? LightingActive : AnyLightingActive) 
                : null}
              alt="Lighting Icon"
              style={{
                width: LightingHVACWidth, 
                height: LightingHVACHeight, 
                cursor: 'pointer', 
                display: isLigthingVisible ? 'block' : 'none',
                transition: 'transform 0.3s', // Geçiş efekti
              }}
              onClick={handleLightingChange}
              // Hover etkisi için inline stil
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          )}
          </Tooltip>

          <Tooltip title={tooltipContentHVAC} placement="top" arrow>
          {roomStatus?.isHVACConnected === "1" && (
            <img
              src={
                roomStatus ?
                (
                    roomStatus.isHvacActive === "0" ? 
                    HvacActive : 
                    roomStatus.isHvacActive === "1" ? 
                    HvacActiveCold : 
                    roomStatus.isHvacActive === "2" ? 
                    HvacActiveHot : 
                    null
                ) 
                : null
              }
              alt="HVAC Icon"
              style={{
                width: LightingHVACWidth, 
                height: LightingHVACHeight, 
                cursor: 'pointer', 
                display: isHVACVisible ? 'block' : 'none',
                transition: 'transform 0.3s', // Geçiş efekti
              }}
              onClick={handleHVACChange}
              // Hover etkisi için inline stil
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          )}
          </Tooltip>
        </Stack>
  
        {/* House Keeping */}
        {roomStatus?.isHKServiceConnected === "1" && (

        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
          style={{
            position: 'absolute',
            bottom: "-13%",
            right: "-15%",
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '2px',
            borderRadius: '8px',
            display: isHKVisible ? 'block' : 'none', 
            opacity: opacity,
          }}
        >
          <Tooltip title={tooltipContentHK} placement="top" arrow>
            <div 
              style={{ 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', // Resimler arasında boşluk
                transition: 'transform 0.3s', // Geçiş efekti
              }}
              // Hover etkisini kapsayıcı div'e ekliyoruz
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                id="dnd"
                src={roomStatus ? 
                  (roomStatus.isDndActive === "1" ? dndyellow : dnd) 
                  : null}
                alt="DND Icon"
                style={{ width: HKWidth, height: HKHeight, cursor: 'pointer' }} 
                onClick={handleHKChange}
              />
        
              <img
                id="lnd"
                src={roomStatus ? 
                  (roomStatus.isLndDelayed === "1" ? lndDelayed : (roomStatus.isLndActive === "1" ? lndyellow : lnd))
                  : null} 
                alt="LND Icon" 
                style={{ width: HKWidth, height: HKHeight, cursor: 'pointer' }} 
                onClick={handleHKChange}
              />
          
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  id="mur"
                  src={roomStatus ? 
                    (roomStatus.isMurActive === "1" ? muryellow : mur)
                    : null}
                  alt="Mur Icon" 
                  style={{ width: HKWidth, height: HKHeight, cursor: 'pointer' }} 
                  onClick={handleHKChange}
                />

                {roomStatus && roomStatus.isMurDelayed === "1" && (
                  <img
                    src={delayedIcon}
                    alt="Delayed Icon"
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      right: '-5px',
                      width: '20px', // Adjust size as needed
                      height: '20px', // Adjust size as needed
                    }}
                  />
                )}
              </div>
            </div>
          </Tooltip>
        </Stack>
        )}
      </Box>
    </Box>
  );

}

export default ModalItem;