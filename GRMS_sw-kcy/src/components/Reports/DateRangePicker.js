import { Grid } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";

const DateRangePicker = ({ dateRange, handleDateChange, placeholder }) => {
  return (
    <Grid item xs={8}>
      <DatePicker
        selectsRange
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        className="form-control"
        placeholderText={placeholder}
        isClearable={false}
        style={{ width: "100%" }} // Genişliği 100 piksel olarak ayarla
      />
    </Grid>
  );
};

DateRangePicker.propTypes = {
  dateRange: PropTypes.array.isRequired,
  handleDateChange: PropTypes.func.isRequired,
};

export default DateRangePicker;