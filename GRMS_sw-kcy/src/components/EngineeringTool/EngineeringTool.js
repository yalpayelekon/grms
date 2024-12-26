import { useState } from "react";
import { Box } from "@mui/material";
import RoomDetails from "./RoomDetails";
import Sidebar from "./Sidebar";

const EngineeringTool = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  const handleRoomSelect = (block, floor, room) => {
    const uniqueRoomId = `${block}-${floor}-${room}`;
    setSelectedBlock(block);
    setSelectedFloor(floor);
    setSelectedRoom(uniqueRoomId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <Sidebar onRoomSelect={handleRoomSelect} />
      {selectedRoom && (
        <RoomDetails
          uniqueRoomId={selectedRoom}
          block={selectedBlock}
          floor={selectedFloor}
        />
      )}
    </Box>
  );
};

export default EngineeringTool;
