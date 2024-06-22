import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import "./InterfaceChatbot.scss";
import Message from "./Message.tsx";

function MessageList({ messages, isJSONString, dragRef, containerRef }) {
  // const isLightBackground = isColorLight(theme.palette.primary.main);

  const movetoDown = () => {
    containerRef.current?.scrollTo({
      top: containerRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    movetoDown();
  }, [messages]);

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: 2,
        // backgroundColor: theme.palette.primary.main,
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
          sx={{ backgroundColor: "#333", color: "white" }}
          disableRipple
        >
          <KeyboardDoubleArrowDownIcon color="inherit" />
        </IconButton>
      )}
    </Box>
  );
}

export default MessageList;
