import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import Message from "./Message.tsx";

function MessageList({ messages, isJSONString, dragRef, containerRef }) {
  const movetoDown = () => {
    containerRef.current?.scrollTo({
      top: containerRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    movetoDown();
  }, [messages, movetoDown]);

  return (
    <Box
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
          sx={{
            backgroundColor: "background.default",
            color: "text.primary",
            position: "fixed",
            bottom: 16,
            right: 16,
            "&:hover": {
              backgroundColor: "background.paper",
            },
          }}
          disableRipple
        >
          <KeyboardDoubleArrowDownIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default MessageList;
