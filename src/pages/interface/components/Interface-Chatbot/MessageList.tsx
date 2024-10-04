import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Box, IconButton, LinearProgress } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./InterfaceChatbot.scss";
import Message from "./Message.tsx";
import { MessageContext } from "./InterfaceChatbot.tsx";

function MessageList() {
  const { messages, fetchMoreData, hasMoreMessages } =
    useContext(MessageContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [previousScrollHeight, setPreviousScrollHeight] = useState<
    number | null
  >(null);

  const movetoDown = () => {
    containerRef.current?.scrollTo({
      top: 0, // Since flexDirection is column-reverse, top is the latest message
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const scrollTop = currentContainer.scrollTop;
    console.log("Scroll Top:", scrollTop); // Debugging scroll value

    // Since flexDirection is column-reverse, scrollTop works differently.
    // Show the button if the user has scrolled up more than 100px from the top
    if (scrollTop < -100) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    const currentContainer = containerRef.current;

    if (currentContainer) {
      // When messages are updated, adjust the scroll position
      const newScrollHeight = currentContainer.scrollHeight;

      if (previousScrollHeight !== null) {
        // Keep the scroll position stable
        currentContainer.scrollTop += newScrollHeight - previousScrollHeight;
      }

      // Update previousScrollHeight for the next effect
      setPreviousScrollHeight(newScrollHeight);
    }
  }, [messages]);

  return (
    <Box
      id="scrollableDiv"
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        padding: 2,
      }}
      ref={containerRef}
      onScroll={handleScroll}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMoreData}
        hasMore={hasMoreMessages}
        inverse
        loader={
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <LinearProgress
              color="secondary"
              sx={{ height: 4, width: "50%" }}
            />
          </Box>
        }
        scrollableTarget="scrollableDiv"
        style={{ display: "flex", flexDirection: "column-reverse" }}
        scrollThreshold={0.9}
      >
        <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
          {messages?.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </Box>
      </InfiniteScroll>

      {showScrollButton && (
        <IconButton
          onClick={movetoDown}
          className="move-to-down-button"
          sx={{
            backgroundColor: "#333",
            color: "white",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000, // Increased value to ensure visibility
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
