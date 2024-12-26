import React, { useMemo } from 'react';
import GaugeChart from 'react-gauge-chart';
import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const GaugeChartComponent = ({ averageTimeGauge, width, height, min, max }) => {

  //admin 
  const adminGaugeChartComponentGaugeColor1 = UISettingsData.adminGaugeChartComponentGaugeColor1; // "#ff0000"
  const adminGaugeChartComponentGaugeColor2 = UISettingsData.adminGaugeChartComponentGaugeColor2; // "#00ff00"
  const adminGaugeChartComponentGaugeColor3 = UISettingsData.adminGaugeChartComponentGaugeColor3; // "#0000ff"
  const adminGaugeChartComponentMinMixTextColor = UISettingsData.adminGaugeChartComponentMinMixTextColor; // "#ffff00"

  // useMemo hook'u, performans optimizasyonu için kullanılır
  const roomServiceAverageRespTimeGaugeChart = useMemo(() => (
    <GaugeChart
      id="gauge-chart1"
      percent={averageTimeGauge}
      arcPadding={0.01}
      colors={[adminGaugeChartComponentGaugeColor1, adminGaugeChartComponentGaugeColor2, adminGaugeChartComponentGaugeColor3]}
      arcWidth={0.3}
      textColor={'#fff'}
      formatTextValue={(value) => `${value}%`}
      needleColor={'#fff'}
      needleBaseColor={'#fff'}
      hideText
      style={{ marginTop: 0, marginLeft: 0, width: width, height: height, borderRadius: '0' }}
    />
  ), [averageTimeGauge]);

  return (
    <div style={{ position: 'relative', width: width, height: height }}>
      {roomServiceAverageRespTimeGaugeChart}
      <div style={{
        position: 'absolute',
        top: 28,
        left: -22,
        right: -30,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 5px',
        color: adminGaugeChartComponentMinMixTextColor,
        fontWeight: 'normal',
        fontSize: '14px',
      }}>
        <span>{min} m.</span>
        <span>{max} m.</span>
      </div>
    </div>
  );
};

export default GaugeChartComponent;