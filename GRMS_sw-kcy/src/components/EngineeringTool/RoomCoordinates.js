import PropTypes from "prop-types";
import { Box, Typography, TextField, Button } from "@mui/material";

const RoomCoordinates = ({
  coordinates,
  onCoordinateChange,
  onCoordinateDelete,
  selectedPointIndex,
  onRowClick,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr) 1.5fr 2fr 80px", 
          padding: "5px",
          backgroundColor: "#f5f5f5",
          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
          gap: "10px", 
        }}
      >
        <Typography sx={{ borderRight: "1px solid #ccc" }}>X1</Typography>
        <Typography sx={{ borderRight: "1px solid #ccc" }}>Y1</Typography>
        <Typography sx={{ borderRight: "1px solid #ccc" }}>X2</Typography>
        <Typography sx={{ borderRight: "1px solid #ccc" }}>Y2</Typography>
        <Typography sx={{ borderRight: "1px solid #ccc" }}>Type</Typography>
        <Typography sx={{ borderRight: "1px solid #ccc" }}>Address</Typography>
        <Typography></Typography>
      </Box>
      {coordinates.map((coord, index) => (
        <Box
          key={index}
          onClick={() => onRowClick(index)}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr) 1.5fr 2fr 80px", 
            padding: "5px",
            backgroundColor:
              selectedPointIndex === index ? "lightblue" : "transparent",
            cursor: "pointer",
            alignItems: "center", 
            gap: "10px", 
          }}
        >
          <TextField
            value={coord.x1 !== null ? coord.x1 : ""}
            onChange={(e) => onCoordinateChange(index, "x1", e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
            InputProps={{ style: { fontSize: 12, textAlign: "center" } }}
          />
          <TextField
            value={coord.y1 !== null ? coord.y1 : ""}
            onChange={(e) => onCoordinateChange(index, "y1", e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
            InputProps={{ style: { fontSize: 12, textAlign: "center" } }}
          />
          <TextField
            value={coord.x2 !== null ? coord.x2 : ""}
            onChange={(e) => onCoordinateChange(index, "x2", e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
            InputProps={{ style: { fontSize: 12, textAlign: "center" } }}
          />
          <TextField
            value={coord.y2 !== null ? coord.y2 : ""}
            onChange={(e) => onCoordinateChange(index, "y2", e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
            InputProps={{ style: { fontSize: 12, textAlign: "center" } }}
          />
          <TextField
            value={coord.type !== null ? coord.type : ""}
            onChange={(e) => onCoordinateChange(index, "type", e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: "100%" }}
            InputProps={{ style: { fontSize: 12, textAlign: "center" } }}
          />
          <TextField
            value={coord.address !== null ? coord.address : ""}
            onChange={(e) =>
              onCoordinateChange(index, "address", e.target.value)
            }
            variant="outlined"
            size="small"
            sx={{ width: "100%", marginLeft: "3px" }}
            InputProps={{ style: { fontSize: 12, textAlign: "center" } }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onCoordinateDelete(index);
            }}
            sx={{ width: "100%", marginLeft: "3px" }}
          >
            Delete
          </Button>
        </Box>
      ))}
    </Box>
  );
};

RoomCoordinates.propTypes = {
  coordinates: PropTypes.arrayOf(
    PropTypes.shape({
      x1: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      x2: PropTypes.number,
      y2: PropTypes.number,
      type: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCoordinateChange: PropTypes.func.isRequired,
  onCoordinateDelete: PropTypes.func.isRequired,
  selectedPointIndex: PropTypes.number,
  onRowClick: PropTypes.func.isRequired,
};

export default RoomCoordinates;
