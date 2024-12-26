import React from 'react';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function RoomStatusSearchField({ searchTerm, setSearchTermFunction, handleKeyDown, handleSearchClick }) {

    // admin
    const adminRoomStatusSearchFieldTextColor = UISettingsData.adminRoomStatusSearchFieldTextColor; // "#ff00ff"
    const adminRoomStatusSearchFieldTextFontSize = UISettingsData.adminRoomStatusSearchFieldTextFontSize; // 18
    const adminRoomStatusSearchFieldFontFamily = UISettingsData.adminRoomStatusSearchFieldFontFamily; // "ariel"
    const adminRoomStatusSearchFieldSearchFieldBackgroundColor = UISettingsData.adminRoomStatusSearchFieldSearchFieldBackgroundColor; // "#00f0f0"
    const adminRoomStatusSearchFieldBorderColor = UISettingsData.adminRoomStatusSearchFieldBorderColor; // "#00f0f0"

    return (
        <TextField 
            id="outlined-basic" 
            label="Room ID" 
            variant="outlined" 
            size="small"
            value={searchTerm}
            onChange={setSearchTermFunction}
            onKeyDown={handleKeyDown}
            InputLabelProps={{
                style: { color: adminRoomStatusSearchFieldTextColor, 
                    fontSize:adminRoomStatusSearchFieldTextFontSize, 
                    fontFamily: adminRoomStatusSearchFieldFontFamily },
            }}
            InputProps={{
                disableUnderline: true, // Kenarlık kaldırma
                endAdornment: (
                    <IconButton onClick={handleSearchClick}>
                        <SearchIcon sx={{ color: adminRoomStatusSearchFieldTextColor }} />
                    </IconButton>
                ),
                style: {
                    borderRadius: '10px', 
                    backgroundColor: adminRoomStatusSearchFieldSearchFieldBackgroundColor,
                    width: '200px', // Text alanının boyutunu ayarla
                    height: 40,
                    fontFamily: adminRoomStatusSearchFieldFontFamily,
                    fontSize: adminRoomStatusSearchFieldTextFontSize // Font boyutunu burada ayarlıyoruz
                }  
            }}
            autoComplete="off" // Geçmiş yazılanları gizler
            sx={{
                // input label when focused
                "& label.Mui-focused": {
                    color: "black",
                },
                // focused color for input with variant='outlined'
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderWidth: '1px', // Border width'i 0 yaparak kaldırıyoruz
                        borderColor: adminRoomStatusSearchFieldBorderColor,
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "transparent" // Focuslandığında da sınır rengini şeffaf yapıyoruz
                    }
                },
            }}
        />
    );
}

export default RoomStatusSearchField;