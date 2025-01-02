import React, { useEffect } from "react";
import { Container } from "@mui/material";
import Grid from "@material-ui/core/Grid";
import TempDate from "../CommonComponents/TemperatureDate";
import LogoComponent from "../CommonComponents/LogoComponent";
import ReportPaper from "./ReportPaper";

import alarmReportIcon from "../../assets/icons/reports/alarmReportIcon.png";
import serviceReportIcon from "../../assets/icons/reports/serviceReportIcon.png";
import energyReportIcon from "../../assets/icons/reports/energyReportIcon.png";

import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function Reports({ weatherData, dateData, setActiveLink }) {

  // admin
  const adminReportsBackgroundColor = UISettingsData.adminReportsBackgroundColor; // "#ffffff"
  const adminReportsPaperBackgroundColor = UISettingsData.adminReportsPaperBackgroundColor; // "#fff000"
  const adminReportsFontFamily = UISettingsData.adminReportsFontFamily; // "Ariel"
  const adminReportsDataPlaceHolderText = UISettingsData.adminReportsDataPlaceHolderText; // "tarih araligi seçin"
  const adminReportsDataDownloadText = UISettingsData.adminReportsDataDownloadText; // "indir"
  
  const adminReportsAlarmReportTitle = UISettingsData.adminReportsAlarmReportTitle; // "Alarm Raporları"
  const adminReportsAlarmReportFontColor = UISettingsData.adminReportsAlarmReportFontColor; // "#0000ff"
  const adminReportsAlarmReportFontSize = UISettingsData.adminReportsAlarmReportFontSize; // "25px"
  
  const adminReportsServiceReportTitle = UISettingsData.adminReportsServiceReportTitle; // "Servis"
  const adminReportsServiceReportFontColor = UISettingsData.adminReportsServiceReportFontColor; // "#ff0000"
  const adminReportsServiceReportFontSize = UISettingsData.adminReportsServiceReportFontSize; // "20px"
  
  const adminReportsEnergySavingReportTitle = UISettingsData.adminReportsEnergySavingReportTitle; // "Enerji"
  const adminReportsEnergySavingReportFontColor = UISettingsData.adminReportsEnergySavingReportFontColor; // "#00ff00"
  const adminReportsEnergySavingReportFontSize = UISettingsData.adminReportsEnergySavingReportFontSize; // "15px"
  
  const adminReportsSiraListesi = UISettingsData.adminReportsSiraListesi; // ["alarmReport", "serviceReport"]

  const { temperature, seaTemperature, iconSrc } = weatherData;
  const { formattedDate, formattedTime } = dateData;

  useEffect(() => {
    setActiveLink("reports");
  }, [setActiveLink]);

  // ReportPaper tanımlamaları
  const reportOrder = [
    {
      name: "alarmReport",
      icon: alarmReportIcon,
      title: adminReportsAlarmReportTitle,
      fontColor: adminReportsAlarmReportFontColor,
      fontSize: adminReportsAlarmReportFontSize,
    },
    {
      name: "serviceReport",
      icon: serviceReportIcon,
      title: adminReportsServiceReportTitle,
      fontColor: adminReportsServiceReportFontColor,
      fontSize: adminReportsServiceReportFontSize,
    },
    {
      name: "energyReport",
      icon: energyReportIcon,
      title: adminReportsEnergySavingReportTitle,
      fontColor: adminReportsEnergySavingReportFontColor,
      fontSize: adminReportsEnergySavingReportFontSize,
    },
  ];

  // Sıralanmış raporlar (sadece adminReportsSiraListesi'nde olanlar görünür)
  const sortedReports = adminReportsSiraListesi
    .map((name) => reportOrder.find((report) => report.name === name))
    .filter(Boolean); // Bulunamayan öğeleri çıkar

  return (
    <div
      style={{
        position: "relative",
        width: "calc(100% - 200px)",
        height: "100vh",
        margin: "0 100px",
      }}
    >
      <Grid container spacing={2} style={{ padding: "16px", marginBottom: "-25px" }}>
        <Grid item xs={10} style={{ height: "100px" }} />
        <Grid item xs={2}>
          <TempDate
            formattedDate={formattedDate}
            formattedTime={formattedTime}
            temperature={temperature}
            seaTemperature={seaTemperature}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ backgroundColor: adminReportsBackgroundColor, borderRadius: "15px" }}>
        <Grid item sx = {12} sm={12} md={12} lg={12} style={{ height: "auto", position: "relative", padding: "30px", margin: "0px" }}>
          <Container style={{ padding: "0px" }}>
            {/* Dinamik sıralama */}
            {sortedReports.map((report, index) => (
              <ReportPaper
                key={index}
                reportIcon={report.icon}
                reportTitle={report.title}
                fontColor={report.fontColor}
                fontFamily={adminReportsFontFamily}
                fontSize={report.fontSize}
                placeholder={adminReportsDataPlaceHolderText}
                downloadName={adminReportsDataDownloadText}
                adminPaperBackgroundColor={adminReportsPaperBackgroundColor}
                reportName={report.name}
              />
            ))}
          </Container>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} style={{ textAlign: "right" }}>
          <LogoComponent />
        </Grid>
      </Grid>
    </div>
  );
}

export default Reports;
