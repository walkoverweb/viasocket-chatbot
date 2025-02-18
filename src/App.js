import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { createContext, useCallback, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import generateTheme from "./hoc/theme";
import ChatbotPreview from "./pages/interface/components/Chatbot-Preview/ChatbotPreview.tsx";
import ChatbotWrapper from "./pages/interface/components/Chatbot-Wrapper/ChatbotWrapper.tsx";
import InterfaceEmbed from "./pages/interface/pages/InterfaceEmbed/InterfaceEmbed.tsx";
import "./scss/global.scss";
import RagCompoonent from "./pages/rag/ragCompoonent.tsx";

export const ChatbotContext = createContext({});

function App() {
  const [themeColor, setThemeColor] = useState("#000000"); // Default color
  const [chatbotConfig, setChatbotConfig] = useState({});
  const theme = generateTheme(themeColor);

  const onConfigChange = useCallback((config) => {
    setThemeColor(config.themeColor || "#000000");
    setChatbotConfig(config);
  }, []);

  const handleThemeChange = useCallback((color) => {
    setThemeColor(color);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route
          exact
          path="/i/:interfaceId"
          element={
            <ChatbotContext.Provider
              value={useMemo(
                () => ({ chatbotConfig, themeColor }),
                [chatbotConfig, themeColor]
              )}
            >
              <div id="parent-view-only-grid" className="h-100vh w-100">
                <ChatbotWrapper />
              </div>
            </ChatbotContext.Provider>
          }
        />
        <Route
          exact
          path="/i"
          element={<InterfaceEmbed onConfigChange={onConfigChange} />}
        />
        <Route
          exact
          path="/chatbotpreview"
          element={<ChatbotPreview onThemeChange={handleThemeChange} />}
        />
        <Route exact path="/rag" element={<RagCompoonent />} />
      </Routes>
    </ThemeProvider>
  );
}
export default App;
