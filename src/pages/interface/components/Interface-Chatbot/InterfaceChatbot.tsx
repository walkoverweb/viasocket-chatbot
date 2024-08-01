/* eslint-disable */
import { Box, Grid, LinearProgress, useTheme } from "@mui/material";
import React, {
  createContext,
  useCallback,
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
import ChatbotTextField from "./ChatbotTextField.tsx";
import "./InterfaceChatbot.scss";
import MessageList from "./MessageList.tsx";
import { errorToast } from "../../../../components/customToast.js";

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
  addMessage?: (message: string) => void;
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

  const { interfaceContextData, threadId, bridgeName } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      interfaceContextData:
        state.Interface?.interfaceContext?.[interfaceId]?.[
          state.Interface?.bridgeName || "root"
        ]?.interfaceData,
      threadId: state.Interface?.threadId || "",
      bridgeName: state.Interface?.bridgeName || "root",
    })
  );

  const [chatsLoading, setChatsLoading] = useState(false);
  const timeoutIdRef = useRef<any>(null);
  const userId = localStorage.getItem("interfaceUserId");
  const [loading, setLoading] = useState(false);
  const messageRef = useRef();

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

  const addMessage = (message: string) => {
    onSend(message);
  };

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event?.data?.type === "refresh") {
        getallPreviousHistory();
      }
      if (event?.data?.type === "askAi") {
        if (!loading) {
          const data = event?.data?.data;
          if (typeof data === "string") {
            // this is for when direct sending message through window.askAi("hello")
            onSend(data);
          } else {
            // this is for when sending from SendDataToChatbot method window.SendDataToChatbot({bridgeName: 'asdlfj', askAi: "hello"})
            sendMessage(
              data.askAi || "",
              data?.variables || {},
              data?.threadId || null,
              data?.bridgeName || null
            );
            setTimeout(() => {
              onSend(data.askAi || "", false);
            }, 1000);
          }
        } else {
          errorToast("Please wait for the response from AI");
          return;
        }
      }
    },
    [loading]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

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
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { role: "assistant", wait: true, content: "Function Calling" },
          ]);
        } else if (
          parsedMessage?.function_call === false &&
          !parsedMessage?.response
        ) {
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

  const sendMessage = async (
    message: string,
    variables = {},
    thread = "",
    bridge = ""
  ) => {
    await sendDataToAction({
      message,
      userId,
      interfaceContextData: { ...interfaceContextData, ...variables } || {},
      threadId: thread || threadId,
      slugName: bridge || bridgeName,
      chatBotId: interfaceId,
    });
  };

  const onSend = (msg?: string, apiCall: boolean = true) => {
    const textMessage = msg || messageRef.current.value;
    if (!textMessage) return;
    startTimeoutTimer();
    apiCall && sendMessage(textMessage);
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: textMessage },
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
          <MessageList dragRef={dragRef} />
          {/* <DefaultQuestions
            defaultQuestion={defaultQuestion}
            messageRef={messageRef}
            onSend={onSend}
          /> */}
        </Grid>
        <Grid
          item
          xs={12}
          className="third-grid"
          sx={{
            backgroundColor: theme.palette.background.paper,
            paddingX: theme.spacing(3),
            display: "flex",
            alignItems: "end",
            marginBottom: theme.spacing(2),
            // borderTop:"2px black solid"
          }}
        >
          <ChatbotTextField
            loading={loading}
            onSend={() => {
              onSend();
            }}
            messageRef={messageRef}
          />
        </Grid>
      </Box>
    </MessageContext.Provider>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(InterfaceChatbot), [ParamsEnums.interfaceId])
);
