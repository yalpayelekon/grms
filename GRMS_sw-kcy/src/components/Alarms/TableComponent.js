import { useState } from "react";
import {Table, TableContainer, Container, TablePagination} from "@mui/material";
import TableHeader from "./TableHeader";
import TableRows from "./AlarmsTableRows";

const TableComponent = ({data}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("dsc");
  const [orderBy, setOrderBy] = useState("incidentTime");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <TableContainer
        sx={{
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableRows
            page={page}
            rowsPerPage={rowsPerPage}
            order={order}
            orderBy={orderBy}
            data={data}
          />
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: "white", fontSize: "1rem" }}
        />
      </TableContainer>
    </Container>
  );
};

export default TableComponent;
