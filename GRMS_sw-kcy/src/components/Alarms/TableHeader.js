import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import PropTypes from "prop-types";

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const TableHeader = ({ order, orderBy, onRequestSort }) => {

    // admin
    const adminAlarmTableHeaderFontFamily = UISettingsData.adminAlarmTableHeaderFontFamily; // "Ariel"
    const adminAlarmTableHeaderFontSize = UISettingsData.adminAlarmTableHeaderFontSize; // "33px"
    const adminAlarmTableHeaderFontColor = UISettingsData.adminAlarmTableHeaderFontColor; // "#00a0a0"
    const adminAlarmTableHeaderMalfunctionText = UISettingsData.adminAlarmTableHeaderMalfunctionText; // "arızalar"
    const adminAlarmTableHeaderIncidentTimeText = UISettingsData.adminAlarmTableHeaderIncidentTimeText; // "olay zmanaı"
    const adminAlarmTableHeaderCategoryText = UISettingsData.adminAlarmTableHeaderCategoryText; // "kategor"
    const adminAlarmTableHeaderAcknowledgementText = UISettingsData.adminAlarmTableHeaderAcknowledgementText; // "bildirm"
    const adminAlarmTableHeaderAckTimeText = UISettingsData.adminAlarmTableHeaderAckTimeText; // "bildim time"
    const adminAlarmTableHeaderStatusText = UISettingsData.adminAlarmTableHeaderStatusText; // "durum"
    const adminAlarmTableHeaderMoreDetailsText = UISettingsData.adminAlarmTableHeaderMoreDetailsText; // "detays"


    const createSortHandler = (property) => () => {
        onRequestSort(property);
    };

    const headCells = [
        { id: "malfunction", label: adminAlarmTableHeaderMalfunctionText, sortable: true },
        { id: "incidentTime", label: adminAlarmTableHeaderIncidentTimeText, sortable: true },
        { id: "category", label: adminAlarmTableHeaderCategoryText, sortable: true },
        { id: "acknowledgement", label: adminAlarmTableHeaderAcknowledgementText, sortable: true },
        { id: "ackTime", label: adminAlarmTableHeaderAckTimeText, sortable: true },
        { id: "status", label: adminAlarmTableHeaderStatusText, sortable: true },
        { id: "moreDetails", label: adminAlarmTableHeaderMoreDetailsText, sortable: false },
    ];

    const cellStyle = {
        color: adminAlarmTableHeaderFontColor,
        fontFamily: adminAlarmTableHeaderFontFamily,
        fontSize: adminAlarmTableHeaderFontSize,
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
                        sx={cellStyle}
                    >
                        {headCell.sortable ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : "asc"}
                                onClick={createSortHandler(headCell.id)}
                                sx={{
                                    color: adminAlarmTableHeaderFontColor,
                                    fontSize: adminAlarmTableHeaderFontSize,
                                    "& .MuiTableSortLabel-icon": {
                                        color: orderBy === headCell.id ? adminAlarmTableHeaderFontColor : adminAlarmTableHeaderFontColor,
                                    },
                                    "&.Mui-active": {
                                        color: adminAlarmTableHeaderFontColor,
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