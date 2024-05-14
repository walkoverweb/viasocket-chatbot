import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./scss/global.scss";
import InterfaceEmbed from "./pages/interface/pages/InterfaceEmbed/InterfaceEmbed.tsx";

const Viewonlygrid = React.lazy(() =>
  import(
    /* webpackChunkName: "viewonlygrid" */ "./pages/interface/components/Grid/Viewonlygrid.tsx"
  )
);

// Interface Routes
const Interface = React.lazy(() =>
  import(/* webpackChunkName: "interface" */ "./pages/interface/interface.tsx")
);
const InterfaceSetupPage = React.lazy(() =>
  import(
    /* webpackChunkName: "interfacesetuppage" */ "./pages/interface/components/InterfaceConfiguration/interfaceConfigSetup.tsx"
  )
);

function App() {
  return (
    <div>
      {/* <ThemeProvider theme={theme?.generatedTheme}> */}
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
          path="/interfaceSetup"
          element={
            <React.Suspense fallback="Loading....">
              <InterfaceSetupPage />
            </React.Suspense>
          }
        />

        <Route
          exact
          path="/i/:interfaceId"
          element={
            <div id="parent-view-only-grid" className="h-100vh w-100">
              <React.Suspense fallback="Loading....">
                <Viewonlygrid />
              </React.Suspense>
            </div>
          }
        />

        <Route exact path="/i" element={<InterfaceEmbed />} />
      </Routes>
      {/* </ThemeProvider> */}
    </div>
  );
}
export default App;
