import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import murblue from '../../assets/icons/dashboard/ServiceRequests/murblue.png';
import lndy from '../../assets/icons/dashboard/ServiceRequests/lndy.png';
import GaugeChartComponent from '../CommonComponents/GaugeChartComponent';
import { ResizableBox } from 'react-resizable';  // Import ResizableBox
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const ServiceRequest = ({ averageResponseTimeGauge, averageResponseTime, averageServiceTimeGauge, averageServiceTime, serviceRequestData }) => {

  // admin
  const adminServiceRequestFontFamily = UISettingsData.adminServiceRequestFontFamily; // "poppins"
  const adminServiceRequestHeaderFontSize = UISettingsData.adminServiceRequestHeaderFontSize; // 26
  const adminServiceRequestHeaderText = UISettingsData.adminServiceRequestHeaderText; // "Service Req."
  const adminServiceRequestHeaderTextColor = UISettingsData.adminServiceRequestHeaderTextColor; // "#0fff00"
  const adminServiceRequestHeaderBackgroundColor = UISettingsData.adminServiceRequestHeaderBackgroundColor; // "#FF0ff0"
  const adminServiceRequestBodyFontSize = UISettingsData.adminServiceRequestBodyFontSize; // "16px"
  const adminServiceRequestBodyBackgroundColor = UISettingsData.adminServiceRequestBodyBackgroundColor; // "#ab0f00"
  const adminServiceRequestMurNumberTextColor = UISettingsData.adminServiceRequestMurNumberTextColor; // "#ffffff"
  const adminServiceRequestMurText = UISettingsData.adminServiceRequestMurText; // "MURs"
  const adminServiceRequestMurTextColor = UISettingsData.adminServiceRequestMurTextColor; // "#123456"
  const adminServiceRequestMurOverdueText = UISettingsData.adminServiceRequestMurOverdueText; // "Gecikme"
  const adminServiceRequestMurOverdueTextColor = UISettingsData.adminServiceRequestMurOverdueTextColor; // "#00ff00"
  const adminServiceRequestMurOverdueBlockBackgroundColor = UISettingsData.adminServiceRequestMurOverdueBlockBackgroundColor; // "#ff0000"
  const adminServiceRequestMurOverdueBlockTextColor = UISettingsData.adminServiceRequestMurOverdueBlockTextColor; // "#000000"
  const adminServiceRequestMurInProgressText = UISettingsData.adminServiceRequestMurInProgressText; // "Süreç devam"
  const adminServiceRequestMurInProgressTextColor = UISettingsData.adminServiceRequestMurInProgressTextColor; // "#0ffff0"
  const adminServiceRequestMurInProgressBlockBackgroundColor = UISettingsData.adminServiceRequestMurInProgressBlockBackgroundColor; // "#ff00f0"
  const adminServiceRequestMurInProgressBlockTextColor = UISettingsData.adminServiceRequestMurInProgressBlockTextColor; // "#000000"
  const adminServiceRequestLNDNumberTextColor = UISettingsData.adminServiceRequestLNDNumberTextColor; // "#000000"
  const adminServiceRequestLNDText = UISettingsData.adminServiceRequestLNDText; // "LNDss"
  const adminServiceRequestLNDTextColor = UISettingsData.adminServiceRequestLNDTextColor; // "#FF0000"
  const adminServiceRequestGaugeAvgRespText = UISettingsData.adminServiceRequestGaugeAvgRespText; // "Cevap (dakika): "
  const adminServiceRequestGaugeAvgRespTextColor = UISettingsData.adminServiceRequestGaugeAvgRespTextColor; // "#ff00ff"
  const adminServiceRequestGaugeAvgServiceText = UISettingsData.adminServiceRequestGaugeAvgServiceText; // "Service (min): "
  const adminServiceRequestGaugeAvgServiceTextColor = UISettingsData.adminServiceRequestGaugeAvgServiceTextColor; // "#ff0000"
  const adminServiceRequestHideGaugeAvgResp = UISettingsData.adminServiceRequestHideGaugeAvgResp; // false
  const adminServiceRequestHideGaugeAvgService = UISettingsData.adminServiceRequestHideGaugeAvgService; // false
  const adminServiceRequest = UISettingsData.adminServiceRequest; // ["lnd", "mur"]

  const cardWidth = 400;
  const cardHeight = 320;

  const [localData, setLocalData] = useState({
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
      setLocalData(serviceRequestData);
    } else {
      console.log('serviceRequestData is null or undefined');
    }
  }, [serviceRequestData]);

  const renderSections = () => {
    return adminServiceRequest.map((item) => {
      if (item === "mur") {
        return (
          <React.Fragment key="mur">
            <Grid item xs={5} style={{ display: 'flex', alignItems: 'center' }}>
              <img src={murblue} alt="MUR Icon" style={{ width: 55, height: 70, marginLeft: 12 }} />
              <div style={{ marginLeft: 10 }}>
                <span style={{ color: adminServiceRequestMurNumberTextColor, display: 'block', fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }}>{localData.murNumber}</span>
                <span style={{ color: adminServiceRequestMurTextColor, display: 'block', fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }}>{adminServiceRequestMurText}</span>
              </div>
            </Grid>
            <Grid item xs={7}>
              <div style={{ marginLeft: -10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 5, paddingRight: 45 }}>
                  <span style={{ color: adminServiceRequestMurOverdueTextColor, marginRight: 5, fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }}>{adminServiceRequestMurOverdueText}</span>
                  <Chip label={localData.murOverdue} color="success" size="small" sx={{ borderRadius: '4px', backgroundColor: adminServiceRequestMurOverdueBlockBackgroundColor, color: adminServiceRequestMurOverdueBlockTextColor, fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 45 }}>
                  <span style={{ color: adminServiceRequestMurInProgressTextColor, marginRight: 5, fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }}>{adminServiceRequestMurInProgressText}</span>
                  <Chip label={localData.murInProgress} color="success" size="small" sx={{ borderRadius: '4px', backgroundColor: adminServiceRequestMurInProgressBlockBackgroundColor, color: adminServiceRequestMurInProgressBlockTextColor, fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }} />
                </div>
              </div>
            </Grid>
          </React.Fragment>
        );
      }
      if (item === "lnd") {
        return (
          <React.Fragment key="lnd">
            <Grid item xs={5} style={{ display: 'flex', alignItems: 'center', marginTop: "-12px" }}>
              <img src={lndy} alt="LND Icon" style={{ width: 55, height: 70, marginLeft: 12 }} />
              <div style={{ marginLeft: 10 }}>
                <span style={{ color: adminServiceRequestLNDNumberTextColor, display: 'block', fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }}>{localData.lndNumber}</span>
                <span style={{ color: adminServiceRequestLNDTextColor, display: 'block', fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }}>{adminServiceRequestLNDText}</span>
              </div>
            </Grid>
            <Grid item xs={7}></Grid>
          </React.Fragment>
        );
      }
      return null;
    });
  };

  // LocalStorage'den boyutları geri yükleme
  const [boxSize, setBoxSize] = useState(() => {
    const savedWidth = localStorage.getItem('resizableBoxWidthServiceRequest');
    const savedHeight = localStorage.getItem('resizableBoxHeightServiceRequest');
    return {
      width: savedWidth ? parseInt(savedWidth, 10) : 400,
      height: savedHeight ? parseInt(savedHeight, 10) : 320,
    };
  });
      
  // Boyut değişikliklerini localStorage'de kaydetme
  const onResizeStop = (e, data) => {
    setBoxSize({ width: data.size.width, height: data.size.height });
    localStorage.setItem('resizableBoxWidthServiceRequest', data.size.width);
    localStorage.setItem('resizableBoxHeightServiceRequest', data.size.height);
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
    <Card sx={{ backgroundColor: adminServiceRequestBodyBackgroundColor, color: 'white', height: '100%', width: '100%' }}>
      <Typography variant="h6" align="center" gutterBottom sx={{ color: adminServiceRequestHeaderTextColor, backgroundColor: adminServiceRequestHeaderBackgroundColor, padding: 1, fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestHeaderFontSize }}>
        {adminServiceRequestHeaderText}
      </Typography>
      <CardContent>
        {serviceRequestData && (
          <Grid container spacing={2} alignItems="center" style={{ marginLeft: '15px' }}>
            {renderSections()}
            <Grid container spacing={2} justifyContent="center">
              {!adminServiceRequestHideGaugeAvgResp && (
                <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '-40px' }}>
                  <GaugeChartComponent 
                    averageTimeGauge={averageResponseTimeGauge} 
                    width={"120px"} 
                    height={"120px"} 
                    min={0} 
                    max={localData.dashboardReqResponceTimeUpperLimit} 
                  />
                  <div style={{ textAlign: 'center', marginTop: -70, marginLeft: 0 }}>
                    <span 
                      style={{ 
                        color: adminServiceRequestGaugeAvgRespTextColor, 
                        display: 'block', 
                        fontFamily: adminServiceRequestFontFamily, 
                        fontSize: adminServiceRequestBodyFontSize 
                      }}>
                      {adminServiceRequestGaugeAvgRespText}{averageResponseTime}
                    </span>
                  </div>
                </Grid>
              )}
              {!adminServiceRequestHideGaugeAvgService && (
                <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <GaugeChartComponent averageTimeGauge={averageServiceTimeGauge} width={"120px"} height={"120px"} min={0} max={localData.dashboardServiceResponceTimeUpperLimit} />
                  <div style={{ textAlign: 'center', marginTop: -70, marginLeft: 0 }}>
                    <span style={{ color: adminServiceRequestGaugeAvgServiceTextColor, display: 'block', fontFamily: adminServiceRequestFontFamily, fontSize: adminServiceRequestBodyFontSize }}>
                      {adminServiceRequestGaugeAvgServiceText}{averageServiceTime}
                    </span>
                  </div>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
    </ResizableBox>
  );
};

export default ServiceRequest;
