/* eslint-disable */
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  useTheme,
} from "@mui/material";
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import ChatbotHeader from "./ChatbotHeader.tsx";
import DefaultQuestions from "./DefaultQuestions.tsx";
import "./InterfaceChatbot.scss";
import MessageList from "./MessageList.tsx";
import isColorLight from "../../../../utils/themeUtility.js";
import { AIstarLogo } from "../../../../assests/assestsIndex.ts";

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
export const MessageContext = createContext<{
  messages: MessageType[] | [];
  addMessage?: (message: MessageType) => void;
}>({
  messages: [],
});

function InterfaceChatbot({
  props,
  inpreview = true,
  interfaceId,
  dragRef,
}: InterfaceChatbotProps) {
  const theme = useTheme(); // Hook to access the theme
  const isLight = isColorLight(theme.palette.primary.main);

  const { interfaceContextData, threadId, bridgeName, chatbotConfig } =
    useCustomSelector((state: $ReduxCoreType) => ({
      interfaceContextData:
        state.Interface?.interfaceContext?.[interfaceId]?.[
          state.Interface?.bridgeName || "root"
        ]?.interfaceData,
      threadId: state.Interface?.threadId || "",
      bridgeName: state.Interface?.bridgeName || "root",
      chatbotConfig: state.Interface?.chatbotData?.config || {},
    }));

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
  const addMessage = (message: MessageType) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
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
        clearTimeout(timeoutIdRef.current);
        client.unsubscribe(interfaceId + (threadId || userId));
        client.removeListener("message", handleMessage);
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

  return (
    <MessageContext.Provider value={{ messages: messages, addMessage }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
        className={chatbotConfig?.backgroundTheme || "chatbot-bg-light"}
      >
        {!chatbotConfig?.hideHeader && (
          <ChatbotHeader title={props?.title} subtitle={props?.subtitle} />
        )}
        {chatsLoading && (
          <LinearProgress
            variant="indeterminate"
            color="primary"
            sx={{ height: 4 }}
          />
        )}
        {!chatbotConfig?.askOnly && (
          <Grid
            item
            xs
            className="second-grid"
            sx={{ paddingX: 0.2, paddingBottom: 0.2 }}
          >
            <MessageList dragRef={dragRef} containerRef={containerRef} />
            <DefaultQuestions
              defaultQuestion={defaultQuestion}
              messageRef={messageRef}
              onSend={onSend}
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          className="third-grid"
          sx={{
            // backgroundColor: theme.palette.background.paper,
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
            placeholder="Ask AI"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <IconButton> */}
                  <img
                    src={AIstarLogo}
                    height={20}
                    width={20}
                    className="mr-2"
                  />

                  {/* <SearchIcon /> */}
                  {/* </IconButton> */}
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          />
          <div className="w-5 flex-center-center">
            {!loading || !chatbotConfig?.askOnly ? (
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
            ) : (
              <div className="loader"></div>
            )}
          </div>
        </Grid>
      </Box>
    </MessageContext.Provider>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(InterfaceChatbot), [ParamsEnums.interfaceId])
);
