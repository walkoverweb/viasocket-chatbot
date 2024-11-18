import { Box, Typography } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { sendFeedbackAction } from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ChatBotGif } from "../../../../assests/assestsIndex.ts";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import "./InterfaceChatbot.scss";
import { MessageContext } from "./InterfaceChatbot.tsx";
import Message from "./Message.tsx";
import MoveToDownButton from "./MoveToDownButton.tsx";

function MessageList() {
  const containerRef = useRef<any>(null);
  const MessagesList: any = useContext(MessageContext);
  const {
    messages,
    setMessages,
    addMessage,
    helloMessages = [],
  } = MessagesList;
  const [showScrollButton, setShowScrollButton] = useState(false); // State to control the visibility of the button
  const [shouldScroll, setShouldScroll] = useState(true);
  const [showIcon, setShowGif] = useState(false);
  const { IsHuman } = useCustomSelector((state: $ReduxCoreType) => ({
    IsHuman: state.Hello?.isHuman,
  }));

  const handleFeedback = useCallback(
    async (
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
          // Iterate over messages and update the feedback status of the message whose role is assistant
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
    },
    [messages, setMessages, sendFeedbackAction]
  );

  const movetoDown = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const currentContainer = containerRef.current;
    const scrollPosition = currentContainer.scrollTop;
    const maxScrollTop =
      currentContainer.scrollHeight - currentContainer.clientHeight;

    // Show the button if scrolled up
    if (scrollPosition < maxScrollTop - 150) {
      setShowScrollButton(true);
    }

    // Hide the button if scrolled all the way to the bottom
    if (scrollPosition >= maxScrollTop - 10) {
      setShowScrollButton(false);
    }
  }, []);

  useEffect(() => {
    if (shouldScroll) {
      movetoDown();
    }
    setShouldScroll(true);
  }, [messages, movetoDown, helloMessages, IsHuman]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    currentContainer?.addEventListener("scroll", handleScroll);
    return () => {
      currentContainer?.removeEventListener("scroll", handleScroll); // Clean up scroll listener
    };
  }, [handleScroll]);

  const RenderMessages = useMemo(() => {
    if (IsHuman) {
      return helloMessages?.map((message, index) => (
        <Message
          key={`${message.message_id}-${index}`} // Combine message_id with index to ensure uniqueness
          message={message}
          handleFeedback={handleFeedback}
          addMessage={addMessage}
        />
      ));
    }
    return messages?.map((message, index) => (
      <Message
        key={`${message.message_id}-${index}`} // Combine message_id with index to ensure uniqueness
        message={message}
        handleFeedback={handleFeedback}
        addMessage={addMessage}
      />
    ));
  }, [messages, handleFeedback, addMessage, helloMessages, IsHuman]); // Include handleFeedback in dependencies

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

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
        {(IsHuman ? helloMessages.length === 0 : messages.length === 0) ? (
          <Box
            sx={{
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
            className="flex-col"
          >
            <img
              src={ChatBotGif}
              alt="Chatbot GIF"
              style={{ display: showIcon ? "block" : "none" }}
            />
            <Typography
              variant="h6"
              color="black"
              fontWeight="bold"
              style={{ display: showIcon ? "block" : "none" }}
            >
              What can I help with?
            </Typography>
          </Box>
        ) : (
          RenderMessages
        )}
      </Box>
      <MoveToDownButton
        movetoDown={movetoDown}
        showScrollButton={showScrollButton}
      />
    </Box>
  );
}
export default MessageList;
