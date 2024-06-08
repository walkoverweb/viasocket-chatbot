import { MenuItem, Select } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatbotWrapper from "./pages/interface/components/Chatbot-Wrapper/ChatbotWrapper.tsx";
import InterfaceEmbed from "./pages/interface/pages/InterfaceEmbed/InterfaceEmbed.tsx";
import "./scss/global.scss";
import generateTheme from "./theme"; // Import the theme generation function

// Interface Routes
const Interface = React.lazy(() =>
  import(/* webpackChunkName: "interface" */ "./pages/interface/interface.tsx")
);

// Color Map
const colorMap = {
  red: "#f44336",
  pink: "#e91e63",
  purple: "#9c27b0",
  deepPurple: "#673ab7",
  indigo: "#3f51b5",
  blue: "#2196f3",
  lightBlue: "#03a9f4",
  cyan: "#00bcd4",
  teal: "#009688",
  green: "#4caf50",
  lightGreen: "#8bc34a",
  lime: "#cddc39",
  yellow: "#ffeb3b",
  amber: "#ffc107",
  orange: "#ff9800",
  deepOrange: "#ff5722",
  brown: "#795548",
  grey: "#9e9e9e",
  blueGrey: "#607d8b",
  black: "#000000",
};

function App() {
  const [color, setColor] = useState("blue");
  const [theme, setTheme] = useState(generateTheme(color));
  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    setColor(selectedColor);
    setTheme(generateTheme(selectedColor));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ marginTop: "20px" }}>
        <Select
          value={color}
          onChange={handleColorChange}
          variant="outlined"
          label="Color Name"
        >
          {Object.keys(colorMap).map((colorName) => (
            <MenuItem key={colorName} value={colorName}>
              {colorName}
            </MenuItem>
          ))}
        </Select>
      </Container>
      <Routes>
        <Route
          exact
          path="/interface"
          element={
            <React.Suspense fallback="Loading....">
              <Interface />
            </React.Suspense>
          }
        />
        <Route
          exact
          path="/i/:interfaceId"
          element={
            <div id="parent-view-only-grid" className="h-100vh w-100">
              <React.Suspense fallback="Loading....">
                <ChatbotWrapper />
              </React.Suspense>
            </div>
          }
        />
        <Route exact path="/i" element={<InterfaceEmbed />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
