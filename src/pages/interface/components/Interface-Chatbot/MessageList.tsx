import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, IconButton, Paper } from "@mui/material";
import React from "react";
import Message from "./Message.tsx";
import "./InterfaceChatbot.scss";

function MessageList({
  messages,
  isJSONString,
  dragRef,
  movetoDown,
  containerRef,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
      ref={containerRef}
    >
      <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            isJSONString={isJSONString}
            dragRef={dragRef}
          />
        ))}
      </Box>
      {messages?.length > 10 && (
        <IconButton
          onClick={movetoDown}
          className="move-to-down-button"
          sx={{ backgroundColor: "#1976d2" }}
          disableRipple
        >
          <KeyboardDoubleArrowDownIcon
            color="inherit"
            className="color-white"
          />
        </IconButton>
      )}
    </Paper>
  );
}

export default MessageList;
