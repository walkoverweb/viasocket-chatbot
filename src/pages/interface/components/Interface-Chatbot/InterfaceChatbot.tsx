/* eslint-disable */
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import WebSocketClient from "rtlayer-client";
import {
  getPreviousMessage,
  sendDataToAction,
} from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector.js";
import ChatbotHeader from "./ChatbotHeader.tsx";
import DefaultQuestions from "./DefaultQuestions.tsx";
import "./InterfaceChatbot.scss";
import MessageList from "./MessageList.tsx";
import isColorLight from "../../../../utils/themeUtility.js";

const client = new WebSocketClient(
  "lyvSfW7uPPolwax0BHMC",
  "DprvynUwAdFwkE91V5Jj"
);

interface InterfaceChatbotProps {
  props: any;
  inpreview: boolean;
  interfaceId: string;
  componentId: string;
  gridId: string;
  dragRef: any;
}

interface MessageType {
  content: string;
  role: string;
  responseId?: string;
  wait?: boolean;
  timeOut?: boolean;
  createdAt?: string;
  function?: () => void;
  id?: string;
}

const isJSONString = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

function InterfaceChatbot({
  props,
  inpreview = true,
  interfaceId,
  dragRef,
}: InterfaceChatbotProps) {
  const theme = useTheme(); // Hook to access the theme
  const isLight = isColorLight(theme.palette.primary.main);

  const { interfaceContextData, threadId, bridgeName } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      interfaceContextData:
        state.Interface?.interfaceContext?.[interfaceId]?.interfaceData,
      threadId: state.Interface?.threadId || "",
      bridgeName: state.Interface?.bridgeName || "root",
    })
  );

  const [chatsLoading, setChatsLoading] = useState(false);
  const timeoutIdRef = useRef<any>(null);
  const containerRef = useRef(null);
  const userId = localStorage.getItem("interfaceUserId");
  const [messages, setMessages] = useState<MessageType[]>(
    useMemo(
      () =>
        !inpreview
          ? [
              { content: "hello how are you ", role: "user" },
              {
                responseId: "Response24131",
                content:
                  '{\n  "response": "Our AI services are available for you anytime, Feel free to ask anything"\n}',
                role: "assistant",
              },
            ]
          : [],
      [inpreview]
    )
  );
  const [defaultQuestion, setDefaultQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageRef = useRef();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.type === "refresh") {
        getallPreviousHistory();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const startTimeoutTimer = () => {
    timeoutIdRef.current = setTimeout(() => {
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages.slice(0, -1),
          { role: "assistant", wait: false, timeOut: true },
        ];
        setLoading(false);
        return updatedMessages;
      });
    }, 120000);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !loading) onSend();
  };

  const getallPreviousHistory = async () => {
    if (threadId && interfaceId) {
      setChatsLoading(true);
      try {
        const previousChats = await getPreviousMessage(threadId, bridgeName);
        if (Array.isArray(previousChats)) {
          setMessages(previousChats.length === 0 ? [] : [...previousChats]);
        } else {
          setMessages([]);
          console.error("previousChats is not an array");
        }
      } catch (error) {
        console.error("Error fetching previous chats:", error);
        setMessages([]);
      } finally {
        setChatsLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(false);
    if (inpreview) {
      const subscribe = () => {
        client.subscribe(interfaceId + (threadId || userId));
      };
      client.on("open", subscribe);
      subscribe();
      getallPreviousHistory();

      const handleMessage = (message: string) => {
        const parsedMessage = JSON.parse(message || "{}");
        if (parsedMessage?.status === "connected") {
          return;
        } else if (parsedMessage?.function_call) {
          console.log("function calling");

          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { role: "assistant", wait: true, content: "Function Calling" },
          ]);
        } else if (
          parsedMessage?.function_call === false &&
          !parsedMessage?.response
        ) {
          console.log("going to gpt");
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { role: "assistant", wait: true, content: "Talking with AI" },
          ]);
        } else {
          const stringifiedJson =
            parsedMessage?.response?.choices?.[0]?.message;
          // console.log(stringifiedJson, "strinfified json");
          setLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            stringifiedJson,
          ]);
          clearTimeout(timeoutIdRef.current);
        }
      };

      client.on("message", handleMessage);

      return () => {
        client.unsubscribe(interfaceId + (threadId || userId));
        clearTimeout(timeoutIdRef.current);
      };
    }
  }, [threadId, interfaceId, userId, bridgeName]);

  const sendMessage = async (message: string) => {
    await sendDataToAction({
      message,
      userId,
      interfaceContextData: interfaceContextData || {},
      threadId: threadId,
      slugName: bridgeName,
      chatBotId: interfaceId,
    });
  };

  const onSend = () => {
    const message = messageRef.current.value.trim();
    if (!message) return;
    setDefaultQuestions([]);
    startTimeoutTimer();
    sendMessage(message);
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", wait: true, content: "Talking with AI" },
    ]);
    messageRef.current.value = "";
  };

  console.log(isLight, "isLight");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        // backgroundColor: theme.palette.background.default,
      }}
    >
      <ChatbotHeader title={props?.title} subtitle={props?.subtitle} />
      {chatsLoading && (
        <LinearProgress
          variant="indeterminate"
          color="primary"
          sx={{ height: 4 }}
        />
      )}
      <Grid
        item
        xs
        className="second-grid"
        sx={{ paddingX: 0.2, paddingBottom: 0.2 }}
      >
        <MessageList
          messages={messages}
          isJSONString={isJSONString}
          dragRef={dragRef}
          containerRef={containerRef}
        />
        <DefaultQuestions
          defaultQuestion={defaultQuestion}
          messageRef={messageRef}
          onSend={onSend}
        />
      </Grid>
      <Grid
        item
        xs={12}
        className="third-grid"
        sx={{
          backgroundColor: theme.palette.background.paper,
          paddingX: theme.spacing(3),
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing(2),
          // borderTop:"2px black solid"
        }}
      >
        <TextField
          className="input-field"
          inputRef={messageRef}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message"
          fullWidth
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
        />
        <IconButton
          onClick={() => (!loading ? onSend() : null)}
          sx={{
            opacity: loading ? 0.5 : 1,
            marginLeft: theme.spacing(2),
            backgroundColor: theme.palette.primary.main,
          }}
          disableRipple
        >
          <SendIcon sx={{ color: isLight ? "black" : "white" }} />
        </IconButton>
      </Grid>
    </Box>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(InterfaceChatbot), [ParamsEnums.interfaceId])
);
