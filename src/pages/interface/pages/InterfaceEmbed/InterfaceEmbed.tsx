import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { EmbedVerificationStatus } from "../../../../enums";
import InterfaceErrorPage from "../../components/InterfaceErrorPage/InterfaceErrorPage.tsx";
import { intefaceSetLocalStorage } from "../../utils/InterfaceUtils.ts";

export default function InterfaceEmbed() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const { interface_id, project_id, userId, token } = JSON.parse(
    queryParams.get("interfaceDetails") || "{}"
  );
  const [verifiedState, setVerifiedState] = useState(
    EmbedVerificationStatus.VERIFYING
  );
  const [details, setDetails] = useState({ project_id: "", interface_id: "" });

  useEffect(() => {
    console.log(token, 12345, "token");
    if (token) authorizeUserAndSetDetails();
  }, [token]);

  const fetchScriptsAndNavigateEmbedUser = () => {
    try {
      navigate(`/i/${details.interface_id}`);
    } catch (e) {
      console.log(e, "error");
    }
  };

  useEffect(() => {
    if (verifiedState === EmbedVerificationStatus.VERIFIED) {
      fetchScriptsAndNavigateEmbedUser();
    }
  }, [verifiedState]);

  // HANDLER-FUNCTIONS.
  const authorizeUserAndSetDetails = () => {
    intefaceSetLocalStorage("interfaceToken", token);
    setVerifiedState(EmbedVerificationStatus.VERIFIED);
    setDetails({
      interface_id,
      project_id,
    });
    localStorage.setItem("interfaceUserId", userId);
    return null;
  };

  return (
    <Box className="flex-col-center-center w-100vw h-100vh">
      {verifiedState === EmbedVerificationStatus.VERIFYING && (
        <CircularProgress />
      )}
      {verifiedState === EmbedVerificationStatus.NOT_VERIFIED && (
        <InterfaceErrorPage />
      )}
    </Box>
  );
}
