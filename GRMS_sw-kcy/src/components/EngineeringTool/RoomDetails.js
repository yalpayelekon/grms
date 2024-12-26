import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import RoomDetailsHeader from "./RoomDetailsHeader";
import RoomCoordinates from "./RoomCoordinates";
import RoomImageUpload from "./RoomImageUpload";

const RoomDetails = ({ uniqueRoomId, block, floor }) => {
  const [roomImageMap, setRoomImageMap] = useState({});
  const [coordinates, setCoordinates] = useState([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawMode, setDrawMode] = useState("point");
  const canvasRef = useRef(null);
  const [lineStart, setLineStart] = useState(null);

  useEffect(() => {
    if (roomImageMap[uniqueRoomId]) {
      setCoordinates(roomImageMap[uniqueRoomId].coordinates);
      setImgDimensions(roomImageMap[uniqueRoomId].imgDimensions);
      setCurrentPage(roomImageMap[uniqueRoomId].currentPage);
      setSelectedPointIndex(null);
    } else {
      setCoordinates([]);
      setImgDimensions({ width: 0, height: 0 });
      setCurrentPage(1);
      setSelectedPointIndex(null);
    }
  }, [uniqueRoomId, roomImageMap]);

  const handleImageUpload = (src) => {
    const updatedRoomImageMap = {
      ...roomImageMap,
      [uniqueRoomId]: {
        imageSrc: src,
        coordinates: [],
        imgDimensions: { width: 0, height: 0 },
        currentPage: 1,
      },
    };
    setRoomImageMap(updatedRoomImageMap);
  };

  const handleTxtUpload = (json) => {
    const newCoordinates = json.map((item) => {
      const { x1, y1, x2, y2, type, address } = item;
      return {
        x1: parseFloat(x1) || 0,  // Eğer x1 geçerli değilse varsayılan olarak 0 kullanılır
        y1: parseFloat(y1) || 0,
        x2: parseFloat(x2) || 0,
        y2: parseFloat(y2) || 0,
        type,
        address,
        color: "red",
      };
    });
    setCoordinates(newCoordinates);
  };

  const handleImageClick = (x, y) => {
    const roundedX = parseFloat(x.toFixed(2));
    const roundedY = parseFloat(y.toFixed(2));
    if (drawMode === "point") {
      setCoordinates((prevCoords) => [
        ...prevCoords,
        {
          x1: roundedX,
          y1: roundedY,
          x2: null,
          y2: null,
          type: "point",
          address: "",
          color: "red",
        },
      ]);
    } else if (drawMode === "line") {
      if (lineStart) {
        setCoordinates((prevCoords) => [
          ...prevCoords,
          {
            x1: lineStart.x,
            y1: lineStart.y,
            x2: roundedX,
            y2: roundedY,
            type: "line",
            address: "",
            color: "red",
          },
        ]);
        setLineStart(null);
      } else {
        setLineStart({ x: roundedX, y: roundedY });
      }
    }
  };

  const handleImageLoad = ({ width, height }) => {
    setImgDimensions({ width, height });
  };

  const handleCoordinateChange = (index, field, value) => {
    setCoordinates((prevCoords) => {
      const newCoords = [...prevCoords];
      newCoords[index][field] =
        field === "x1" || field === "y1" || field === "x2" || field === "y2"
          ? parseFloat(value)
          : value;
      return newCoords;
    });
  };

  const handleCoordinateDelete = (index) => {
    setCoordinates((prevCoords) => prevCoords.filter((_, i) => i !== index));
  };

  const handlePointSelect = (index) => {
    setSelectedPointIndex(index);
  };

  const handleSave = () => {
    if (
      !uniqueRoomId ||
      coordinates.some(
        (coord) =>
          !coord.x1 ||
          !coord.y1 ||
          (coord.type === "line" && (!coord.x2 || !coord.y2)) ||
          !coord.address ||
          isNaN(coord.address) ||
          coord.address === ""
      )
    ) {
      setError(
        "Please fill in all fields correctly. Address must be a non-empty numeric value."
      );
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = roomImageMap[uniqueRoomId].imageSrc;
    img.onload = () => {
      let { width, height } = img;

      // Max width ve height kontrolü
      const maxWidth = 1000;
      const maxHeight = 500;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = width * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      const odaNumarasi = uniqueRoomId.split('-')[2];
      link.download = `blok_${block}_kat_${floor}_oda_${odaNumarasi}.png`;
      link.href = dataUrl;
      link.click();

      const stringCoordinates = coordinates.map(coord => ({
        x1: coord.x1.toString(),
        y1: coord.y1.toString(),
        x2: coord.x2 ? coord.x2.toString() : "",
        y2: coord.y2 ? coord.y2.toString() : "",
        type: coord.type.toString(),
        address: coord.address.toString()
      }));
  
      const coordinatesJson = JSON.stringify(stringCoordinates, null, 2);

      const txtBlob = new Blob([coordinatesJson], { type: "text/plain" });
      const txtUrl = URL.createObjectURL(txtBlob);
      const txtLink = document.createElement("a");
      console.log(`blok_${block}_kat_${floor}_oda_${uniqueRoomId}.json`)
      txtLink.download = `blok_${block}_kat_${floor}_oda_${odaNumarasi}.json`;
      txtLink.href = txtUrl;
      txtLink.click();
      URL.revokeObjectURL(txtUrl);
    };

    const updatedRoomImageMap = {
      ...roomImageMap,
      [uniqueRoomId]: {
        ...roomImageMap[uniqueRoomId],
        coordinates,
        imgDimensions,
        currentPage,
      },
    };
    setRoomImageMap(updatedRoomImageMap);

    setError(null);
  };

  const itemsPerPage = 20;
  const totalPages = Math.ceil(coordinates.length / itemsPerPage);
  const currentCoordinates = coordinates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box
      sx={{
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        marginBottom: "10px",
      }}
    >
      <RoomDetailsHeader
        onImageUpload={handleImageUpload}
        onSave={handleSave}
        onTxtUpload={handleTxtUpload}
        onDrawModeChange={setDrawMode}
        drawMode={drawMode}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ width: "520px", padding: "10px", flexShrink: 0 }}>
          <RoomCoordinates
            coordinates={currentCoordinates}
            onCoordinateChange={handleCoordinateChange}
            onCoordinateDelete={handleCoordinateDelete}
            selectedPointIndex={selectedPointIndex}
            onRowClick={handlePointSelect}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                sx={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  margin: "0 5px",
                  backgroundColor:
                    currentPage === index + 1 ? "lightblue" : "white",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                {index + 1}
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            padding: "10px",
            width: imgDimensions.width,
            height: imgDimensions.height,
          }}
        >
          <RoomImageUpload
            imageSrc={roomImageMap[uniqueRoomId]?.imageSrc}
            coordinates={coordinates}
            onImageClick={handleImageClick}
            onImageLoad={handleImageLoad}
            onPointClick={handlePointSelect}
            selectedPointIndex={selectedPointIndex}
          />
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </Box>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

RoomDetails.propTypes = {
  uniqueRoomId: PropTypes.string.isRequired,
  block: PropTypes.string.isRequired,
  floor: PropTypes.string.isRequired,
};

export default RoomDetails;
