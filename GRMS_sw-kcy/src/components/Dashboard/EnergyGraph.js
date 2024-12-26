import * as React from 'react';
import { LineChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const years = [
  new Date(1990, 0, 1),
  new Date(1991, 0, 1),
  new Date(1992, 0, 1),
  new Date(1993, 0, 1),
  new Date(1994, 0, 1),
  new Date(1995, 0, 1),
  new Date(1996, 0, 1),
  new Date(1997, 0, 1),
  new Date(1998, 0, 1),
  new Date(1999, 0, 1),
  new Date(2000, 0, 1),
  new Date(2001, 0, 1),
  new Date(2002, 0, 1),
  new Date(2003, 0, 1),
  new Date(2004, 0, 1),
  new Date(2005, 0, 1),
  new Date(2006, 0, 1),
  new Date(2007, 0, 1),
  new Date(2008, 0, 1),
  new Date(2009, 0, 1),
  new Date(2010, 0, 1),
  new Date(2011, 0, 1),
  new Date(2012, 0, 1),
  new Date(2013, 0, 1),
  new Date(2014, 0, 1),
  new Date(2015, 0, 1),
  new Date(2016, 0, 1),
  new Date(2017, 0, 1),
  new Date(2018, 0, 1),
];

const doubleValues = (array) => {
  return array.map(value => value * 2);
};

const noEMS1 = [
  28129, 28294.264, 28619.805, 28336.16, 28907.977, 29418.863, 29736.645, 30341.807,
  31323.078, 32284.611, 33409.68, 33920.098, 34152.773, 34292.03, 35093.824,
  35495.465, 36166.16, 36845.684, 36761.793, 35534.926, 36086.727, 36691, 36571,
  36632, 36527, 36827, 37124, 37895, 38515.918,
];

const noEMS = doubleValues(noEMS1);

const EMS = [
  25391, 26769.96, 27385.055, 27250.701, 28140.057, 28868.945, 29349.982, 30186.945,
  31129.584, 32087.604, 33367.285, 34260.29, 34590.93, 34716.44, 35528.715,
  36205.574, 38014.137, 39752.207, 40715.434, 38962.938, 41109.582, 43189, 43320,
  43413, 43922, 44293, 44689, 45619.785, 46177.617,
];

const outsideTemp = [
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    28, 27, 26, 25, 24, 23, 22, 21, 20, 19,
    18, 17, 16, 15, 14, 13, 12, 11, 10
  ];

export default function EnergyGraph() {

    // admin
    const adminEnergyGraphFontFamily = UISettingsData.adminEnergyGraphFontFamily; // 'ariel'
    const adminEnergyGraphNoEmsText = UISettingsData.adminEnergyGraphNoEmsText; // "EMS YOK"
    const adminEnergyGraphNoEmsTextColor = UISettingsData.adminEnergyGraphNoEmsTextColor; // "#00ff00"

    const adminEnergyGraphEmsText = UISettingsData.adminEnergyGraphEmsText; // "EMS var"
    const adminEnergyGraphEmsTextColor = UISettingsData.adminEnergyGraphEmsTextColor; // "#00ffff"

    const adminEnergyGraphOutsideTempText = UISettingsData.adminEnergyGraphOutsideTempText; // "Dışarı sıack"
    const adminEnergyGraphOutsideTempTextColor = UISettingsData.adminEnergyGraphOutsideTempTextColor; // "#000000"

    return (
      <div style={{ textAlign: 'center'}}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: adminEnergyGraphFontFamily, marginBottom: '0px' }}> </h2>
        <LineChart
          xAxis={[
            {
              id: 'Years',
              data: years,
              scaleType: 'time',
              valueFormatter: (date) => date.getFullYear().toString(),
              tickSize: 10, // Göstergelerin boyutu
            },
          ]}
          yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId'}]}
          rightAxis="rightAxisId"
          series={[
            {
                id: 'No EMS',
                label: adminEnergyGraphNoEmsText,
                data: noEMS,
                area: true,
                showMark: true,
                color: adminEnergyGraphNoEmsTextColor,
                yAxisKey:"leftAxisId"
            },
            {
                id: 'EMS',
                label: adminEnergyGraphEmsText,
                data: EMS,
                area: true,
                showMark: true,
                color: adminEnergyGraphEmsTextColor,
                yAxisKey:"leftAxisId"
            },
            {
                id: 'outTemp',
                label: adminEnergyGraphOutsideTempText,
                data: outsideTemp,
                area: false,
                showMark: true,
                color: adminEnergyGraphOutsideTempTextColor,
                yAxisKey:"rightAxisId"
            },
          ]}
          width={800}
          height={400}
          margin={{ left: 70 }}
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: 16,
                fill: 'white',
                fontFamily: adminEnergyGraphFontFamily
              },
              position: {
                vertical: 'top',
                horizontal: 'middle',
              },
            },
          }}
          sx={{
            [`& .${axisClasses.root}`]: {
              [`& .${axisClasses.tick}, .${axisClasses.line}`]: {
                stroke: 'white',
                strokeWidth: 2,
                
              },
              [`& .${axisClasses.tickLabel}`]: {
                fill: 'white',
                fontFamily: adminEnergyGraphFontFamily,
                color: "red"
              },
              [`& .${axisClasses.label}`]: {
                fill: 'white',
                fontFamily: adminEnergyGraphFontFamily,
              },
            },
          }}
        />
      </div>
    );
  }