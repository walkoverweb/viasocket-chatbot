import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { EmbedVerificationStatus } from "../../../../enums";
import InterfaceErrorPage from "../../components/InterfaceErrorPage/InterfaceErrorPage.tsx";
import { intefaceSetLocalStorage } from "../../utils/InterfaceUtils.ts";

interface InterfaceEmbedProps {
  onThemeChange: (string) => void;
}
export default function InterfaceEmbed({ onThemeChange }: InterfaceEmbedProps) {
  console.log("interfaceembed");
  const { search } = useLocation();
  const navigate = useNavigate();
  const { chatbot_id, userId, token, config } = JSON.parse(
    new URLSearchParams(search).get("interfaceDetails") || "{}"
  );
  useEffect(() => {
    if (config?.themeColor) {
      onThemeChange(config.themeColor || "#000000"); // Update the theme color when the component mounts
    }
  }, [config?.themeColor]);

  const [verifiedState, setVerifiedState] = useState(
    EmbedVerificationStatus.VERIFYING
  );
  const [details, setDetails] = useState({ chatbot_id: "" });

  useEffect(() => {
    if (token) authorizeUserAndSetDetails();
  }, [token]);

  useEffect(() => {
    if (verifiedState === EmbedVerificationStatus.VERIFIED) {
      navigate(`/i/${details.chatbot_id}`);
    }
  }, [verifiedState, details.chatbot_id, navigate]);

  const authorizeUserAndSetDetails = () => {
    intefaceSetLocalStorage("interfaceToken", token);
    setVerifiedState(EmbedVerificationStatus.VERIFIED);
    setDetails({ chatbot_id });
    localStorage.setItem("interfaceUserId", userId);
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
