import { keyframes } from "@emotion/react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InterfaceGrid from "../Grid/Grid.tsx";
import "./Message.scss";

function Message({ message, isJSONString, dragRef }) {
  const theme = useTheme();

  // Function to determine text color based on background luminance
  const getTextColor = (backgroundColor) => {
    const rgb = backgroundColor.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    );
    const c = parseInt(rgb.substring(1), 16);
    const r = (c >> 16) & 255;
    const g = (c >> 8) & 255;
    const b = c & 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5
      ? theme.palette.text.primary
      : theme.palette.common.white;
  };

  // Keyframe animation for message
  const slideIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  return (
    <Box className={`message ${message?.role} w-100 `}>
      <Stack
        sx={{
          gap: "10px",
          maxWidth: "100%",
          marginBottom: "15px",
          animation: `${slideIn} 0.3s ease`,
        }}
        direction={message?.role === "user" ? "row-reverse" : "row"}
      >
        {message?.role !== "user" && (
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: message?.role !== "user" && "center",
              width: "30px",
            }}
            spacing="5px"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bot"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </Stack>
        )}
        <Box
          sx={{
            backgroundColor:
              message?.role === "user"
                ? theme.palette.primary.main
                : theme.palette.background.paper,
            color: getTextColor(
              message?.role === "user"
                ? theme.palette.primary.main
                : theme.palette.background.paper
            ),
            padding: "10px",
            boxSizing: "border-box",
            borderRadius:
              message?.role === "user"
                ? "10px 10px 1px 10px"
                : "10px 10px 10px 1px",
            width: "fit-content",
          }}
        >
          {message?.wait ? (
            <Box className="flex-start-center gap-2 p-1">
              <div className="loader" />
              <Typography variant="body">{message?.content}</Typography>
            </Box>
          ) : message?.timeOut ? (
            <Box className="flex-start-center gap-5 p-1">
              <Typography variant="body">
                Timeout reached. Please try again later.
              </Typography>
            </Box>
          ) : (
            <Box className="flex-start-center">
              {isJSONString(message?.content || "{}")?.responseId ? (
                <InterfaceGrid
                  style={{ height: "100%" }}
                  dragRef={dragRef}
                  inpreview={false}
                  ingrid={false}
                  gridId={
                    JSON.parse(message?.content || "{}")?.responseId ||
                    "default"
                  }
                  loadInterface={false}
                  componentJson={JSON.parse(message?.content || "{}")}
                  msgId={message?.createdAt}
                />
              ) : (
                <Typography variant="body">
                  {message?.content}
                  {message?.role !== "user" && (
                    <ReportProblemIcon
                      fontSize="small"
                      color="error"
                      className="ml-2"
                    />
                  )}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default Message;
