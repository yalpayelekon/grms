import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../../css/Badge.css';  // Yeni CSS dosyasını ekliyoruz

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

// admin
const adminCheckmarksFilterRoomStatusTextColor = UISettingsData.adminCheckmarksFilterRoomStatusTextColor; // "#0000ff"
const adminCheckmarksFilterRoomStatusBackgroundColor = UISettingsData.adminCheckmarksFilterRoomStatusBackgroundColor; // "#ff0000"
const adminCheckmarksFilterRoomStatusCheckedBackgroundColor = UISettingsData.adminCheckmarksFilterRoomStatusCheckedBackgroundColor; // "#00ff00"
const adminCheckmarksFilterRoomStatusFontFamily = UISettingsData.adminCheckmarksFilterRoomStatusFontFamily; // "ariel"
const adminCheckmarksFilterRoomStatusFontSize = UISettingsData.adminCheckmarksFilterRoomStatusFontSize; // 25
const adminCheckmarksFilterRoomStatusBorderColor = UISettingsData.adminCheckmarksFilterRoomStatusBorderColor; // "#ffffff"

const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, categoryName) {
  return {
    fontFamily: adminCheckmarksFilterRoomStatusFontFamily,
    fontSize: adminCheckmarksFilterRoomStatusFontSize,
    backgroundColor:
      categoryName === name ? adminCheckmarksFilterRoomStatusCheckedBackgroundColor : adminCheckmarksFilterRoomStatusBackgroundColor, // Seçim durumuna göre arka plan rengi
  };
}

export default function CheckmarksFilterRoomStatus({ category, categoryNames, onChange, categoryName, width, blokKatAlarmNumberData, katErrorCounts }) {

  // Hataları hesapla
  const calculateTotalBlokErrors = (data) => {
    let errorCounts = {};
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object') {
          let totalErrors = Object.values(value).reduce((sum, count) => sum + count, 0);
          errorCounts[key] = totalErrors;
        }
      });
    }
    return errorCounts;
  };

  const blokErrorCounts = calculateTotalBlokErrors(blokKatAlarmNumberData);

  const handleChange = (event) => {
    // Seçimi üst bileşene bildirin
    onChange(event);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: width, mt: 1 }}>
        <Select
          displayEmpty
          value={categoryName}
          onChange={handleChange}
          input={<OutlinedInput />}
          MenuProps={MenuProps}
          sx={{
            height: 40,
            color: adminCheckmarksFilterRoomStatusTextColor,
            backgroundColor: adminCheckmarksFilterRoomStatusBackgroundColor,
            fontFamily: adminCheckmarksFilterRoomStatusFontFamily,
            fontSize: adminCheckmarksFilterRoomStatusFontSize,
            '& .MuiOutlinedInput-notchedOutline': { borderColor:  adminCheckmarksFilterRoomStatusBorderColor},
            borderRadius: 3,
          }}
        >
          <MenuItem disabled value="">
            
          </MenuItem>
          {categoryNames.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={{...getStyles(name, categoryName), color: adminCheckmarksFilterRoomStatusTextColor}}

            >
              <span className="badgeContainer" >
                {name}
                {category === "Blok" && blokErrorCounts[name] > 0 && (
                  <span className="badgeRoomStatusAlarms" style={{fontFamily:adminCheckmarksFilterRoomStatusFontFamily}}>{blokErrorCounts[name]}</span>
                )}
                {category === "Kat" && katErrorCounts[name] > 0 && (
                  <span className="badgeRoomStatusAlarms" style={{fontFamily:adminCheckmarksFilterRoomStatusFontFamily}}>
                    {katErrorCounts[name] !== undefined ? katErrorCounts[name] : 0}
                  </span>
                )}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}