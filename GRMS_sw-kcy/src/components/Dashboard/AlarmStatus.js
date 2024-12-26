import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { ResizableBox } from 'react-resizable';  // Import ResizableBox
import 'react-resizable/css/styles.css'; // Import styles for resizable

import lighting from '../../icons/dashboard/AlarmStatus/lighting.png';
import hvac from '../../icons/dashboard/AlarmStatus/hvac.png';
import rcu from '../../icons/dashboard/AlarmStatus/rcu.png';
import door from '../../icons/dashboard/AlarmStatus/door.png';
import pms from '../../icons/dashboard/AlarmStatus/pms.png';
import emerg from '../../icons/dashboard/AlarmStatus/emerg.png';

import UISettingsData from '../../jsonFiles/UISettingsData.json';

const AlarmStatus = ({ alarmStatustData, alarmsAccessInfo }) => {
  const adminAlarmStatusFontFamily = UISettingsData.adminAlarmStatusFontFamily;
  const adminAlarmStatusHeaderFontSize = UISettingsData.adminAlarmStatusHeaderFontSize;
  const adminAlarmStatusHeaderText = UISettingsData.adminAlarmStatusHeaderText;
  const adminAlarmStatusHeaderTextColor = UISettingsData.adminAlarmStatusHeaderTextColor;
  const adminAlarmStatusHeaderBackgroundColor = UISettingsData.adminAlarmStatusHeaderBackgroundColor;
  const adminAlarmStatusBodyFontSize = UISettingsData.adminAlarmStatusBodyFontSize;
  const adminAlarmStatusBodyBackgroundColor = UISettingsData.adminAlarmStatusBodyBackgroundColor;
  const adminAlarmStatusLightingText = UISettingsData.adminAlarmStatusLightingText;
  const adminAlarmStatusHVACText = UISettingsData.adminAlarmStatusHVACText;
  const adminAlarmStatusControllerText = UISettingsData.adminAlarmStatusControllerText;
  const adminAlarmStatusDoorSystText = UISettingsData.adminAlarmStatusDoorSystText;
  const adminAlarmStatusPMSText = UISettingsData.adminAlarmStatusPMSText;
  const adminAlarmStatusEmergencyText = UISettingsData.adminAlarmStatusEmergencyText;
  const adminAlarmStatusAlarmNumberText = UISettingsData.adminAlarmStatusAlarmNumberText;
  const adminAlarmStatusAlarmNumberBackgroundColor = UISettingsData.adminAlarmStatusAlarmNumberBackgroundColor;
  const adminAlarmStatusAlarmNumberTextColor = UISettingsData.adminAlarmStatusAlarmNumberTextColor;
  const adminAlarmStatusAckAlarmNumberText = UISettingsData.adminAlarmStatusAckAlarmNumberText;
  const adminAlarmStatusAckAlarmNumberBackgroundColor = UISettingsData.adminAlarmStatusAckAlarmNumberBackgroundColor;
  const adminAlarmStatusAckAlarmNumberTextColor = UISettingsData.adminAlarmStatusAckAlarmNumberTextColor;
  const adminAlarmStatusIfAlarmColor = UISettingsData.adminAlarmStatusIfAlarmColor;
  const adminAlarmStatusIfOkayColor = UISettingsData.adminAlarmStatusIfOkayColor;
  const adminHideAlarmLabels = UISettingsData.adminHideAlarmLabels;

  const navigate = useNavigate();

  const [alarmData, setAlarmData] = useState({
    lightingAlarmNumber: 0,
    hvacAlarmNumber: 0,
    rcuAlarmNumber: 0,
    doorSystemAlarmNumber: 0,
    pmsAlarmNumber: 0,
    emergencyAlarmNumber: 0,
    lightingAckNumber: 0,
    hvacAckNumber: 0,
    rcuAckNumber: 0,
    doorAckNumber: 0,
    pmsAckNumber: 0,
    emergencyAckNumber: 0,
  });

  useEffect(() => {
    if (alarmStatustData) {
      console.log('alarmStatustData:', alarmStatustData);
      setAlarmData(alarmStatustData);
    } else {
      console.log('alarmStatustData is null or undefined');
    }
  }, [alarmStatustData]);

  const alarmLabels = [
    { label: "Lighting", name: adminAlarmStatusLightingText, key: 'lightingAlarmNumber', icon: lighting, ackKey: 'lightingAckNumber' },
    { label: "HVAC", name: adminAlarmStatusHVACText, key: 'hvacAlarmNumber', icon: hvac, ackKey: 'hvacAckNumber' },
    { label: "Controller", name: adminAlarmStatusControllerText, key: 'controllerAlarmNumber', icon: rcu, ackKey: 'controllerAckNumber' },
    { label: "Door Syst.", name: adminAlarmStatusDoorSystText, key: 'doorSystemAlarmNumber', icon: door, ackKey: 'doorAckNumber' },
    { label: "PMS", name: adminAlarmStatusPMSText, key: 'pmsAlarmNumber', icon: pms, ackKey: 'pmsAckNumber' },
    { label: "Emergency", name: adminAlarmStatusEmergencyText, key: 'emergencyAlarmNumber', icon: emerg, ackKey: 'emergencyAckNumber' },
  ];

  const filteredAlarmLabels = alarmLabels.filter(item => adminHideAlarmLabels.includes(item.label));
  const sortedAlarmLabels = filteredAlarmLabels.sort((a, b) => adminHideAlarmLabels.indexOf(a.label) - adminHideAlarmLabels.indexOf(b.label));

  const tooltipContentAlarmNumber = (
    <div style={{ textAlign: 'center', fontSize: '14px', padding: '5px', fontFamily: adminAlarmStatusFontFamily, color: "white", backgroundColor: "transparent" }}>
      {adminAlarmStatusAlarmNumberText}
    </div>
  );

  const tooltipContentAckNumber = (
    <div style={{ textAlign: 'center', fontSize: '14px', padding: '5px', fontFamily: adminAlarmStatusFontFamily, color: "white", backgroundColor: "transparent" }}>
      {adminAlarmStatusAckAlarmNumberText}
    </div>
  );

  return (
    <ResizableBox
      width={400}
      height={320}
      axis="both"
      minConstraints={[300, 250]}  // Minimum size for the card
      maxConstraints={[800, 600]}  // Maximum size for the card
      resizeHandles={['se']}  // Resizing from bottom-right corner
      style={{ margin: 'auto' }}
    >
      <Card sx={{ backgroundColor: adminAlarmStatusBodyBackgroundColor, color: adminAlarmStatusHeaderTextColor, height: '100%', width: '100%' }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ backgroundColor: adminAlarmStatusHeaderBackgroundColor, padding: 1, fontFamily: adminAlarmStatusFontFamily, fontSize: adminAlarmStatusHeaderFontSize }}>
          {adminAlarmStatusHeaderText}
        </Typography>
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            {sortedAlarmLabels.map((alarm, index) => (
              <Grid item xs={4} key={index} display="flex" justifyContent="center">
                <Box position="relative">
                  <Button
                    variant="contained"
                    sx={{
                      fontFamily: adminAlarmStatusFontFamily,
                      width: 90,
                      height: 90,
                      borderRadius: '16px',
                      backgroundColor: alarmData[alarm.key] > 0 ? adminAlarmStatusIfAlarmColor : adminAlarmStatusIfOkayColor,
                      color: 'white',
                      border: '0.3px solid white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: alarmData[alarm.key] > 0 ? adminAlarmStatusIfAlarmColor : adminAlarmStatusIfOkayColor,
                        boxShadow: 'none',
                      },
                    }}
                    onClick={() => {
                      if (alarmsAccessInfo === "ACCESS") {
                        if (alarm.label === "Controller") {
                          navigate("/alarms?category=Helvar&subcategory=RCU");
                        } else {
                          navigate(`/alarms?category=${alarm.label}`);
                        }
                      }
                    }}
                  >
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ fontSize: adminAlarmStatusBodyFontSize, fontFamily: adminAlarmStatusFontFamily, textTransform: 'none', whiteSpace: 'nowrap' }}
                    >
                      {alarm.name}
                    </Typography>
                    <img src={alarm.icon} alt={`${alarm.label} icon`} style={{ width: 35, height: 40, marginBottom: 3 }} />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ fontSize: "9px", fontFamily: adminAlarmStatusFontFamily, textTransform: 'none', whiteSpace: 'nowrap' }}
                    >
                      {alarm.label === 'HVAC' ? alarmData[alarm.key] + "/" + alarmData["numberOfHVAC"] : 
                        alarm.label === 'Controller' ? "R: " + alarmData["rcuAlarmNumber"] + "/" + alarmData["numberOfRCU"] + " H: " + alarmData["helvarAlarmNumber"] + "/" + alarmData["numberOfHelvar"] : '\u200B'}
                    </Typography>
                  </Button>
                  {alarmData[alarm.key] > 0 && (
                    <Tooltip title={tooltipContentAlarmNumber} placement="top" arrow>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -18,
                          right: -18,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: adminAlarmStatusAlarmNumberBackgroundColor,
                          color: adminAlarmStatusAlarmNumberTextColor,
                          border: '2px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          boxShadow: 1,
                          fontFamily: adminAlarmStatusFontFamily,
                        }}
                      >
                        {alarmData[alarm.key]}
                      </Box>
                    </Tooltip>
                  )}
                  {alarmData[alarm.ackKey] > 0 && (
                    <Tooltip title={tooltipContentAckNumber} placement="top" arrow>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -15,
                          right: -15,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: adminAlarmStatusAckAlarmNumberBackgroundColor,
                          color: adminAlarmStatusAckAlarmNumberTextColor,
                          border: '1px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          boxShadow: 3,
                          fontFamily: adminAlarmStatusFontFamily,
                        }}
                      >
                        {alarmData[alarm.ackKey]}
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </ResizableBox>
  );
};

export default AlarmStatus;
