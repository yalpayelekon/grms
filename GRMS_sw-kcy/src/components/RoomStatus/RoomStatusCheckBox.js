import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function RoomStatusCheckBox({ checkboxName, onChange }) {

    // admin
    const adminRoomStatusCheckBoxFontFamily = UISettingsData.adminRoomStatusCheckBoxFontFamily; // "ariel"
    const adminRoomStatusCheckBoxFontColor = UISettingsData.adminRoomStatusCheckBoxFontColor; // "#00ff00"
    const adminRoomStatusCheckBoxFontSize = UISettingsData.adminRoomStatusCheckBoxFontSize; // 25
    const adminRoomStatusCheckBoxNoneCheckedColor = UISettingsData.adminRoomStatusCheckBoxNoneCheckedColor; // "#ff0000"
    const adminRoomStatusCheckBoxCheckedColor = UISettingsData.adminRoomStatusCheckBoxCheckedColor; // "#ffff00"

    return (
        <FormControlLabel 
            sx={{ m: 1, mt: 1 }}
            control={<Checkbox defaultChecked onChange={onChange} sx={{'&:not(.Mui-checked)': {color: adminRoomStatusCheckBoxNoneCheckedColor}, '&.Mui-checked': {color: adminRoomStatusCheckBoxCheckedColor}}} />} 
            label={<span style={{ whiteSpace: 'nowrap', color: adminRoomStatusCheckBoxFontColor ,fontSize: adminRoomStatusCheckBoxFontSize,  fontFamily: adminRoomStatusCheckBoxFontFamily}}>{checkboxName}</span>}
        />
    );
}

export default RoomStatusCheckBox;