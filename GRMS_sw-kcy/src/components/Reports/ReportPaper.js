import React, { useState } from "react";
import { Grid, Paper, Box, Typography } from "@mui/material";
import DateRangePicker from "./DateRangePicker";
import AlarmReportButtons from "./AlarmReportButtons";

const ReportPaper = ({
  reportIcon,
  reportTitle,
  fontColor,
  fontFamily,
  fontSize,
  placeholder,
  downloadName,
  adminPaperBackgroundColor,
  reportName
}) => {
  const [dateRange, setDateRange] = useState([null, null]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: "10px", sm: "15px" }, // Ekran boyutuna göre padding
        width: "100%", // Genişlik yüzde 100
        maxWidth: "1200px", // Max genişlik 1200px
        margin: "15px auto", // Merkezde yer alması için margin
        backgroundColor: adminPaperBackgroundColor,
      }}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {/* Sol Kısım (İkon ve Başlık) */}
        <Grid item xs={12} sm={8} md={8}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* İkon */}
            <img 
              src={reportIcon} 
              alt="Report Icon" 
              style={{
                height: "24px", // Varsayılan boyut
                width: "24px",  // Varsayılan boyut
                maxWidth: "30px", // İkonun maksimum genişliği
                width: "auto", // Ekran küçüldükçe oranlı küçülmesi
              }} 
            />
            <Box sx={{ width: "15px" }} />
            
            {/* Başlık */}
            <Typography
              variant="body1"
              sx={{
                fontFamily: fontFamily,
                fontWeight: 600,
                flexGrow: 1, // Başlık alanının geri kalan kısmını kaplamasına izin verir
                color: fontColor,
                fontSize: { xs: "16px", sm: "24px", md: fontSize }, // Font boyutu ekran boyutuna göre
              }}
            >
              {reportTitle}
            </Typography>
            <Box sx={{ width: "35px" }} />
            
            {/* Tarih Seçici */}
            <Box sx={{ width: "100%", maxWidth: "350px" }}>
              <DateRangePicker
                dateRange={dateRange}
                handleDateChange={(update) => setDateRange(update)}
                placeholder={placeholder}
                sx={{ width: "100%" }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Sağ Kısım (Alarm Rapor Butonları) */}
        <Grid item xs={12} sm={4} md={4}>
          <Box sx={{ textAlign: "right" }}>
            <AlarmReportButtons dateRange={dateRange} reportName={reportName} downloadName={downloadName} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReportPaper;
