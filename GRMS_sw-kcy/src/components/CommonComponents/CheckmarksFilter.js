import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

// admin
const adminAlarmCBTextColor = UISettingsData.adminAlarmCBTextColor; // "#ffffff"
const adminAlarmCBBackgroundColor = UISettingsData.adminAlarmCBBackgroundColor; // "#ff0000"
const adminAlarmCBCheckedBackgroundColor = UISettingsData.adminAlarmCBCheckedBackgroundColor; // "#00ff00"
const adminAlarmCBFontFamily = UISettingsData.adminAlarmCBFontFamily; // "ariel"
const adminAlarmCBFontSize = UISettingsData.adminAlarmCBFontSize; // 25
const adminAlarmCBBorderColor = UISettingsData.adminAlarmCBBorderColor; // "#ffffff"

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
    fontFamily:adminAlarmCBFontFamily,
    fontSize: adminAlarmCBFontSize,
    backgroundColor:
      categoryName.indexOf(name) === -1 ? adminAlarmCBCheckedBackgroundColor : adminAlarmCBBackgroundColor, // Seçim durumuna göre arka plan rengi

  };
}

export default function CheckmarksFilter({ category, categoryNames, onChange, categoryName }) {

  // Başlangıçta tüm kategoriler seçili olarak gösterilecek
  const [selectedCategoryNames, setSelectedCategoryNames] = React.useState(categoryNames);

  const handleChange = (event) => {
    setSelectedCategoryNames(event.target.value);
    onChange(event);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300, mt: 1}}>
        <Select
          multiple
          displayEmpty
          value={selectedCategoryNames}
          onChange={handleChange}
          input={<OutlinedInput />}

          renderValue={() => {
            return category;
          }}
          MenuProps={MenuProps}
          sx={{
            height: 40,
            color: adminAlarmCBTextColor,
            backgroundColor: adminAlarmCBBackgroundColor,
            fontFamily:adminAlarmCBFontFamily,
            fontSize: adminAlarmCBFontSize,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: adminAlarmCBBorderColor },
            borderRadius: 3
          }}
        >
          <MenuItem disabled value="">
            {category}
          </MenuItem>
          {categoryNames.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={{...getStyles(name, selectedCategoryNames), color: adminAlarmCBTextColor}}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}