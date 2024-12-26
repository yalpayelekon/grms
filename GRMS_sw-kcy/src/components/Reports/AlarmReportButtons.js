import React, { useState, useEffect } from 'react';

import { Grid, Link } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";

import pdfIcon from '../../icons/reports/PDF.png';
import csvIcon from '../../icons/reports/CSV.png';
import xlsxIcon from '../../icons/reports/XLS.png';

import Swal from 'sweetalert2';
import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const AlarmReportButtons = ({ dateRange, reportName, downloadName }) => {

  // admin
  const adminAlarmReportsInfoMessageTitle = UISettingsData.adminAlarmReportsInfoMessageTitle || "No Datas";
  const adminAlarmReportsInfoMessageSubTitle = UISettingsData.adminAlarmReportsInfoMessageSubTitle || "No data available for the selected date ranges";
  const adminAlarmReportsAlertMessageTitle = UISettingsData.adminAlarmReportsAlertMessageTitle || "Errors";
  const adminAlarmReportsAlertMessageSubTitle =  UISettingsData.adminAlarmReportsAlertMessageSubTitle || "Please select a valid date ranges.";
  
  const exportToCsv = (dateRange, filename) => {
    // Check if dateRange is not [null, null]
    if (dateRange[0] !== null && dateRange[1] !== null) {
      fetchReportsData(dateRange, filename)
        .then(localData => {
          console.log("localData: ", localData);
  
          if (localData && localData.length !== 0) {
            // Flatten data to handle nested objects
            const flattenedData = localData.map(item => ({
              ...item,
              lightingAlarmDetails: item.lightingAlarmDetails
                ? JSON.stringify(item.lightingAlarmDetails)
                : "",
              rcuAlarmDetails: item.rcuAlarmDetails
                ? JSON.stringify(item.rcuAlarmDetails)
                : "",
              helvarAlarmDetails: item.helvarAlarmDetails
                ? JSON.stringify(item.helvarAlarmDetails)
                : "",
              hvacAlarmDetails: item.hvacAlarmDetails
                ? JSON.stringify(item.hvacAlarmDetails)
                : ""
            }));
  
            // Generate headers dynamically
            const headers = Object.keys(flattenedData[0]);
  
            // Create CSV content
            const csvStr = [
              headers, // Add headers as the first row
              ...flattenedData.map(row =>
                headers.map(key => `"${row[key] ?? ""}"`) // Add quotes for CSV formatting
              ),
            ]
              .map(e => e.join(",")) // Join columns with a comma
              .join("\n"); // Join rows with a newline
  
            // Create and download the CSV file
            const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `${filename}.csv`);
          } else {
            console.log("No data available for the specified date range.");
            Swal.fire({
              title: adminAlarmReportsInfoMessageTitle,
              text: adminAlarmReportsInfoMessageSubTitle,
              icon: "info",
              confirmButtonText: "Ok",
            });
          }
        })
        .catch(error => {
          console.error("Error processing data for CSV: ", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while processing the data. Please try again.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    } else {
      Swal.fire({
        title: adminAlarmReportsAlertMessageTitle,
        text: adminAlarmReportsAlertMessageSubTitle,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  
  const exportToPdf = (dateRange, filename) => {
    // Check if dateRange is not [null, null]
    if (dateRange[0] !== null && dateRange[1] !== null) {
      fetchReportsData(dateRange, filename)
        .then(localData => {
          console.log("localData: ", localData);
  
          if (localData && localData.length !== 0) {
            // Flatten data to handle nested objects like `lightingAlarmDetails`, `rcuAlarmDetails`, `helvarAlarmDetails`, `hvacAlarmDetails`
            const flattenedData = localData.map(item => ({
              ...item,
              lightingAlarmDetails: item.lightingAlarmDetails
                ? JSON.stringify(item.lightingAlarmDetails)
                : "",
              rcuAlarmDetails: item.rcuAlarmDetails
                ? JSON.stringify(item.rcuAlarmDetails)
                : "",
              helvarAlarmDetails: item.helvarAlarmDetails
                ? JSON.stringify(item.helvarAlarmDetails)
                : "",
              hvacAlarmDetails: item.hvacAlarmDetails
                ? JSON.stringify(item.hvacAlarmDetails)
                : ""
            }));
  
            const doc = new jsPDF({ orientation: "landscape" }); // Landscape orientation
            const tableColumn = Object.keys(flattenedData[0]);
            const tableRows = flattenedData.map(row =>
              tableColumn.map(key => row[key])
            );
  
            // Create table in PDF with dynamic column width
            autoTable(doc, {
              head: [tableColumn],
              body: tableRows,
              styles: {
                fontSize: 6, // Smaller font size for better fit
                overflow: "linebreak", // Text wrapping
              },
              margin: { top: 10 },
            });
  
            // Save the PDF file
            doc.save(filename + ".pdf");
          } else {
            console.log("No data available for the specified date range.");
            Swal.fire({
              title: adminAlarmReportsInfoMessageTitle,
              text: adminAlarmReportsInfoMessageSubTitle,
              icon: "info",
              confirmButtonText: "Ok",
            });
          }
        })
        .catch(error => {
          console.error("Error processing data for PDF: ", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while processing the data. Please try again.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    } else {
      Swal.fire({
        title: adminAlarmReportsAlertMessageTitle,
        text: adminAlarmReportsAlertMessageSubTitle,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
    
  const exportToXls = (dateRange, filename) => {
    // Check if dateRange is not [null, null]
    if (dateRange[0] !== null && dateRange[1] !== null) {
      fetchReportsData(dateRange, filename)
        .then(localData => {
          console.log("localData: ", localData);
  
          if (localData && localData.length !== 0) {
            // Flatten data to handle nested objects like `lightingAlarmDetails`, `rcuAlarmDetails`, `helvarAlarmDetails`, `hvacAlarmDetails`
            const flattenedData = localData.map(item => ({
              ...item,
              lightingAlarmDetails: item.lightingAlarmDetails
                ? JSON.stringify(item.lightingAlarmDetails)
                : "",
              rcuAlarmDetails: item.rcuAlarmDetails
                ? JSON.stringify(item.rcuAlarmDetails)
                : "",
              helvarAlarmDetails: item.helvarAlarmDetails
                ? JSON.stringify(item.helvarAlarmDetails)
                : "",
              hvacAlarmDetails: item.hvacAlarmDetails
                ? JSON.stringify(item.hvacAlarmDetails)
                : ""
            }));
  
            // Create worksheet and workbook
            const worksheet = XLSX.utils.json_to_sheet(flattenedData);
            console.log("worksheet: ", worksheet);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
            // Write workbook to file
            XLSX.writeFile(workbook, `${filename}.xlsx`);
          } else {
            console.log("No data available for the specified date range.");
            Swal.fire({
              title: adminAlarmReportsInfoMessageTitle,
              text: adminAlarmReportsInfoMessageSubTitle,
              icon: "info",
              confirmButtonText: "Ok",
            });
          }
        })
        .catch(error => {
          console.error("Error processing data for Excel: ", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while processing the data. Please try again.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    } else {
      Swal.fire({
        title: adminAlarmReportsAlertMessageTitle,
        text: adminAlarmReportsAlertMessageSubTitle,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  
  const downloadAllFormats = (dateRange, filename) => {

    exportToCsv(dateRange, filename);
    exportToPdf(dateRange, filename);
    exportToXls(dateRange, filename);

  };

  const fetchReportsData = (dateRange, reportName) => {
    const url = `http://localhost:8000/getReportsData/${dateRange}/${reportName}/`;

    return fetch(url)
        .then(res => res.json())
        .then(reportsData => {
            if (reportsData && reportsData.reportsData) {
                console.log("FROM DB reportsData", reportsData.reportsData);
                
                if (reportsData.reportsData.length === 0) {
                    Swal.fire({
                        title: 'Info',
                        text: 'No data found on the searched date.',
                        icon: 'info',
                        confirmButtonText: 'Ok',
                    });
                    return []; // No data case
                } else {
                    return reportsData.reportsData;
                }
            } else {
                return []; // Handle case where reportsData is null or undefined
            }
        })
        .catch(error => {
            console.error("Veri alınamadı:", error);
            Swal.fire({
                title: 'Error',
                text: 'Data could not be retrieved. Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return []; // Error case
        });
  };  

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <img
          src={csvIcon}
          alt="CSV Icon"
          style={{ width: "40px", cursor: "pointer" }}
          onClick={() => exportToCsv(dateRange, reportName.replace(/\s+/g, ''))}
        />
      </Grid>
      <Grid item>
        <img
          src={pdfIcon}
          alt="PDF Icon"
          style={{ width: "40px", cursor: "pointer" }}
          onClick={() => exportToPdf(dateRange, reportName.replace(/\s+/g, ''))}
        />
      </Grid>
      <Grid item>
        <img
          src={xlsxIcon}
          alt="XLS Icon"
          style={{ width: "40px", cursor: "pointer" }}
          onClick={() => exportToXls(dateRange, reportName.replace(/\s+/g, ''))}
        />
      </Grid>
      <Grid item>
        <Link
          component="button"
          variant="body2"
          sx={{
            color: "#9C27B0",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => downloadAllFormats(dateRange, reportName.replace(/\s+/g, ''))}
        >
          {downloadName}
        </Link>
      </Grid>
    </Grid>
  );
};

AlarmReportButtons.propTypes = {
  dateRange: PropTypes.array.isRequired,
};

export default AlarmReportButtons;
