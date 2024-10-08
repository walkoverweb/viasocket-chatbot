import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, IconButton } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./InterfaceChatbot.scss";
import Message from "./Message.tsx";
import { MessageContext } from "./InterfaceChatbot.tsx";
import { sendFeedbackAction } from "../../../../api/InterfaceApis/InterfaceApis.ts";

function MessageList() {
  const containerRef = useRef<any>(null);
  const MessagesList: any = useContext(MessageContext);
  const { messages, setMessages } = MessagesList;
  const [showScrollButton, setShowScrollButton] = useState(false); // State to control the visibility of the button
  const [shouldScroll, setShouldScroll] = useState(true);

  const handleFeedback = async (
    messageId: string,
    feedbackStatus: number,
    currentStatus: number
  ) => {
    if (messageId && feedbackStatus && currentStatus !== feedbackStatus) {
      setShouldScroll(false);
      const response: any = await sendFeedbackAction({
        messageId,
        feedbackStatus,
      });
      if (response?.success) {
        const messageId = response?.result?.[0]?.message_id;
        // iterate over messages and update the feedback status of the message whosse rolw is assistant
        for (let i = messages?.length - 1; i >= 0; i--) {
          const message = messages[i];
          if (
            message?.role === "assistant" &&
            message?.message_id === messageId
          ) {
            message.user_feedback = feedbackStatus;
            break; // Assuming only one message needs to be updated
          }
        }
        setMessages([...messages]);
      }
    }
  };

  const movetoDown = () => {
    containerRef.current?.scrollTo({
      top: containerRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const currentContainer = containerRef.current;
    const scrollPosition = currentContainer.scrollTop;
    const maxScrollTop =
      currentContainer.scrollHeight - currentContainer.clientHeight;

    // Show the button if scrolled up
    if (scrollPosition < maxScrollTop) {
      setShowScrollButton(true);
    }

    // Hide the button if scrolled all the way to the bottom
    if (scrollPosition >= maxScrollTop - 10) {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    if (shouldScroll) {
      movetoDown();
    }
    // Re-enable scrolling after the effect runs
    setShouldScroll(true);
  }, [messages]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    currentContainer?.addEventListener("scroll", handleScroll);
    return () => {
      currentContainer?.removeEventListener("scroll", handleScroll); // Clean up scroll listener
    };
  }, []);

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
          <Message
            key={index}
            message={message}
            handleFeedback={handleFeedback}
          />
        ))}
      </Box>
      {showScrollButton && messages?.length > 5 && (
        <IconButton
          onClick={movetoDown}
          className="move-to-down-button"
          sx={{
            backgroundColor: "#333",
            color: "white",
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
          disableRipple
        >
          <KeyboardDoubleArrowDownIcon color="inherit" />
        </IconButton>
      )}
    </Box>
  );
}

export default MessageList;
