import React, { useState, useEffect, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';
import {Stack} from '@mui/material';
import Grid from '@material-ui/core/Grid';
import TempDate from '../CommonComponents/TemperatureDate'
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Box } from '@mui/material';

import filterIcon from '../../assets/icons/generic/filterIcon.png';
import TableComponent from "./TableComponent";
import CheckmarksFilter from "../CommonComponents/CheckmarksFilter";
import GaugeChartComponent from '../CommonComponents/GaugeChartComponent';

import LogoComponent from '../CommonComponents/LogoComponent';

import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function RoomServices({ weatherData, dateData, setActiveLink, roomServiceData, fetchRoomServiceData, averageResponseTimeGauge, averageResponseTime, averageServiceTimeGauge, averageServiceTime, serviceRequestData, fetchDashboardServiceRequestData}) {

    const isSmallScreen = useMediaQuery('(max-width:1200px)'); 
  
    // admin
    const adminRoomServicesFontFamily = UISettingsData.adminRoomServicesFontFamily; // "Ariel"
    const adminRoomServicesFontSize = UISettingsData.adminRoomServicesFontSize; // "20px"
    const adminRoomServicesPieCharMURColor = UISettingsData.adminRoomServicesPieCharMURColor; // "#ff00ff"
    const adminRoomServicesPieChartMURText = UISettingsData.adminRoomServicesPieChartMURText; // "Aktif Mur"
    const adminRoomServicesPieCharDelayColor = UISettingsData.adminRoomServicesPieCharDelayColor; // "#ff0012"
    const adminRoomServicesPieChartDelayText = UISettingsData.adminRoomServicesPieChartDelayText; // "Mur gecikems"
    const adminRoomServicesGaugeChartResponceText = UISettingsData.adminRoomServicesGaugeChartResponceText; // "Cevap süresi dk: "
    const adminRoomServicesGaugeChartServiceText = UISettingsData.adminRoomServicesGaugeChartServiceText; // "Servis süresi dk: "
    const adminRoomServicesHidePieChart = UISettingsData.adminRoomServicesHidePieChart; // false
    const adminRoomServicesHideGaugeChart1 = UISettingsData.adminRoomServicesHideGaugeChart1; // false
    const adminRoomServicesHideGaugeChart2 = UISettingsData.adminRoomServicesHideGaugeChart2; // true
    const adminRoomServiceBackgroundColor = UISettingsData.adminRoomServiceBackgroundColor

    const { temperature, seaTemperature, iconSrc } = weatherData;
    const { formattedDate, formattedTime} = dateData;
      
    const [localData, setLocalData] = useState(roomServiceData);

    const [serviceRequestLocalData, setServiceRequestLocalData] = useState({
      "murNumber": 0,
      "murOverdue": 0,
      "murInProgress": 0,
      "lndNumber": 0,
      "lndOverdue": 0,
      "lndInProgress": 0,
      "averageResponceTime": 0,
      "averageServiceTime": 0,
      "dashboardReqResponceTimeUpperLimit": 0,
      "dashboardServiceResponceTimeUpperLimit": 0
    });
    useEffect(() => {

      if (serviceRequestData) {
        setServiceRequestLocalData(serviceRequestData)
      } else {
        console.log('serviceRequestData is null or undefined');
      }
    }, [serviceRequestData]);

    useEffect(() => {
      setActiveLink("roomServices");
      fetchRoomServiceData();  // Bileşen ilk yüklendiğinde fetch işlemini gerçekleştirir.
      fetchDashboardServiceRequestData()
    }, []);  // Bu useEffect sadece bileşen ilk kez yüklendiğinde çalışır.
    
    useEffect(() => {
      setLocalData(roomServiceData)
    }, [roomServiceData]);

/*     const delayCategoryNames = [ kcy rcu lnd ozellik cikarimi
        'MUR',
        'Laundry',
      ]; */

      const ackNames = [
        "None",
        'Acknowledged',
        'Waiting Ack.',
      ];

      const statusNames = [
        "None",
        "Waiting Resp.",
        "Cleaned", 
        // "Collected', kcy rcu lnd ozellik cikarimi
      ];

    // const [categoryName, setCategoryName] = useState(delayCategoryNames); kcy rcu lnd ozellik cikarimi
    const [ackName, setAckName] = useState(ackNames);
    const [statusName, setStatusName] = useState(statusNames);

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

        // let categoryBool = false; kcy rcu lnd ozellik cikarimi
        let ackBool = false;
        let statusBool = false;
         
        if (ackName.length > 0 && ackName.includes(item.acknowledgement)) {
            ackBool = true;
        }

        if (statusName.length > 0 && statusName.includes(item.status)) {
            statusBool = true;
        }  

        if(ackBool&statusBool) { // categoryBool&ackBool&statusBool kcy rcu lnd ozellik cikarimi
            return true
        }
        return false;
      });

    const murInProgressRate = parseInt((((serviceRequestLocalData.murInProgress ) / (serviceRequestLocalData.murOverdue + serviceRequestLocalData.murInProgress)) * 100).toFixed(2));
    const murDelayRate = parseInt((((serviceRequestLocalData.murOverdue ) / (serviceRequestLocalData.murOverdue + serviceRequestLocalData.murInProgress)) * 100).toFixed(2));
    const data2 = [
    { label: 'MUR', value: murInProgressRate, color: adminRoomServicesPieCharMURColor, rate:53},
    //{ label: 'Laundry', value: 25, color: "#A8C5DA", rate:25},
    { label: 'Delay', value: murDelayRate, color: adminRoomServicesPieCharDelayColor, rate:22},];
   
    return (
      <div style={{ position: "relative", width: 'calc(100% - 200px)', height: '100vh', margin: '0 100px' }}>
  
        <Grid container spacing={2} style={{ padding: '16px' }}>
            <Grid item sx={12} sm={12} md={12} lg={12} style={{fontFamily: adminRoomServicesFontFamily, display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
              <Stack width="100%" display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2}            
                      justifyContent="flex-start" alignItems="center" >                       
                    {/* <img src={filterIcon} alt="Alarm Filter Icon" style={{ height: 'auto', width: '40px' }} />  */}
                    <CheckmarksFilter category={"Acknowledgement"} categoryNames={ackNames} onChange={handleAckChange} categoryName={ackName}/>
                    <CheckmarksFilter category={"Status"} categoryNames={statusNames} onChange={handleStatusChange} categoryName={statusName}/>
                    <div style={{ marginLeft: isSmallScreen ? 'auto' : 'auto' }}>
                      <TempDate formattedDate={formattedDate} formattedTime={formattedTime} temperature={temperature} seaTemperature={seaTemperature} />
                    </div>
              </Stack>
            </Grid>
        </Grid>
  
        <Grid container spacing={2} style={{ padding: '16px', backgroundColor: adminRoomServiceBackgroundColor, borderRadius: "15px"}}>
          <Grid item xs={12} style={{ height: 'auto'}}>
            <TableComponent data={filteredData}/>
          </Grid>
          {serviceRequestData && (
            <Grid item sx={12} sm={12} md={12} lg={12}>
              <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 5 : 10} justifyContent="left" alignItems="center" >
            
                {!adminRoomServicesHidePieChart && (
                  <Box display="flex" flexDirection="row" alignItems="center" mt={3}>

                    <PieChart
                      series={[
                        {
                          data: data2,
                          innerRadius: 30,
                          outerRadius: 60,
                          cornerRadius: 5,
                          valueFormatter: (data) => data.value.toString() + "%",
                        },
                      ]}
                      width={250}
                      height={130}
                      slotProps={{legend: { hidden: true },
                      }}
                    />
                    <Box display="flex" flexDirection="column" alignItems="flex" ml={-10} >
                      <Box display="flex" alignItems="center" mb={1} >
                        <Box width={10} height={10} borderRadius="50%" bgcolor={adminRoomServicesPieCharMURColor} mr={1} />
                        <Typography variant="body2" sx={{ color: "white", fontFamily: adminRoomServicesFontFamily, fontSize: adminRoomServicesFontSize }}>
                          {adminRoomServicesPieChartMURText}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white", fontFamily: adminRoomServicesFontFamily, fontSize: adminRoomServicesFontSize, textAlign:"right", marginLeft: 1 }}>
                          {serviceRequestLocalData.murInProgress}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Box width={10} height={10} borderRadius="50%" bgcolor={adminRoomServicesPieCharDelayColor} mr={1} />
                        <Typography variant="body2" sx={{ color: "white", fontFamily: adminRoomServicesFontFamily, fontSize: adminRoomServicesFontSize}}>
                            {adminRoomServicesPieChartDelayText}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "white", fontFamily: adminRoomServicesFontFamily, fontSize: adminRoomServicesFontSize, marginLeft: 1 }}>
                            {serviceRequestLocalData.murOverdue}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

              {!adminRoomServicesHideGaugeChart1 && (
                <div style={{marginLeft: "50px"}}>
                  <GaugeChartComponent 
                    averageTimeGauge={averageResponseTimeGauge} 
                    width={"120px"}
                    min={0} 
                    max={serviceRequestLocalData.dashboardReqResponceTimeUpperLimit}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ marginLeft: "-10px", display: 'block', fontFamily: adminRoomServicesFontFamily, fontSize: adminRoomServicesFontSize, color: "white" }}>
                      {adminRoomServicesGaugeChartResponceText}{averageResponseTime}
                    </span>
                  </div>
                </div>
              )}
 
            {!adminRoomServicesHideGaugeChart2 && (
              <div style={{marginLeft: "50px"}}>
                <GaugeChartComponent averageTimeGauge={averageServiceTimeGauge} width={"120px"} min = {0} max = {serviceRequestLocalData.dashboardServiceResponceTimeUpperLimit}/>
                <div style={{ textAlign: 'center'}}>
                  <span style={{ marginLeft: "-10px", display: 'block', fontFamily: adminRoomServicesFontFamily, fontSize: adminRoomServicesFontSize, color: "white" }}>
                    {adminRoomServicesGaugeChartServiceText}{averageServiceTime}
                  </span>
                </div>
              </div>
              )}

              <LogoComponent/>
           </Stack>
            
          </Grid>
          )}
        </Grid>
      </div>
    );
}

export default RoomServices;