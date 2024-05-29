import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, IconButton } from "@mui/material";
import React from "react";
import "./InterfaceChatbot.scss";
import Message from "./Message.tsx";

function MessageList({
  messages,
  isJSONString,
  dragRef,
  movetoDown,
  containerRef,
}) {
  return (
    <Box
      // elevation={1}
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
    </Box>
  );
}

export default MessageList;
