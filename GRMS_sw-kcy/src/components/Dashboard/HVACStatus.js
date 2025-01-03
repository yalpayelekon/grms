import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Avatar from '@mui/material/Avatar'; 
import HvacActiveCold from '../../assets/icons/dashboard/HVACStatus/HvacActiveCold.png';
import HvacActiveHot from '../../assets/icons/dashboard/HVACStatus/HvacActiveHot.png';
import HvacActive from '../../assets/icons/dashboard/HVACStatus/HvacActive.png';
import TemperatureIcon from '../../assets/icons/tempDate/temperature.png';
import { ResizableBox } from 'react-resizable';  // Import ResizableBox
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik
import config from "../../config/config.json";  // JSON dosyasını içe aktarın

export default function HVACStatus({temperature}) {

  // admin
  const adminHVACStatusFontFamily = UISettingsData.adminHVACStatusFontFamily; // "Poppins"
  const adminHVACStatusHeaderFontSize = UISettingsData.adminHVACStatusHeaderFontSize; // 28
  const adminHVACStatusHeaderText = UISettingsData.adminHVACStatusHeaderText; // "Havalandirma"
  const adminHVACStatusHeaderTextColor = UISettingsData.adminHVACStatusHeaderTextColor; // "#ff0000"
  const adminHVACStatusHeaderBackgroundColor = UISettingsData.adminHVACStatusHeaderBackgroundColor; // "#00ff00"
  const adminHVACStatusCoolingText = UISettingsData.adminHVACStatusCoolingText; // "Sogutma Sogutma"
  const adminHVACStatusCoolingColor = UISettingsData.adminHVACStatusCoolingColor; // "#00faff"
  const adminHVACStatusCoolingPayColor = UISettingsData.adminHVACStatusCoolingPayColor; // "#000fff"
  const adminHVACStatusCoolingPaydaColor = UISettingsData.adminHVACStatusCoolingPaydaColor; // "#000000"
  const adminHVACStatusHeatingText = UISettingsData.adminHVACStatusHeatingText; // "Isıtma"
  const adminHVACStatusHeatingColor = UISettingsData.adminHVACStatusHeatingColor; // "#ff00cb"
  const adminHVACStatusHeatingPayColor = UISettingsData.adminHVACStatusHeatingPayColor; // "#a00fff"
  const adminHVACStatusHeatingPaydaColor = UISettingsData.adminHVACStatusHeatingPaydaColor; // "#ffffaa"
  const adminHVACStatusOffText = UISettingsData.adminHVACStatusOffText; // "Kapali Kapali Kapali"
  const adminHVACStatusOffColor = UISettingsData.adminHVACStatusOffColor; // "#00000a"
  const adminHVACStatusOffPayColor = UISettingsData.adminHVACStatusOffPayColor; // "#CCC9C9"
  const adminHVACStatusOffPaydaColor = UISettingsData.adminHVACStatusOffPaydaColor; // "#faafaa"
  const adminHVACStatusContentFontSize = UISettingsData.adminHVACStatusContentFontSize; // 18
  const adminHVACStatusSlashColor = UISettingsData.adminHVACStatusSlashColor; // "#ffffff"
  const adminHVACStatusBodyBackgroundColor = UISettingsData.adminHVACStatusBodyBackgroundColor; // "#dddd00"
  const adminHVACStatusTempOutsideText = UISettingsData.adminHVACStatusTempOutsideText; // "Dışarı Sıcaklığı Dışarı"
  const adminHVACStatusTempOutsideTextColor = UISettingsData.adminHVACStatusTempOutsideTextColor; // "#00ff00"
  const adminHVACStatusTempOutsideColor = UISettingsData.adminHVACStatusTempOutsideColor; // "#ff0000"
  const adminHVACStatusHideTempOutside = UISettingsData.adminHVACStatusHideTempOutside; // false
  const adminHVACStatusHVACList = UISettingsData.adminHVACStatusHVACList; // ["Cooling", "Off"]

  const cardWidth = 400;
  const cardHeight = 320;
  const letterSpacing = '0.5px'; // Harf aralığı için kullanılan değer

  const [hvacStatus, setHvacStatus] = useState({
    hvacCoolingNumber: 0,
    hvacHeatingNumber: 0,
    hvacOffNumber: 0,
    odaSayisi: 0
  });

  useEffect(() => {
    const fetchData = () => {
      const url = `${config.apiBaseUrl}${config.endpoints.getDashboardHVACStatusData}`;
      fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.hvacStatus) {
          setHvacStatus(data.hvacStatus[0])
        }
      })
      .catch(error => {
        console.error("Veri alinamadi:", error);
      });
    };

    fetchData();

    const intervalId = setInterval(fetchData, config.intervalTimes.getDashboardHVACStatusData);
    return () => clearInterval(intervalId);
  }, []);

  // Rendered HVAC components based on the adminHVACStatusHVACList order
  const renderHVACItem = (hvacType) => {
    switch (hvacType) {
      case "Cooling":
        return (
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} key={hvacType}>
            <Avatar src={HvacActiveCold} sx={{ marginRight: 2 }} />
            <Typography
              variant="body1"
              sx={{
                color: adminHVACStatusCoolingColor,
                fontFamily: adminHVACStatusFontFamily,
                fontSize: adminHVACStatusContentFontSize,
                flexShrink: 0,
                minWidth: '80px',
                textAlign: 'left',
              }}
            >
              {adminHVACStatusCoolingText}
            </Typography>
            <Grid sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusCoolingPayColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                }}
              >
                {hvacStatus.hvacCoolingNumber}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusSlashColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                  mx: 0.5,
                }}
              >
                /
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusCoolingPaydaColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                }}
              >
                {hvacStatus.odaSayisi}
              </Typography>
            </Grid>
          </Grid>
        );
      case "Heating":
        return (
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }} key={hvacType}>
            <Avatar src={HvacActiveHot} sx={{ marginRight: 2 }} />
            <Typography
              variant="body1"
              sx={{
                color: adminHVACStatusHeatingColor,
                fontFamily: adminHVACStatusFontFamily,
                fontSize: adminHVACStatusContentFontSize,
                flexShrink: 0,
                minWidth: '80px',
                textAlign: 'left',
              }}
            >
              {adminHVACStatusHeatingText}
            </Typography>
            <Grid sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusHeatingPayColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                }}
              >
                {hvacStatus.hvacHeatingNumber}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusSlashColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                  mx: 0.5,
                }}
              >
                /
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusHeatingPaydaColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                }}
              >
                {hvacStatus.odaSayisi}
              </Typography>
            </Grid>
          </Grid>
        );
      case "Off":
        return (
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center'}} key={hvacType}>
            <Avatar src={HvacActive} sx={{ marginRight: 2 }} />
            <Typography
              variant="body1"
              sx={{
                color: adminHVACStatusOffColor,
                fontFamily: adminHVACStatusFontFamily,
                fontSize: adminHVACStatusContentFontSize,
                flexShrink: 0,
                minWidth: '80px',
                textAlign: 'left',
              }}
            >
              {adminHVACStatusOffText}
            </Typography>
            <Grid sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusOffPayColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                }}
              >
                {hvacStatus.hvacOffNumber}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusSlashColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                  mx: 0.5,
                }}
              >
                /
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: adminHVACStatusOffPaydaColor,
                  fontFamily: adminHVACStatusFontFamily,
                  fontSize: adminHVACStatusContentFontSize,
                }}
              >
                {hvacStatus.odaSayisi}
              </Typography>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  // LocalStorage'den boyutları geri yükleme
  const [boxSize, setBoxSize] = useState(() => {
    const savedWidth = localStorage.getItem('resizableBoxWidthHVAC');
    const savedHeight = localStorage.getItem('resizableBoxHeightHVAC');
    return {
      width: savedWidth ? parseInt(savedWidth, 10) : 400,
      height: savedHeight ? parseInt(savedHeight, 10) : 320,
    };
  });
      
  // Boyut değişikliklerini localStorage'de kaydetme
  const onResizeStop = (e, data) => {
    setBoxSize({ width: data.size.width, height: data.size.height });
    localStorage.setItem('resizableBoxWidthHVAC', data.size.width);
    localStorage.setItem('resizableBoxHeightHVAC', data.size.height);
  };

  return (
    <ResizableBox
      width={boxSize.width} //{400}
      height={boxSize.height} // {320}
      axis="both"
      minConstraints={[350, 320]}  // Minimum size for the card
      maxConstraints={[500, 600]}  // Maximum size for the card
      resizeHandles={['se']}  // Resizing from bottom-right corner
      onResizeStop={onResizeStop}
      style={{ margin: 'auto' }}
    >
    <Card
      sx={{
        backgroundColor: adminHVACStatusBodyBackgroundColor,
        color: adminHVACStatusHeaderTextColor,
        height: '100%', width: '100%',
        margin: 'auto',
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          backgroundColor: adminHVACStatusHeaderBackgroundColor,
          padding: 1,
          fontFamily: adminHVACStatusFontFamily,
          fontSize: adminHVACStatusHeaderFontSize,
        }}
      >
        {adminHVACStatusHeaderText}
      </Typography>

      <CardContent>
        <Grid container spacing={2}>
          {adminHVACStatusHVACList.map(hvacType => renderHVACItem(hvacType))}

          {!adminHVACStatusHideTempOutside && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'right',
                fontSize: adminHVACStatusContentFontSize,
                letterSpacing: letterSpacing,
                fontFamily: adminHVACStatusFontFamily,
                justifyContent: 'flex-end',  // Buradaki satır sağa yaslamak için kullanılıyor
                width: '100%'  // Bu satır da elemanın tam genişliği kullanmasını sağlar
              }}
            >
              <div style={{ color: 'white', textAlign: 'right' }}>  {/* 'textAlign: right' burada metni sağa yaslamak için eklendi */}
                <div style={{ color: adminHVACStatusTempOutsideTextColor }}>{adminHVACStatusTempOutsideText}</div>
                <img
                  src={TemperatureIcon}
                  alt="Icon"
                  style={{
                    marginTop: '-5px',
                    marginRight: '5px',
                    height: '25px',
                    width: '25px',
                  }}
                />
                <span style={{ color: adminHVACStatusTempOutsideColor }}>{temperature}°C</span>
              </div>
            </div>
          )}

        </Grid>
      </CardContent>
    </Card>
    </ResizableBox>
  );
};
