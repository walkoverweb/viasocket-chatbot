import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import generateTheme from "./hoc/theme";
import ChatbotWrapper from "./pages/interface/components/Chatbot-Wrapper/ChatbotWrapper.tsx";
import InterfaceEmbed from "./pages/interface/pages/InterfaceEmbed/InterfaceEmbed.tsx";
import "./scss/global.scss";
import ChatbotPreview from "./pages/interface/components/Chatbot-Preview/ChatbotPreview.tsx";

function App() {
  const [themeColor, setThemeColor] = useState("#000000"); // Default color
  const theme = generateTheme(themeColor);

  const handleThemeChange = useCallback((newColor) => {
    setThemeColor(newColor);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route
          exact
          path="/i/:interfaceId"
          element={
            <div id="parent-view-only-grid" className="h-100vh w-100">
              <ChatbotWrapper />
            </div>
          }
        />
        <Route
          exact
          path="/i"
          element={<InterfaceEmbed onThemeChange={handleThemeChange} />}
        />
        <Route
          exact
          path="/chatbotpreview"
          element={<ChatbotPreview onThemeChange={handleThemeChange} />}
        />
      </Routes>
    </ThemeProvider>
  );
}
export default App;
