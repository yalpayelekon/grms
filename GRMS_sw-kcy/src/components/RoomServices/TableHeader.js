import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import PropTypes from "prop-types";
import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const TableHeader = ({ order, orderBy, onRequestSort }) => {

  // admin
  const adminRoomServicesTableHeaderFontFamily = UISettingsData.adminRoomServicesTableHeaderFontFamily; // 'Ariel'
  const adminRoomServicesTableHeaderFontSize = UISettingsData.adminRoomServicesTableHeaderFontSize; // "33px"
  const adminRoomServicesTableHeaderFontColor = UISettingsData.adminRoomServicesTableHeaderFontColor; // "#00a0a0"
  const adminRoomServicesTableHeaderRoomIdText = UISettingsData.adminRoomServicesTableHeaderRoomIdText; // "room no"
  const adminRoomServicesTableHeaderDelayCategoryText = UISettingsData.adminRoomServicesTableHeaderDelayCategoryText; // "gecikme kate"
  const adminRoomServicesTableHeaderActivationText = UISettingsData.adminRoomServicesTableHeaderActivationText; // "aktivasyno"
  const adminRoomServicesTableHeaderAcknowledgementText = UISettingsData.adminRoomServicesTableHeaderAcknowledgementText; // "bildirm"
  const adminRoomServicesTableHeaderAckTimeText = UISettingsData.adminRoomServicesTableHeaderAckTimeText; // "bildim time"
  const adminRoomServicesTableHeaderStatusText = UISettingsData.adminRoomServicesTableHeaderStatusText; // "durum"
  const adminRoomServicesTableHeaderMoreDetailsText = UISettingsData.adminRoomServicesTableHeaderMoreDetailsText; // "room deta"

  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  const headCells = [
    { id: "roomId", label: adminRoomServicesTableHeaderRoomIdText, sortable: true },
    { id: "delayCategory", label: adminRoomServicesTableHeaderDelayCategoryText, sortable: false },
    { id: "activation", label: adminRoomServicesTableHeaderActivationText, sortable: true },
    { id: "acknowledgement", label: adminRoomServicesTableHeaderAcknowledgementText, sortable: true },
    { id: "ackTime", label: adminRoomServicesTableHeaderAckTimeText, sortable: true },
    { id: "status", label: adminRoomServicesTableHeaderStatusText, sortable: true },
    { id: "moreDetails", label: adminRoomServicesTableHeaderMoreDetailsText, sortable: false },
  ];

  const cellStyle = {
    color: adminRoomServicesTableHeaderFontColor,
    fontFamily: adminRoomServicesTableHeaderFontFamily,
    fontSize: adminRoomServicesTableHeaderFontSize,
    "&:hover": {
      color: "lightgray",
    },
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{...cellStyle, textAlign: 'center'}}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                sx={{
                  color: adminRoomServicesTableHeaderFontColor,
                  fontSize: adminRoomServicesTableHeaderFontSize,
                  "& .MuiTableSortLabel-icon": {
                    color: orderBy === headCell.id ? adminRoomServicesTableHeaderFontColor: adminRoomServicesTableHeaderFontColor,
                  },
                  "&.Mui-active": {
                    color: adminRoomServicesTableHeaderFontColor,
                  },
                }}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

TableHeader.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

export default TableHeader;