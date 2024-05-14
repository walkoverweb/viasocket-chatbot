import React from "react";
import { Box } from "@mui/material";
import "./InterfaceSetup.scss";
import { InterfaceConfigStepOne } from "./InterfaceConfigSteps.tsx";

export default function InterfaceSetupPage() {
  return (
    <Box className="setup_container h-100vh overflow-scroll-y bg-white boxAnimation p-3">
      <InterfaceConfigStepOne />
      {/* <SetDisplayConfig />
      <InterfaceConfigStepTwo /> */}
    </Box>
  );
}