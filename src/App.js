import React, { useCallback, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./scss/global.scss";
import ChatbotWrapper from "./pages/interface/components/Chatbot-Wrapper/ChatbotWrapper.tsx";
import InterfaceEmbed from "./pages/interface/pages/InterfaceEmbed/InterfaceEmbed.tsx";
import generateTheme from "./hoc/theme";

// Interface Routes
const Interface = React.lazy(() =>
  import(/* webpackChunkName: "interface" */ "./pages/interface/interface.tsx")
);

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
                <ChatbotWrapper onThemeChange={handleThemeChange} />
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
