import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatbotWrapper from "./pages/interface/components/Chatbot-Wrapper/ChatbotWrapper.tsx";
import InterfaceEmbed from "./pages/interface/pages/InterfaceEmbed/InterfaceEmbed.tsx";
import "./scss/global.scss";

// Interface Routes
const Interface = React.lazy(() =>
  import(/* webpackChunkName: "interface" */ "./pages/interface/interface.tsx")
);

// Color Map

function App() {
  return (
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
  );
}

export default App;
