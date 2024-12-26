import PropTypes from "prop-types";
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { green } from "@mui/material/colors";

const RoomDetailsHeader = ({
  onImageUpload,
  onSave,
  onTxtUpload,
  onDrawModeChange,
  drawMode,
}) => {
  const [inputKey, setInputKey] = useState(Date.now());

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result);
        setInputKey(Date.now());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          onTxtUpload(json);
        } catch (err) {
          console.error('Invalid JSON format', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrawModeChange = (event) => {
    onDrawModeChange(event.target.checked ? "line" : "point");
  };

  return (
    <Box
      sx={{
        width: "98%",
        padding: "10px",
        border: "1px solid #ccc",
        marginBottom: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "flex-start",
            flexGrow: 1,
          }}
        >
          <Button
            variant="contained"
            component="label"
            sx={{ flexShrink: 0, width: "250px", height: "50px" }}
          >
            Oda Planı Yükle
            <input
              key={inputKey}
              type="file"
              hidden
              accept=".png"
              onChange={handleImageUpload}
            />
          </Button>
          <Button
            variant="contained"
            component="label"
            sx={{ flexShrink: 0, width: "250px", height: "50px" }}
          >
            Cihaz Yerleşimi Yükle
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleJsonUpload}
            />
          </Button>
          <FormControl sx={{ flexShrink: 0, width: "250px", height: "50px" }}>
            <InputLabel id="copy-room-plan-label">Copy Room Plan</InputLabel>
            <Select
              labelId="copy-room-plan-label"
              id="copy-room-plan"
              value=""
              onChange={() => {}}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {/* Dropdown seçenekleri buraya eklenebilir */}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={drawMode === "line"}
                onChange={handleDrawModeChange}
              />
            }
            label="Çizgi Çiz"
          />
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: green[500],
            color: "white",
            flexShrink: 0,
            width: "100px",
            height: "50px",
            marginRight: "30px",
            "&:hover": { backgroundColor: green[700] },
          }}
          onClick={onSave}
        >
          Kaydet
        </Button>
      </Box>
    </Box>
  );
};

RoomDetailsHeader.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onTxtUpload: PropTypes.func.isRequired,
  onDrawModeChange: PropTypes.func.isRequired,
  drawMode: PropTypes.string.isRequired,
};

export default RoomDetailsHeader;
