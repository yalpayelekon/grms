import { Button } from "@mui/material";

const renderHeader = (headerName) => (
  <span style={{ color: "black", fontWeight: "bold" }}>{headerName}</span>
);

const renderStatusButton = (params) => {
  const { value } = params;
  let backgroundColor = "";
  let textColor = "white";
  let borderColor = "transparent";

  switch (value) {
    case "Active":
    case "Delay":
      backgroundColor = "#E72636";
      break;
    case "Cleaning":
      backgroundColor = "#A8C5DA";
      break;
    case "Cleaned":
      backgroundColor = "#49796B";
      break;
    case "n/a":
      textColor = "black";
      borderColor = "black";
      break;
    default:
      backgroundColor = "default";
      textColor = "black";
  }

  return (
    <Button
      style={{
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      {value}
    </Button>
  );
};

const renderCellWithColor = (params) => (
  <span style={{ color: "#49796B"  }}>{params.value}</span>
);

const renderDurationCell = (params) => {
  const { row } = params;
  const color = row.status === "Delay" ? "#E72636" : "#49796B";
  return <span style={{ color }}>{params.value}</span>;
};

const RoomServiceDetailColumns = () => [
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    renderHeader: (params) => renderHeader(params.colDef.headerName),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderHeader: (params) => renderHeader(params.colDef.headerName),
    renderCell: renderStatusButton,
  },
  {
    field: "requestTime",
    headerName: "Request Time",
    flex: 1,
    renderHeader: (params) => renderHeader(params.colDef.headerName),
    renderCell: renderCellWithColor,
  },
  {
    field: "operationStart",
    headerName: "Operation Start",
    flex: 1,
    renderHeader: (params) => renderHeader(params.colDef.headerName),
    renderCell: renderCellWithColor,
  },
  {
    field: "operationEnd",
    headerName: "Operation End",
    flex: 1,
    renderHeader: (params) => renderHeader(params.colDef.headerName),
    renderCell: renderCellWithColor,
  },
  {
    field: "duration",
    headerName: "Duration",
    flex: 1,
    renderHeader: (params) => renderHeader(params.colDef.headerName),
    renderCell: renderDurationCell,
  },
  {
    field: "employee",
    headerName: "Employee",
    flex: 1,
    renderHeader: (params) => renderHeader(params.colDef.headerName),
  },
];

export default RoomServiceDetailColumns;
