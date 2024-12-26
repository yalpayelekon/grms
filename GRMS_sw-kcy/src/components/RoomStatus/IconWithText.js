import React from 'react';
import { Box, Typography } from '@mui/material';

const IconWithText = ({ iconSrc, topTextLine, bottomText, roomNumber, onClick, opacity, adminRoomStatusFontFamily }) => {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2}}>
            <Box sx={{ width: 140, display: 'flex', alignItems: 'center', opacity: opacity }}>
                <img 
                    src={iconSrc} 
                    alt="icon" 
                    style={{ width: '50px', marginRight: '10px', cursor: 'pointer' }} 
                    onClick={onClick} 
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" component="div" sx={{ color: 'white', fontFamily: adminRoomStatusFontFamily }}>{topTextLine}</Typography>
                </Box>
            </Box>
            <Box sx={{ width: 140, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', opacity: opacity }}>
                <Typography variant="body1" sx={{ color: '#FFD55B', fontFamily: adminRoomStatusFontFamily }}>{bottomText}/</Typography>
                <Typography variant="body1" sx={{ color: 'white', fontFamily: adminRoomStatusFontFamily}}>{roomNumber}</Typography>
            </Box>
        </Box>
    );
};

export default IconWithText;