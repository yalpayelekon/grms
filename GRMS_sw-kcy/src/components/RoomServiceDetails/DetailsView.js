import { useState } from "react";
import MURDetails from "./MURDetails";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export default function DetailsView({ selectedRowData }) {

    // console.log("DetailsView selectedRowData: ",selectedRowData)

    const [view, setView] = useState("mur");

    const getButtonStyle = (buttonType) => ({
        backgroundColor: view === buttonType ? "#49796B" : "#A8C5DA",
        color: "white",
        marginRight: "10px",
    });

    return (
        <Container maxWidth="xl">
        <div
            style={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "20px",
            }}
        >
            <Button
            variant="contained"
            style={getButtonStyle("mur")}
            onClick={() => setView("mur")}
            sx={{
                borderRadius: 4, // border radius ekledik
                marginLeft: "-20px",
                fontFamily: "Poppins",
                fontSize: "14px"
            }}
            >
            MUR Details
            </Button>
            {/* <Button
            variant="contained"
            style={getButtonStyle("laundry")}
            onClick={() => setView("laundry")}
            >
            Laundry Details
            </Button> */}
        </div>

        <div
            style={{
            display: "flex",
            justifyContent: "center",
            }}
        >
            <div
            style={{
                height: 600,
                width: "100%",
                background: "",
                borderRadius: "10px",
                fontFamily: "Poppins",
            }}
            >
            {view === "mur" && <MURDetails selectedRowData={selectedRowData}/>}
            {/* {view === "laundry" && <LaundryDetails />} */}
            </div>
        </div>
        </Container>
    );
}
