/* eslint-disable */
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EastIcon from "@mui/icons-material/East";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import WebSocketClient from "rtlayer-client";
import {
  getPreviousMessage,
  sendDataToAction,
} from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector.js";
import InterfaceGrid from "../Grid/Grid.tsx";
import "./InterfaceChatbot.scss";

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
  const { interfaceContextData, threadId, bridgeName } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      interfaceContextData:
        state.Interface?.interfaceContext?.[interfaceId]?.interfaceData,
      threadId: state.Interface?.threadId || "threadId",
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

  const startTimeoutTimer = useCallback(() => {
    timeoutIdRef.current = setTimeout(() => {
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages.slice(0, -1),
          { role: "assistant", wait: false, timeOut: true },
        ];
        setLoading(false);
        return updatedMessages;
      });
    }, 120000); // 2 minutes
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !loading) onSend();
    },
    [loading]
  );

  const getallPreviousHistory = useCallback(async () => {
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
  }, [threadId, interfaceId, bridgeName]);

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
        if (message !== '{"status":"connected"}') {
          const stringifiedJson =
            JSON.parse(message)?.response?.choices?.[0]?.message;
          setLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            stringifiedJson,
          ]);
        }
        clearTimeout(timeoutIdRef.current);
      };

      client.on("message", handleMessage);

      return () => {
        client.unsubscribe(interfaceId + threadId);
      };
    }
  }, [threadId, interfaceId, inpreview, userId]);

  const sendMessage = useCallback(
    async (message: string) => {
      await sendDataToAction({
        message,
        userId,
        interfaceContextData: interfaceContextData || {},
        threadId: threadId,
        slugName: bridgeName,
        chatBotId: interfaceId,
      });
    },
    [userId, interfaceContextData, bridgeName, interfaceId]
  );

  const onSend = useCallback(() => {
    const message = messageRef.current.value.trim();
    if (!message) return;
    setDefaultQuestions([]);
    startTimeoutTimer();
    sendMessage(message);
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", wait: true },
    ]);
    messageRef.current.value = "";
  }, [startTimeoutTimer, sendMessage]);

  const movetoDown = useCallback(() => {
    containerRef.current?.scrollTo({
      top: containerRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    movetoDown();
  }, [messages, movetoDown]);

  const [windowHW, setWindowHW] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    setWindowHW({ width: window.innerWidth, height: window.innerHeight - 20 });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      className="w-100 h-100vh"
    >
      <Grid
        item
        xs={12}
        className="first-grid"
        sx={{ paddingX: 2, paddingY: 1 }}
      >
        <Box className="flex-col-start-start">
          <Typography
            variant="h6"
            className="interface-chatbot__header__title color-white"
          >
            {props?.title || "ChatBot"}
          </Typography>
          <Typography
            variant="overline"
            className="interface-chatbot__header__subtitle color-white"
          >
            {props?.subtitle || "Do you have any questions? Ask us!"}
          </Typography>
        </Box>
      </Grid>
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
              <Box className="w-100" key={index}>
                {message?.role === "user" && (
                  <Box className="flex w-100 chat-row box-sizing-border-box mr-2">
                    <Box className="w-100 flex-start-center">
                      <AccountBoxIcon />
                      <Typography variant="body1" className="ml-2">
                        {message?.content}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {message?.role === "assistant" && (
                  <Box className="chat-row w-100 box-sizing-border-box mr-2">
                    <Box className="w-100 flex-start-start">
                      <SmartToyIcon className="mr-1" />
                      {message?.wait ? (
                        <Box className="flex-start-center w-100 gap-5 p-1">
                          <>
                            <Typography variant="body">
                              Waiting for bot response
                            </Typography>
                            <div className="dot-pulse" />
                          </>
                        </Box>
                      ) : message?.timeOut ? (
                        <Box className="flex-start-center w-100 gap-5 p-1">
                          <Typography variant="body">
                            Timeout reached. Please try again later.
                          </Typography>
                        </Box>
                      ) : (
                        <Box className="w-100 flex-start-center">
                          {isJSONString(message?.content || "{}")
                            ?.responseId ? (
                            <InterfaceGrid
                              style={{ height: window.innerHeight }}
                              dragRef={dragRef}
                              inpreview={false}
                              ingrid={false}
                              gridId={
                                JSON.parse(message?.content || "{}")
                                  ?.responseId || "default"
                              }
                              loadInterface={false}
                              componentJson={JSON.parse(
                                message?.content || "{}"
                              )}
                              msgId={message?.createdAt}
                            />
                          ) : (
                            <Typography className="ml-1 flex-start-center">
                              {message?.content}
                              <ReportProblemIcon
                                fontSize="small"
                                color="error"
                                className="ml-2"
                              />
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
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
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {defaultQuestion.map((response, index) => (
              <Grid item xs={6} sm={6} key={index}>
                <Box
                  sx={{
                    borderRadius: "5px",
                    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.2)",
                    border: ".5px solid #1976d2",
                  }}
                  className="w-100 h-100 flex-spaceBetween-center cursor-pointer p-3 pl-3"
                  onClick={() => {
                    messageRef.current.value = response;
                    onSend();
                  }}
                >
                  <Typography variant="subtitle2">{response}</Typography>
                  <EastIcon />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} className="third-grid bg-white p-3 flex-center mb-2">
        <TextField
          inputRef={messageRef}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message"
          fullWidth
        />
        <IconButton
          onClick={() => (!loading ? onSend() : null)}
          className="p-3 cursor-pointer ml-2"
          sx={{ backgroundColor: "#1976d2", opacity: loading ? 0.5 : 1 }}
          disableRipple
        >
          <SendIcon color="inherit" className="color-white" />
        </IconButton>
      </Grid>
    </Box>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(InterfaceChatbot), [ParamsEnums.interfaceId])
);
