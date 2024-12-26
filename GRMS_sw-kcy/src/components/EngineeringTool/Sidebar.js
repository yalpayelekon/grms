import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from "@mui/material";

import { categoryNamesBlokKatMap } from "../../jsonFiles/engineeringToolData";

const Sidebar = ({ onRoomSelect }) => {
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    const initialBlock = Object.keys(categoryNamesBlokKatMap)[0];
    const initialFloor = Object.keys(categoryNamesBlokKatMap[initialBlock])[0];
    const initialRoom = categoryNamesBlokKatMap[initialBlock][initialFloor][0];
    const initialUniqueRoomId = `${initialBlock}-${initialFloor}-${initialRoom}`;
    setSelectedBlock(initialBlock);
    setSelectedFloor(initialFloor);
    setSelectedRoom(initialUniqueRoomId);
    onRoomSelect(initialBlock, initialFloor, initialRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlockChange = (event) => {
    const newBlock = event.target.value;
    const newFloor = Object.keys(categoryNamesBlokKatMap[newBlock])[0];
    const newRoom = categoryNamesBlokKatMap[newBlock][newFloor][0];
    const newUniqueRoomId = `${newBlock}-${newFloor}-${newRoom}`;
    setSelectedBlock(newBlock);
    setSelectedFloor(newFloor);
    setSelectedRoom(newUniqueRoomId);
    onRoomSelect(newBlock, newFloor, newRoom);
  };

  const handleFloorChange = (event) => {
    const newFloor = event.target.value;
    const newRoom = categoryNamesBlokKatMap[selectedBlock][newFloor][0];
    const newUniqueRoomId = `${selectedBlock}-${newFloor}-${newRoom}`;
    setSelectedFloor(newFloor);
    setSelectedRoom(newUniqueRoomId);
    onRoomSelect(selectedBlock, newFloor, newRoom);
  };

  const handleRoomClick = (room) => {
    const uniqueRoomId = `${selectedBlock}-${selectedFloor}-${room}`;
    setSelectedRoom(uniqueRoomId);
    onRoomSelect(selectedBlock, selectedFloor, room);
  };

  const blocks = Object.keys(categoryNamesBlokKatMap);
  const floors = selectedBlock
    ? Object.keys(categoryNamesBlokKatMap[selectedBlock])
    : [];
  const rooms =
    selectedBlock && selectedFloor
      ? categoryNamesBlokKatMap[selectedBlock][selectedFloor]
      : [];

  return (
    <Box
      sx={{
        width: "300px",
        padding: "10px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <FormControl fullWidth sx={{ width: "150%" }}>
          <InputLabel id="block-select-label">Blok</InputLabel>
          <Select
            labelId="block-select-label"
            id="block-select"
            value={selectedBlock}
            onChange={handleBlockChange}
          >
            {blocks.map((block) => (
              <MenuItem key={block} value={block}>
                {block}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={!selectedBlock}>
          <InputLabel id="floor-select-label">Kat</InputLabel>
          <Select
            labelId="floor-select-label"
            id="floor-select"
            value={selectedFloor}
            onChange={handleFloorChange}
          >
            {floors.map((floor) => (
              <MenuItem key={floor} value={floor}>
                {floor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {rooms.length > 0 && (
        <Box>
          <strong>Odalar:</strong>
          <List>
            {rooms.map((room) => (
              <ListItem
                key={room}
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  backgroundColor:
                    selectedRoom === `${selectedBlock}-${selectedFloor}-${room}`
                      ? "lightblue"
                      : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleRoomClick(room)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={
                      selectedRoom ===
                      `${selectedBlock}-${selectedFloor}-${room}`
                    }
                  />
                </ListItemIcon>
                <ListItemText primary={room} sx={{ cursor: "pointer" }} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

Sidebar.propTypes = {
  onRoomSelect: PropTypes.func.isRequired,
};

export default Sidebar;
