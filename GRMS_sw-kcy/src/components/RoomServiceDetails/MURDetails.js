import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import columns from "./RoomServiceDetailColumns";

export default function MURDetails( {selectedRowData}) {

    // console.log("MURDetails selectedRowData: ",selectedRowData)
    const [rows, setRows] = useState(selectedRowData);
    // console.log("MURDetails rows: ",rows)
    return (
        <div style={{ height: 600, width: "100%" }}>
        <DataGrid
            rows={rows}
            columns={columns()}
            initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 10 },
            },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
            "& .MuiDataGrid-columnHeader": {
                backgroundColor: "",
                fontFamily: "Poppins",
                fontSize: "18px",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
                        display: 'flex',
                        justifyContent: 'center', // Center align header text
                    },
            "& .MuiDataGrid-columnHeaderTitle": {
                color: "black",
                fontFamily: "Poppins",
                fontSize: "18px"
            },
            "& .MuiDataGrid-cell": {
                color: "black",
                fontFamily: "Poppins",
                fontSize: "16px",
                display: 'flex',
                justifyContent: 'center', // Center align cell text horizontally
                alignItems: 'center', // Center align cell text vertically
            },
            "& .MuiTablePagination-root": {
                color: "black",
                fontFamily: "Poppins",
                fontSize: "16px"
            },
            "& .MuiDataGrid-iconButtonContainer": {
                color: "black",
            },
            "& .MuiDataGrid-menuIconButton": {
                color: "black",
            },
            "& .MuiDataGrid-sortIcon": {
                color: "black",
            },
            }}
        />
        </div>
    );
}
