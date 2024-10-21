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
import { errorToast } from "../../../../components/customToast.js";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector.js";
import ChatbotHeader from "./ChatbotHeader.tsx";
import ChatbotTextField from "./ChatbotTextField.tsx";
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
export const MessageContext = createContext<{
  messages: MessageType[] | [];
  addMessage?: (message: string) => void;
  setMessages?: (message: MessageType[]) => void;
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
  const messageRef = useRef<any>();
  const [options, setOptions] = useState<any>([]);
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
        // Parse the incoming message string into an object
        const parsedMessage = JSON.parse(message || "{}");

        // Check if the status is "connected"
        if (parsedMessage?.status === "connected") {
          return;
        }

        // Check if the function call is present
        if (
          parsedMessage?.response?.function_call &&
          !parsedMessage?.response?.message
        ) {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { role: "assistant", wait: true, content: "Function Calling" },
          ]);
        } else if (
          parsedMessage?.response?.function_call &&
          parsedMessage?.response?.message
        ) {
          // Check if the function call is false and no response is provided
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { role: "assistant", wait: true, content: "Talking with AI" },
          ]);
        } else if (!parsedMessage?.response?.data && parsedMessage?.error) {
          // Check if there is an error and no response data
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            {
              role: "assistant",
              content: `${parsedMessage?.error || "Error in AI"}`,
            },
          ]);
          setLoading(false);
          clearTimeout(timeoutIdRef.current);
        } else if (parsedMessage?.response?.data?.role === "reset") {
          // all previous message and new object inserted
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "reset", content: "Resetting the chat" },
          ]);
        } else if (parsedMessage?.response?.data) {
          // Handle the new structure with response data
          // const content = parsedMessage.response.data.content;
          setLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            {
              role: parsedMessage.response?.data?.role || "assistant",
              ...(parsedMessage.response.data || {}),
            },
          ]);
          setOptions(parsedMessage.response?.options || []);
          clearTimeout(timeoutIdRef.current);
        } else {
          // Handle any other cases
          console.error("Unexpected message structure:", parsedMessage);
        }
      };

      client.on("message", handleMessage);

      return () => {
        clearTimeout(timeoutIdRef.current);
        client.unsubscribe(interfaceId + (threadId || userId));
        client.removeListener("message", handleMessage);
      };
    }
  }, [threadId, interfaceId, userId]);

  const sendMessage = async (
    message: string,
    variables = {},
    thread = "",
    bridge = ""
  ) => {
    const response = await sendDataToAction({
      message,
      userId,
      interfaceContextData: { ...interfaceContextData, ...variables } || {},
      threadId: thread || threadId,
      slugName: bridge || bridgeName,
      chatBotId: interfaceId,
    });
    if (!response?.success) {
      setMessages((prevMessages) => prevMessages.slice(0, -1));
      setLoading(false);
    }
  };

  const onSend = (msg?: string, apiCall: boolean = true) => {
    const textMessage = msg || messageRef.current.value;
    if (!textMessage) return;
    startTimeoutTimer();
    apiCall && sendMessage(textMessage);
    setLoading(true);
    setOptions([]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: textMessage },
      { role: "assistant", wait: true, content: "Talking with AI" },
    ]);
    messageRef.current.value = "";
  };

  return (
    <MessageContext.Provider
      value={{ messages: messages, addMessage, setMessages }}
    >
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
        <ChatbotHeader setChatsLoading={setChatsLoading} />
        {chatsLoading && (
          <LinearProgress
            variant="indeterminate"
            color="secondary"
            sx={{ height: 4 }}
          />
        )}
        <Grid
          item
          xs
          className="second-grid"
          sx={{ paddingX: 0.2, paddingBottom: 0.2 }}
        >
          <MessageList />
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
            // backgroundColor: theme.palette.background.paper,
            paddingX: theme.spacing(3),
            display: "flex",
            alignItems: "end",
            marginBottom: theme.spacing(2),
            // borderTop:"2px black solid"
          }}
        >
          <ChatbotTextField
            loading={loading}
            options={options}
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
