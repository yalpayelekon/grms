import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import OccupancyRatesIcon from '../../assets/icons/dashboard/OccupancyRates/OccupancyRatesIcon.png';
import { ResizableBox } from 'react-resizable';  // Import ResizableBox
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik
import config from "../../config/config.json";  // JSON dosyasını içe aktarın

const OccupancyRates = () => {

  // admin
  const adminOccupancyRatesFontFamily = UISettingsData.adminOccupancyRatesFontFamily; // "poppins"
  const adminOccupancyRatesHeaderFontSize = UISettingsData.adminOccupancyRatesHeaderFontSize; // 32
  const adminOccupancyRatesHeaderText = UISettingsData.adminOccupancyRatesHeaderText; // "Occus ORANLARI"
  const adminOccupancyRatesHeaderTextColor = UISettingsData.adminOccupancyRatesHeaderTextColor; // "#fff000"
  const adminOccupancyRatesHeaderBackgroundColor = UISettingsData.adminOccupancyRatesHeaderBackgroundColor; // "#FF0ff0"
  
  const adminOccupancyRatesBodyFontSize = UISettingsData.adminOccupancyRatesBodyFontSize; // 20
  const adminOccupancyRatesBodyBackgroundColor = UISettingsData.adminOccupancyRatesBodyBackgroundColor; // "#2542ff"
  
  const adminOccupancyRatesPieCharRentedOccupied = UISettingsData.adminOccupancyRatesPieCharRentedOccupied; // "#0000ff"
  const adminOccupancyRatesPieCharRentedVacant = UISettingsData.adminOccupancyRatesPieCharRentedVacant; // "#00ff00"
  const adminOccupancyRatesPieChartUnrentedColor = UISettingsData.adminOccupancyRatesPieChartUnrentedColor; // "#ff0000"
  
  const adminOccupancyRatesOccupancyRateTextColor = UISettingsData.adminOccupancyRatesOccupancyRateTextColor; // "#00ffff"
  const adminOccupancyRatesOccupancyRateTextColor2 = UISettingsData.adminOccupancyRatesOccupancyRateTextColor2; // "#ff0000"
  
  const adminOccupancyRatesRentedOccupiedText = UISettingsData.adminOccupancyRatesRentedOccupiedText; // "Oda tutuldu ves içerde"
  const adminOccupancyRatesRentedOccupiedTextColor = UISettingsData.adminOccupancyRatesRentedOccupiedTextColor; // "#ff0000"
  
  const adminOccupancyRatesRentedVacantText = UISettingsData.adminOccupancyRatesRentedVacantText; // "oda tutusdldu dışarda"
  const adminOccupancyRatesRentedVacantTextColor = UISettingsData.adminOccupancyRatesRentedVacantTextColor; // "#ff00ff"
  
  const adminOccupancyRatesUnrentedText = UISettingsData.adminOccupancyRatesUnrentedText; // "boşs"
  const adminOccupancyRatesUnrentedTextColor = UISettingsData.adminOccupancyRatesUnrentedTextColor; // "#00f00"
  
  const adminOccupancyRatesOccupancyList = UISettingsData.adminOccupancyRatesOccupancyList; // ["rentedVacant", "unrented"]

  const [occupancyData, setOccupancyData] = useState({ rentedOccupied: 0, rentedVacant: 0, odaSayisi: 0, unrented: 0 });

  const cardWidth = 400;
  const cardHeight = 320;

  useEffect(() => {
    const fetchData = () => {
      const url = `${config.apiBaseUrl}${config.endpoints.getDashboardOccupancyRateData}`;
      fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data && data.occupancyRate) {
          console.log("getDashboardOccupancyRateData", data)
          // console.log("getDashboardOccupancyRateData.occupancyRate", data.occupancyRate[0])
          setOccupancyData(data.occupancyRate[0])
      }
      })
      .catch(error => {
        // Hata durumunda burada işlem yapabilirsiniz
        console.error("Veri alinamadi:", error);
      });
    };

    // İlk başlangıçta fetch işlemini yap
    fetchData();

    // Her 5 saniyede bir fetch işlemini tekrar et
    const intervalId = setInterval(fetchData, config.intervalTimes.getDashboardOccupancyRateData);
    //console.log("setInterval")
    
    // Bileşen unmount edildiğinde interval'i temizle
    return () => clearInterval(intervalId);

  }, []);
  

  const { rentedOccupied, rentedVacant, odaSayisi, unrented } = occupancyData;
  const occupancyRate = parseInt((((rentedOccupied + rentedVacant) / odaSayisi) * 100).toFixed(2));

  const data2 = [
    { key: "rentedOccupied", label: adminOccupancyRatesRentedOccupiedText, value: rentedOccupied, color: adminOccupancyRatesPieCharRentedOccupied, textColor: adminOccupancyRatesRentedOccupiedTextColor},
    { key: "rentedVacant", label: adminOccupancyRatesRentedVacantText, value: rentedVacant, color: adminOccupancyRatesPieCharRentedVacant, textColor: adminOccupancyRatesRentedVacantTextColor},
    { key: "unrented", label: adminOccupancyRatesUnrentedText, value: unrented, color: adminOccupancyRatesPieChartUnrentedColor, textColor: adminOccupancyRatesUnrentedTextColor},
  ];
  
  // Sıralama ve filtreleme
  const sortedData = adminOccupancyRatesOccupancyList
  .map((key) => data2.find((item) => item.key === key))
  .filter(Boolean); // Bulunamayanları (undefined) çıkar

  // LocalStorage'den boyutları geri yükleme
  const [boxSize, setBoxSize] = useState(() => {
    const savedWidth = localStorage.getItem('resizableBoxWidthOccupancyRate');
    const savedHeight = localStorage.getItem('resizableBoxHeightOccupancyRate');
    return {
      width: savedWidth ? parseInt(savedWidth, 10) : 400,
      height: savedHeight ? parseInt(savedHeight, 10) : 320,
    };
  });
      
  // Boyut değişikliklerini localStorage'de kaydetme
  const onResizeStop = (e, data) => {
    setBoxSize({ width: data.size.width, height: data.size.height });
    localStorage.setItem('resizableBoxWidthOccupancyRate', data.size.width);
    localStorage.setItem('resizableBoxHeightOccupancyRate', data.size.height);
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
    <Card sx={{ backgroundColor: adminOccupancyRatesBodyBackgroundColor, color: adminOccupancyRatesHeaderTextColor, height: '100%', width: '100%' }}>
      <Typography variant="h6" align="center" gutterBottom sx={{ backgroundColor: adminOccupancyRatesHeaderBackgroundColor, padding: 1, fontFamily: adminOccupancyRatesFontFamily, fontSize: adminOccupancyRatesHeaderFontSize }}>
        {adminOccupancyRatesHeaderText}
      </Typography>
      <CardContent>
        <Box display="flex" alignItems="center">
          <PieChart
            series={[
              {
                data: data2,
                innerRadius: 30,
                outerRadius: 60,
                cornerRadius:5,      
                valueFormatter: (data) => data.value.toString() + " - "+ (100*(data.value/odaSayisi)).toFixed(2)+"%",
              },
            ]}
            width={130}
            height={130}
            slotProps={{
              legend: { hidden: true },
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: -40, marginRight:30 }}>
          <img src={OccupancyRatesIcon} alt="OccupancyRatesIcon" style={{ width: 30, height: 70 }} />
          <Box textAlign="right" style={{marginLeft:10}}>
            <Typography variant="h6" sx={{ color: adminOccupancyRatesOccupancyRateTextColor, fontWeight: 'bold', fontFamily: adminOccupancyRatesFontFamily, fontSize: adminOccupancyRatesBodyFontSize}}>{occupancyRate} %</Typography>
            <Typography variant="body2" sx={{fontFamily: adminOccupancyRatesFontFamily, fontSize: adminOccupancyRatesBodyFontSize}}><span style={{ color: adminOccupancyRatesOccupancyRateTextColor2 }}>{rentedOccupied + rentedVacant}/{odaSayisi} </span></Typography>
          </Box>
          </div>
        </Box>
        <Box mt={2}>
          {sortedData.map((item, index) => (
            <Box display="flex" justifyContent="space-between" px={2} mt={index === 0 ? 0 : 1} key={item.key}>
              <Box display="flex" alignItems="center" marginLeft="30px">
                <Box width={10} height={10} borderRadius="50%" bgcolor={item.color} mr={1} />
                <Typography variant="body2" sx={{ color: item.textColor, fontFamily: adminOccupancyRatesFontFamily, fontSize: adminOccupancyRatesBodyFontSize }}>
                  {item.label}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: item.textColor, fontFamily: adminOccupancyRatesFontFamily, fontSize: adminOccupancyRatesBodyFontSize, marginRight: "30px" }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
    </ResizableBox>
  );
};

export default OccupancyRates;
