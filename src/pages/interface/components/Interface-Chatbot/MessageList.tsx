import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, IconButton } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import "./InterfaceChatbot.scss";
import Message from "./Message.tsx";
import { MessageContext } from "./InterfaceChatbot.tsx";

function MessageList() {
  const containerRef = useRef<any>(null);
  const MessagesList: any = useContext(MessageContext);
  const { messages } = MessagesList;

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
        {messages?.map((message, index) => (
          <Message key={index} message={message} />
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
