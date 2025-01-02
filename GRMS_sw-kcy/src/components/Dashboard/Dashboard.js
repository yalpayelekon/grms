import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useMediaQuery } from '@mui/material';
import {Stack} from '@mui/material';

import OccupancyRates from './OccupancyRates';
import HVACStatus from './HVACStatus';
import ServiceRequests from './ServiceRequests';
import AlarmStatus from './AlarmStatus';
import EnergySaving from './EnergySaving';
import TempDate from '../CommonComponents/TemperatureDate';
import WelcomeMessage from '../CommonComponents/WelcomeMessage';
import LogoComponent from '../CommonComponents/LogoComponent';
import SleepScore from './SleepScore';

import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const Dashboard = ({ weatherData, dateData, setActiveLink, averageResponseTimeGauge, averageResponseTime, averageServiceTimeGauge, averageServiceTime, serviceRequestData, fetchDashboardServiceRequestData, alarmStatustData, fetchDashboardAlarmStatusData, alarmsAccessInfo, username }) => {
  
  const adminDashboard = UISettingsData.adminDashboard; // ["ServiceRequests", "OccupancyRates", "AlarmStatus", "HVACStatus"]
  const adminDashboardMainGridColor = UISettingsData.adminDashboardMainGridColor; // "#00f0f0"
  const adminDashboardHideSleepScore = UISettingsData.adminDashboardHideSleepScore; // false
  const adminDashboardHideEnergySavings = UISettingsData.adminDashboardHideEnergySavings; // true

  const { temperature, seaTemperature, iconSrc } = weatherData;
  const { formattedDate, formattedTime } = dateData;

  const isSmallScreen = useMediaQuery('(max-width:830px)'); 
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    setActiveLink('dashboard');
    fetchDashboardServiceRequestData();
    fetchDashboardAlarmStatusData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1900);
      console.log("window.innerWidth: ",window.innerWidth)
    };

    handleResize(); // İlk kontrol için çağırıyoruz

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const componentsMap = {
    OccupancyRates: <OccupancyRates />,
    ServiceRequests: (
      <ServiceRequests
        averageResponseTimeGauge={averageResponseTimeGauge}
        averageResponseTime={averageResponseTime}
        averageServiceTimeGauge={averageServiceTimeGauge}
        averageServiceTime={averageServiceTime}
        serviceRequestData={serviceRequestData}
      />
    ),
    AlarmStatus: <AlarmStatus alarmStatustData={alarmStatustData} alarmsAccessInfo={alarmsAccessInfo} />,
    HVACStatus: <HVACStatus temperature={temperature} />,
    EnergySaving: <EnergySaving />,
  };

  const orderedComponents = adminDashboard
  .filter((key) => componentsMap[key]) // Sadece listede olanları al
  .map((key, index) => (
    <Grid item xs={adminDashboardHideEnergySavings ? 3 : 6} style={{ maxHeight: "50%", height: "50%" }} key={index}>
      {componentsMap[key]}
    </Grid>
  ));
  return (
    <div style={{  position: "relative", width: 'calc(100% - 200px)', height: '100%', margin: '0 100px' }}>
      <Grid container spacing={2} style={{ padding: '16px'}}>
        <Grid item sx={12} sm={12} md={12} lg={12} style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
          <Stack width="100%" display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2}            
                                  justifyContent="flex-start" alignItems="center">        
            <WelcomeMessage username={username}/>
            <div style={{ marginLeft: isSmallScreen ? 'auto' : 'auto' }}>
              <TempDate formattedDate={formattedDate} formattedTime={formattedTime} temperature={temperature} seaTemperature={seaTemperature} />
            </div>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={adminDashboardHideEnergySavings ? 1 : 2} style={{ padding: '16px', backgroundColor: adminDashboardMainGridColor, borderRadius: "15px" }}>
        {adminDashboardHideEnergySavings ? (
          <Grid item sx={12} sm={12} md={12} lg={12} style={{ height: 'auto', borderRadius: '5px' , display: 'flex', alignItems: 'center', justifyContent: "center" }}>
            <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={1}            
                                    justifyContent="center" alignItems="center">
              {adminDashboard
                .filter((key) => componentsMap[key]) // Sadece listede olanları al
                .map((key, index) => (
                  <div key={index}>
                    {componentsMap[key]}
                  </div>
                ))}
            </Stack>
          </Grid>

        ) : (
          <>
          {!isWideScreen && (
            <Grid item sx={12} sm={12} md={12} lg={12} style={{ height: 'auto', borderRadius: '5px' , display: 'flex', alignItems: 'center', justifyContent: "center" }}>
              <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={1}            
                                      justifyContent="center" alignItems="center">
                {adminDashboard
                  .filter((key) => componentsMap[key]) // Sadece listede olanları al
                  .map((key, index) => (
                    <div key={index}>
                      {componentsMap[key]}
                    </div>
                  ))}
              </Stack>
            </Grid>
            )}
            {!isWideScreen && (
            <Grid item sx={12} sm={12} md={12} lg={12}  style={{ height: 'auto' }}>
              <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={1}            
                                      justifyContent="center" alignItems="center">
              <EnergySaving />
              </Stack>
            </Grid>
          )}
          {isWideScreen && (
            <Grid item xs={6} style={{ height: 'auto', borderRadius: '5px' }}>
            <Grid container spacing={2}>
              {orderedComponents}
            </Grid>
          </Grid>
            )}
            {isWideScreen && (
            <Grid item xs={6} style={{ height: 'auto' }}>
            <EnergySaving />
          </Grid>
            )}
          </>
        )}
        <Grid item sx={12} sm={12} md={12} lg={12}>
          <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2} justifyContent="left" alignItems="center" borderRadius="50px">
            {!adminDashboardHideSleepScore && <SleepScore />}
            <LogoComponent />
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
