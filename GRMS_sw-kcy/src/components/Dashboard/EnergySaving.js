import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, ButtonGroup, ToggleButton, Grid } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Tooltip from '@mui/material/Tooltip';
import cooling_active from '../../assets/icons/dashboard/EnergySaving/cooling_active.png';
import cooling_inactive from '../../assets/icons/dashboard/EnergySaving/cooling_inactive.png';
import heating_active from '../../assets/icons/dashboard/EnergySaving/heating_active.png';
import heating_inactive from '../../assets/icons/dashboard/EnergySaving/heating_inactive.png';
import lighting_active from '../../assets/icons/dashboard/EnergySaving/lighting_active.png';
import lighting_inactive from '../../assets/icons/dashboard/EnergySaving/lighting_inactive.png';
import EnergyGraph from './EnergyGraph';
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik
import { ResizableBox } from 'react-resizable';  // Import ResizableBox
import { Stack } from 'react-bootstrap';

function EnergySaving() {

  // admin
  const adminEnergySavingFontFamily = UISettingsData.adminEnergySavingFontFamily; // 'ariel'
  const adminEnergySavingHeaderFontSize = UISettingsData.adminEnergySavingHeaderFontSize; // 36
  const adminEnergySavingHeaderText = UISettingsData.adminEnergySavingHeaderText; // "Enerjiiiii"
  const adminEnergySavingHeaderTextColor = UISettingsData.adminEnergySavingHeaderTextColor; // "#0fff00"
  const adminEnergySavingHeaderBackgroundColor = UISettingsData.adminEnergySavingHeaderBackgroundColor; // "#FF012f"

  const adminEnergySavingBodyFontSize = UISettingsData.adminEnergySavingBodyFontSize; // 16
  const adminEnergySavingBodyBackgroundColor = UISettingsData.adminEnergySavingBodyBackgroundColor; // "#bac123"

  const adminEnergySavingDateFilterBackgroundColor = UISettingsData.adminEnergySavingDateFilterBackgroundColor; // "#ff0000"
  const adminEnergySavingDateFilterSelectedBackgroundColor = UISettingsData.adminEnergySavingDateFilterSelectedBackgroundColor; // "#00ff00"
  const adminEnergySavingDateFilterTextColor = UISettingsData.adminEnergySavingDateFilterTextColor; // "#000000"
  const adminEnergySavingDateFilterSelectedTextColor = UISettingsData.adminEnergySavingDateFilterSelectedTextColor; // "#ffffff"

  const adminEnergySavingDataFilterDayText = UISettingsData.adminEnergySavingDataFilterDayText; // "Gün"
  const adminEnergySavingDataFilterWeekText = UISettingsData.adminEnergySavingDataFilterWeekText; // "Hafta"
  const adminEnergySavingDataFilterMonthText = UISettingsData.adminEnergySavingDataFilterMonthText; // "Ay"
  const adminEnergySavingDataFilterYearText = UISettingsData.adminEnergySavingDataFilterYearText; // "Yıl"
  const adminEnergySavingDataFilterTotalText = UISettingsData.adminEnergySavingDataFilterTotalText; // "Toplam"

  const adminEnergySavingHeatingText = UISettingsData.adminEnergySavingHeatingText; // "ısıtma"
  const adminEnergySavingHeatingTextColor = UISettingsData.adminEnergySavingHeatingTextColor; // "#ff0000"
  const adminEnergySavingHeatingSelectedTextColor = UISettingsData.adminEnergySavingHeatingSelectedTextColor; // "#0000ff"

  const adminEnergySavingCoolingText = UISettingsData.adminEnergySavingCoolingText; // "Soğuttttt"
  const adminEnergySavingCoolingTextColor = UISettingsData.adminEnergySavingCoolingTextColor; // "#ff0000"
  const adminEnergySavingCoolingSelectedTextColor = UISettingsData.adminEnergySavingCoolingSelectedTextColor; // "#0000ff"

  const adminEnergySavingLightingText = UISettingsData.adminEnergySavingLightingText; // "Lighting"
  const adminEnergySavingLightingTextColor = UISettingsData.adminEnergySavingLightingTextColor; // "#ff0000"
  const adminEnergySavingLightingSelectedTextColor = UISettingsData.adminEnergySavingLightingSelectedTextColor; // "#0000ff"

  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedOption, setSelectedOption] = useState("week");
  const [selectedEnergies, setSelectedEnergies] = useState(["Heating", "Cooling", "Lighting"]);

  const handleDateChange = (update) => {
    setDateRange(update);
    console.log("Date Range: ", update);
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value === selectedOption ? null : value);
    console.log(`Selected option: ${value}`);
  };

  const handleEnergyChange = (value) => {
    setSelectedEnergies((prevSelectedEnergies) =>
      prevSelectedEnergies.includes(value)
        ? prevSelectedEnergies.filter((energy) => energy !== value)
        : [...prevSelectedEnergies, value]
    );
  };

  useEffect(() => {
    console.log("Selected Energies: ", selectedEnergies);
  }, [selectedEnergies]);

  const tooltipContentHeatingCooling = (
    <div style={{ textAlign: 'center', fontSize: '15px', padding: '5px'}}>
      Veri toplama aşamasından sonra aktif olacaktır.
    </div>
  );

  // LocalStorage'den boyutları geri yükleme
  const [boxSize, setBoxSize] = useState(() => {
    const savedWidth = localStorage.getItem('resizableBoxWidthEnergySaving');
    const savedHeight = localStorage.getItem('resizableBoxHeightEnergySaving');
    return {
      width: savedWidth ? parseInt(savedWidth, 10) : 820,
      height: savedHeight ? parseInt(savedHeight, 10) : 660,
    };
  });
  
  // Boyut değişikliklerini localStorage'de kaydetme
  const onResizeStop = (e, data) => {
    setBoxSize({ width: data.size.width, height: data.size.height });
    localStorage.setItem('resizableBoxWidthEnergySaving', data.size.width);
    localStorage.setItem('resizableBoxHeightEnergySaving', data.size.height);
  };

  return (
    <ResizableBox
      width={boxSize.width} // {820}
      height={boxSize.height} // {660}
      axis="both"
      minConstraints={[600, 660]}  // Minimum size for the card
      maxConstraints={[1500, 660]}  // Maximum size for the card
      resizeHandles={['se']}  // Resizing from bottom-right corner
      onResizeStop={onResizeStop}
      style={{ margin: 'auto' }}
    >
    <Card sx={{ backgroundColor: adminEnergySavingBodyBackgroundColor, color: '#ffffff', height: '100%', width: '100%'}}>
      <Typography variant="h6" align="center" sx={{ backgroundColor: adminEnergySavingHeaderBackgroundColor, color: adminEnergySavingHeaderTextColor, padding: '10px', fontFamily:adminEnergySavingFontFamily, fontSize:adminEnergySavingHeaderFontSize  }}>
        {adminEnergySavingHeaderText}
      </Typography>
      <CardContent>
      <Grid container spacing={2} style={{ padding: '16px'}}>
      <Grid item sx={12} sm={12} md={12} lg={12} style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>

        <Stack  style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap : 10, justifyContent:"flex-start"}} >            
            <div style={{ width: "220px" }}>
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Select Date Range"
                isClearable={false}
                style={{fontFamily: adminEnergySavingFontFamily}}            
              />
            </div>
            <div >
            <ButtonGroup fullWidth orientation="horizontal">
              <ToggleButton
                value="day"
                selected={selectedOption === "day"}
                onChange={() => handleOptionChange("day")}
                variant="contained"
                sx={{
                  fontFamily:adminEnergySavingFontFamily,
                  fontSize:adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingDateFilterBackgroundColor,
                  color: adminEnergySavingDateFilterTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                    color: adminEnergySavingDateFilterSelectedTextColor,
                  },
                  height: '40px',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  '&:hover&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                  },
                  borderRadius: "0px",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",

                }}
              >
                {adminEnergySavingDataFilterDayText}
              </ToggleButton>
              <ToggleButton
                value="week"
                selected={selectedOption === "week"}
                onChange={() => handleOptionChange("week")}
                variant="contained"
                sx={{
                  fontFamily:adminEnergySavingFontFamily,
                  fontSize:adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingDateFilterBackgroundColor,
                  color: adminEnergySavingDateFilterTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                    color: adminEnergySavingDateFilterSelectedTextColor,
                  },
                  height: '40px',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  '&:hover&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                  },
                  borderRadius: "0px"
                }}
              >
                {adminEnergySavingDataFilterWeekText}
              </ToggleButton>
              <ToggleButton
                value="month"
                selected={selectedOption === "month"}
                onChange={() => handleOptionChange("month")}
                variant="contained"
                sx={{
                  fontFamily:adminEnergySavingFontFamily,
                  fontSize:adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingDateFilterBackgroundColor,
                  color: adminEnergySavingDateFilterTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                    color: adminEnergySavingDateFilterSelectedTextColor,
                  },
                  height: '40px',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  '&:hover&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                  },
                  borderRadius: "0px",
                  borderLeft: "none"
                }}
              >
                {adminEnergySavingDataFilterMonthText}
              </ToggleButton>
              <ToggleButton
                value="year"
                selected={selectedOption === "year"}
                onChange={() => handleOptionChange("year")}
                variant="contained"
                sx={{
                  fontFamily:adminEnergySavingFontFamily,
                  fontSize:adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingDateFilterBackgroundColor,
                  color:adminEnergySavingDateFilterTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                    color: adminEnergySavingDateFilterSelectedTextColor,
                  },
                  height: '40px',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  '&:hover&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                  },
                  borderRadius: "0px"
                }}
              >
                {adminEnergySavingDataFilterYearText}
              </ToggleButton>
              <ToggleButton
                value="total"
                selected={selectedOption === "total"}
                onChange={() => handleOptionChange("total")}
                variant="contained"
                sx={{
                  fontFamily:adminEnergySavingFontFamily,
                  fontSize:adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingDateFilterBackgroundColor,
                  color: adminEnergySavingDateFilterTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                    color: adminEnergySavingDateFilterSelectedTextColor,
                  },
                  height: '40px',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  '&:hover&.Mui-selected': {
                    backgroundColor: adminEnergySavingDateFilterSelectedBackgroundColor,
                  },
                  borderRadius: "0px",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                {adminEnergySavingDataFilterTotalText}
              </ToggleButton>
            </ButtonGroup>
            </div>
            <div style={{marginLeft: "10px"}}>

            <ButtonGroup fullWidth orientation="vertical" >
            <Tooltip title={tooltipContentHeatingCooling} placement="top" arrow>
            <span>
              <ToggleButton
                value="Heating"
                selected={selectedEnergies.includes("Heating")}
                onChange={() => handleEnergyChange("Heating")}
                variant="contained"
                disableRipple
                sx={{
                  fontFamily: adminEnergySavingFontFamily,
                  fontSize: adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingBodyBackgroundColor,
                  color: adminEnergySavingHeatingTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingBodyBackgroundColor,
                    color: adminEnergySavingHeatingSelectedTextColor,
                    fontWeight: "normal"
                  },
                  '&.Mui-disabled': {
                    backgroundColor: adminEnergySavingBodyBackgroundColor, // Disable background color
                    border: 'none', // Remove border
                    cursor: 'default', // Change cursor style
                    '&:hover': {
                      backgroundColor: adminEnergySavingBodyBackgroundColor, // Keep same background on hover
                    },
                  },
                  height: '20px',
                  border: "none",
                  borderRadius: 0,
                  justifyContent: 'flex-start'
                }}
                disabled
              >
                <img 
                  src={selectedEnergies.includes("Heating") ? heating_active : heating_inactive} 
                  alt="Heating Icon" 
                  style={{ width: "10px", height: "10px", marginRight: '8px' }} 
                />
                {adminEnergySavingHeatingText}
              </ToggleButton>
            </span>
          </Tooltip>
          <Tooltip title={tooltipContentHeatingCooling} placement="top" arrow >
            <span>
              <ToggleButton
                value="Cooling"
                selected={selectedEnergies.includes("Cooling")}
                onChange={() => handleEnergyChange("Cooling")}
                variant="contained"
                disableRipple
                sx={{
                  fontFamily: adminEnergySavingFontFamily,
                  fontSize: adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingBodyBackgroundColor,
                  color: adminEnergySavingCoolingTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingBodyBackgroundColor,
                    color: adminEnergySavingCoolingSelectedTextColor,
                    fontWeight: "normal"
                  },
                  '&.Mui-disabled': {
                    backgroundColor: adminEnergySavingBodyBackgroundColor, // Disable background color
                    border: 'none', // Remove border
                    cursor: 'default', // Change cursor style
                    '&:hover': {
                      backgroundColor: adminEnergySavingBodyBackgroundColor, // Keep same background on hover
                    },
                  },
                  height: '20px',
                  border: "none",
                  borderRadius: 0,
                  justifyContent: 'flex-start'
                }}
                disabled
              >
                <img 
                  src={selectedEnergies.includes("Cooling") ? cooling_active : cooling_inactive} 
                  alt="Cooling Icon" 
                  style={{ width: "10px", height: "10px", marginRight: '8px' }} 
                />
                {adminEnergySavingCoolingText}
              </ToggleButton>
            </span>
          </Tooltip>
              <ToggleButton
                value="Lighting"
                selected={selectedEnergies.includes("Lighting")}
                onChange={() => handleEnergyChange("Lighting")}
                variant="contained"
                disableRipple
                sx={{
                  fontFamily:adminEnergySavingFontFamily,
                  fontSize:adminEnergySavingBodyFontSize, 
                  backgroundColor: adminEnergySavingBodyBackgroundColor,
                  color: adminEnergySavingLightingTextColor,
                  '&.Mui-selected': {
                    backgroundColor: adminEnergySavingBodyBackgroundColor,
                    color: adminEnergySavingLightingSelectedTextColor,
                    fontWeight: "normal"
                  },
                  height: '20px',
                  border: "none",
                  borderRadius: 0,
                  justifyContent: 'flex-start',
                }}
              >
                <img 
                  src={selectedEnergies.includes("Lighting") ? lighting_active : lighting_inactive} 
                  alt="Lighting Icon" 
                  style={{ width: "10px", height: "10px", marginRight: '8px' }} 
                />
                {adminEnergySavingLightingText}
              </ToggleButton>
            </ButtonGroup>
            </div>
        </Stack>
        </Grid>
        </Grid>
        <Grid container spacing={0} style={{ marginTop: '40px' }}>
          <Grid item xs={12}>
            <EnergyGraph boxSizeWidth={boxSize.width}/>
          </Grid>
      </Grid>
      </CardContent>
    </Card>
    </ResizableBox>
  );
}

export default EnergySaving;