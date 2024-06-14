/* eslint-disable */
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CssBaseline,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useMemo, useRef, useState } from "react";
import WebSocketClient from "rtlayer-client";
import {
  getPreviousMessage,
  sendDataToAction,
} from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import generateTheme from "../../../../theme.js";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector.js";
import ChatbotHeader from "./ChatbotHeader.tsx";
import DefaultQuestions from "./DefaultQuestions.tsx";
import "./InterfaceChatbot.scss";
import MessageList from "./MessageList.tsx";

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
    return JSON.parse(str);
  } catch {
    return {};
  }
};

function InterfaceChatbot({
  props,
  inpreview = true,
  interfaceId,
  dragRef,
}: InterfaceChatbotProps) {
  const theme = generateTheme(props?.themeColor);
  // const primaryColor = theme.palette.primary.main;
  const isLight = isColorLight(props?.themeColor);

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
      };
    }
  }, [threadId, interfaceId, inpreview, userId]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
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
            padding: theme.spacing(3),
            display: "flex",
            alignItems: "center",
            marginBottom: theme.spacing(2),
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
              // "&:hover": {
              //   backgroundColor: theme.palette.primary.dark,
              // },
            }}
            disableRipple
          >
            <SendIcon sx={{ color: isLight ? "black" : "white" }} />
          </IconButton>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(InterfaceChatbot), [ParamsEnums.interfaceId])
);

function isColorLight(color) {
  // Create an offscreen canvas for measuring the color brightness
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);

  // Get the color data (RGBA) of the filled rectangle
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;

  // Calculate brightness (luminance)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return true if the color is light, otherwise false
  return brightness > 128;
}
