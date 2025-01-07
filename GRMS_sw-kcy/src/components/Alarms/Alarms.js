import React, { useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TempDate from '../CommonComponents/TemperatureDate'
import { useMediaQuery, Stack } from '@mui/material';
import filterIcon from '../../assets/icons/generic/filterIcon.png';
import TableComponent from "./TableComponent";
import CheckmarksFilter from "../CommonComponents/CheckmarksFilter";

import LogoComponent from '../CommonComponents/LogoComponent';
import { useLocation } from 'react-router-dom'; // URL parametrelerini almak için

import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function Alarms({ weatherData, dateData, setActiveLink, alarmsData, fetchAlarmsData }) {

  const adminAlarmsFontFamily = UISettingsData.adminAlarmsFontFamily; // 'Poppins'
  const adminAlarmsBackgroundColor = UISettingsData.adminAlarmsBackgroundColor; // "#b0769730"
  
  const isSmallScreen = useMediaQuery('(max-width:1200px)'); 
  const { temperature, seaTemperature, iconSrc } = weatherData;
  const { formattedDate, formattedTime} = dateData;
    
  console.log("alarmsData:",alarmsData)
  const [localData, setLocalData] = useState(alarmsData);

  useEffect(() => {
      setLocalData(alarmsData);
  }, [alarmsData]);

  useEffect(() => {
    setActiveLink("alarms")
    fetchAlarmsData()
  }, []);

  const location = useLocation(); // URL parametrelerini almak için
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category'); // URL'den gelen parametre
  const subInitialCategory = queryParams.get('subcategory'); // URL'den gelen parametre


  console.log("initialCategory:", initialCategory); // Array of categories (e.g., ["Helvar", "RCU"])
  console.log("subInitialCategory:", subInitialCategory); // Array of categories (e.g., ["Helvar", "RCU"])

  useEffect(() => {
    setLocalData(alarmsData);
  }, [alarmsData]);

  useEffect(() => {
    setActiveLink("alarms");
    fetchAlarmsData();
  }, []);

  const categoryNames = [
      'Lighting',
      'HVAC',
      'RCU',
      'Helvar',
      'Door Syst.',
      'PMS',
      'Emergency',
/*         'Open Door',
      'Long Inact.' */
  ];

  const ackNames = [
    "None",
    'Acknowledged',
    'Waiting Ack.',
  ];

  const statusNames = [
    "None",
    'Waiting Repair/Control',
    'Fixed',
  ];

  useEffect(() => {
    // URL'den gelen parametre varsa, sadece onu seçili yap; yoksa tüm kategoriler seçili olsun
    if (initialCategory) {
      if (subInitialCategory == "RCU"){
        setCategoryName([initialCategory, subInitialCategory]);
      }
      else{
        setCategoryName([initialCategory]);
      }
    } else {
      setCategoryName(categoryNames);
    }
  }, [initialCategory]);

  const [categoryName, setCategoryName] = useState(categoryNames);
  const [ackName, setAckName] = useState(ackNames);
  const [statusName, setStatusName] = useState(statusNames);

  const handleCategoryChange = (event) => {
      console.log("handleCategoryChange", event.target)
      const {
          target: { value },
        } = event;
        setCategoryName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
  };

  const handleAckChange = (event) => {
      console.log("handleCategoryChange", event.target)
      const {
          target: { value },
        } = event;
        setAckName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
  };

  const handleStatusChange = (event) => {
      console.log("handleCategoryChange", event.target)
      const {
          target: { value },
        } = event;
        setStatusName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
  };

  const filteredData = localData.filter(item => {

      let categoryBool = false;
      let ackBool = false;
      let statusBool = false;

      if (categoryName.length > 0 && categoryName.includes(item.category)) {
          categoryBool = true;
      }
        
      if (ackName.length > 0 && ackName.includes(item.acknowledgement)) {
          ackBool = true;
      }

      console.log("statusName", statusName)
      if (statusName.length > 0 && statusName.includes(item.status)) {
          statusBool = true;
      }

      if(categoryBool&ackBool&statusBool) {
          return true
      }
      return false;
    });

  return (
    <div style={{position: "relative", width: 'calc(100% - 200px)', height: '100%', margin: '0 100px' }}>
      <Grid container spacing={2} style={{ padding: '16px' }}>
          <Grid item sx={12} sm={12} md={12} lg={12} style={{fontFamily: adminAlarmsFontFamily, display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
            <Stack width="100%" display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2}            
                      justifyContent="flex-start" alignItems="center" >                    
                {/* <img src={filterIcon} alt="Alarm Filter Icon" style={{ height: 'auto', width: '40px' }} /> */}
                <CheckmarksFilter category={"Category"} categoryNames={categoryNames} onChange={handleCategoryChange} categoryName={categoryName}/>
                <CheckmarksFilter category={"Acknowledgement"} categoryNames={ackNames} onChange={handleAckChange} categoryName={ackName}/>
                <CheckmarksFilter category={"Status"} categoryNames={statusNames} onChange={handleStatusChange} categoryName={statusName}/>
                <div style={{ marginLeft: isSmallScreen ? 'auto' : 'auto' }}>
                  <TempDate formattedDate={formattedDate} formattedTime={formattedTime} temperature={temperature} seaTemperature={seaTemperature} />
                </div>

            </Stack>
          </Grid>
      </Grid>

      <Grid container spacing={2} style={{ padding: '16px', backgroundColor: adminAlarmsBackgroundColor, borderRadius: "15px"}}>
        <Grid item xs={12} style={{ height: 'auto'}}>
          <TableComponent data={filteredData}/>
        </Grid>

        <Grid item sx={2} sm={2} md={2} lg={2}>
          
        </Grid>
        <Grid item sx={10} sm={10} md={10} lg={10} style={{  textAlign:"right" }}>
          <LogoComponent/>          
        </Grid>  
      </Grid>

    </div>
  );
}

export default Alarms;