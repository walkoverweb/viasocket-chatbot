/* eslint-disable */
import { Box, Grid, LinearProgress, useTheme } from "@mui/material";
import axios from "axios";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import WebSocketClient from "rtlayer-client";
import {
  getHelloChatsApi,
  getPreviousMessage,
  sendDataToAction,
} from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { errorToast } from "../../../../components/customToast.js";
import FormComponent from "../../../../components/FormComponent.js";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import {
  getHelloDetailsStart,
  setChannel,
} from "../../../../store/hello/helloSlice.ts";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector.js";
import useSocket from "../../hooks/socket.js";
import { GetSessionStorageData } from "../../utils/InterfaceUtils.ts";
import ChatbotHeader from "./ChatbotHeader.tsx";
import ChatbotHeaderTab from "./ChatbotHeaderTab.tsx";
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
  helloMessages: any;
  addMessage?: (message: string) => void;
  setMessages?: (message: MessageType[]) => void;
  threadId?: string;
  bridgeName?: string;
  fetchMoreData?: () => void;
  hasMoreMessages?: boolean;
  setNewMessage?: (newMessage: boolean) => void;
  newMessage?: boolean;
  currentPage?: Number;
}>({
  messages: [],
  helloMessages: [],
});

function InterfaceChatbot({
  props,
  inpreview = true,
  interfaceId,
}: InterfaceChatbotProps) {
  const theme = useTheme(); // Hook to access the theme

  const {
    interfaceContextData,
    reduxThreadId,
    reduxBridgeName,
    reduxHelloId,
    reduxBridgeVersionId,
    IsHuman,
    uuid,
    unique_id,
    presence_channel,
    team_id,
    chat_id,
    channelId,
    mode,
  } = useCustomSelector((state: $ReduxCoreType) => ({
    interfaceContextData:
      state.Interface?.interfaceContext?.[interfaceId]?.[
        state.Interface?.bridgeName || "root"
      ]?.interfaceData,
    reduxThreadId: state.Interface?.threadId || "",
    reduxBridgeName: state.Interface?.bridgeName || "root",
    reduxHelloId: state.Interface?.helloId || null,
    reduxBridgeVersionId: state.Interface?.version_id || null,
    IsHuman: state.Hello?.isHuman || false,
    uuid: state.Hello?.ChannelList?.uuid,
    unique_id: state.Hello?.ChannelList?.unique_id,
    presence_channel: state.Hello?.ChannelList?.presence_channel,
    team_id: state.Hello?.widgetInfo?.team?.[0]?.id,
    chat_id: state.Hello?.Channel?.id,
    channelId: state.Hello?.Channel?.channel || null,
    mode: state.Hello?.mode || [],
  }));

  const [chatsLoading, setChatsLoading] = useState(false);
  const timeoutIdRef = useRef<any>(null);
  const userId = GetSessionStorageData("interfaceUserId");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messageRef = useRef<any>();
  const [options, setOptions] = useState<any>([]);
  const socket = useSocket();

  const [threadId, setThreadId] = useState(
    GetSessionStorageData("threadId") || reduxThreadId
  );
  const [bridgeName, setBridgeName] = useState(
    GetSessionStorageData("bridgeName") || reduxBridgeName
  );
  const [helloId, setHelloId] = useState(
    GetSessionStorageData("helloId") || reduxHelloId
  );
  const [bridgeVersionId, setBridgeVersionId] = useState(
    GetSessionStorageData("version_id") || reduxBridgeVersionId
  );

  useEffect(() => {
    setThreadId(GetSessionStorageData("threadId"));
  }, [reduxThreadId]);

  useEffect(() => {
    setBridgeName(GetSessionStorageData("bridgeName"));
  }, [reduxBridgeName]);

  useEffect(() => {
    setHelloId(GetSessionStorageData("helloId"));
  }, [reduxHelloId]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    setBridgeVersionId(GetSessionStorageData("version_id"));
  }, [reduxBridgeVersionId]);

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

  const [helloMessages, setHelloMessages] = useState<any>([]);

  useEffect(() => {
    getHelloPreviousHistory(messages);
  }, [channelId, uuid]);

  const dispatch = useDispatch();

  const fetchMoreData = async () => {
    if (isFetching || !hasMoreMessages) return;

    setIsFetching(true);
    try {
      const nextPage = currentPage + 1;
      const previousChats = await getPreviousMessage(
        threadId,
        bridgeName,
        nextPage
      );

      if (Array.isArray(previousChats) && previousChats.length > 0) {
        setMessages((prevMessages) => [...previousChats, ...prevMessages]); // Prepend older messages
        setCurrentPage(nextPage);

        if (previousChats.length < 40) {
          setHasMoreMessages(false);
        }
      } else {
        setHasMoreMessages(false); // No more messages to load
      }
    } catch (error) {
      console.error("Error fetching more messages:", error);
      errorToast("Failed to load more messages.");
    } finally {
      setIsFetching(false);
    }
  };

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

  useEffect(() => {
    if (!socket) return;
    socket.on("NewPublish", (data) => {
      const { response } = data;
      const { message } = response || {};
      const { content, chat_id, from_name, sender_id } = message || {};
      const text = content?.text;
      if (text && !chat_id) {
        setLoading(false);
        clearTimeout(timeoutIdRef.current);
        setHelloMessages((prevMessages) => {
          const lastMessageId = prevMessages[prevMessages.length - 1]?.id;
          if (lastMessageId !== response?.id) {
            return [
              ...prevMessages,
              {
                role: sender_id === "bot" ? "Bot" : "Human",
                from_name,
                content: text,
                id: response?.id,
              },
            ];
          }
          return prevMessages;
        });
      }
    });
    socket.on("message", (data) => {
      // console.log("New message in channel message", data);
    });

    return () => {
      socket.off("NewPublish");
      socket.off("message");
    };
  }, [socket]);

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
        const previousChats = await getPreviousMessage(threadId, bridgeName, 1);
        if (Array.isArray(previousChats)) {
          setMessages(previousChats?.length === 0 ? [] : [...previousChats]);
          setCurrentPage(1);
          setHasMoreMessages(previousChats?.length >= 40);
        } else {
          setMessages([]);
          setHasMoreMessages(false);
          console.error("previousChats is not an array");
        }
      } catch (error) {
        console.error("Error fetching previous chats:", error);
        setMessages([]);
        setHasMoreMessages(false);
      } finally {
        setChatsLoading(false);
      }
    }
  };

  const getHelloPreviousHistory = async () => {
    if (channelId && uuid) {
      const helloChats = (await getHelloChatsApi({ channelId: channelId }))
        ?.data?.data;
      let filterChats = helloChats
        .map((chat) => {
          let role;

          if (chat?.message?.from_name) {
            role = "Human";
          } else if (
            !chat?.message?.from_name &&
            chat?.message?.sender_id === "bot"
          ) {
            role = "Bot";
          } else {
            role = "user";
          }

          return {
            role: role,
            message_id: chat?.id,
            from_name: chat?.message?.from_name,
            content: chat?.message?.content?.text,
          };
        })
        .reverse();
      setHelloMessages(filterChats);
    } else {
      console.error("helloChats is not an array or empty");
    }
  };

  const subscribeToChannel = () => {
    if (bridgeName && threadId) {
      dispatch(
        getHelloDetailsStart({
          slugName: bridgeName,
          threadId: threadId,
          helloId: helloId || null,
        })
      );
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
      subscribeToChannel();

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
        } else if (
          parsedMessage?.response?.data?.role === "reset" &&
          !parsedMessage?.response?.data?.mode
        ) {
          // all previous message and new object inserted
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "reset",
              mode: parsedMessage?.response?.data?.mode,
              content: "Resetting the chat",
            },
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
        client.unsubscribe(interfaceId + (threadId || userId));
        client.removeListener("message", handleMessage);
        clearTimeout(timeoutIdRef.current);
      };
    }
  }, [threadId, interfaceId, userId, bridgeName, helloId]);

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
      version_id: bridgeVersionId,
    });
    if (!response?.success) {
      setMessages((prevMessages) => prevMessages.slice(0, -1));
      setLoading(false);
    }
  };

  const onSend = (msg?: string, apiCall: boolean = true) => {
    const textMessage = msg || messageRef.current.value;
    if (!textMessage) return;
    setNewMessage(true);
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

  const sendMessageToHello = async (message: string) => {
    const channelDetail = {
      call_enabled: null,
      uuid: uuid,
      country: null,
      pseudo_name: null,
      unique_id: unique_id,
      presence_channel: presence_channel,
      country_iso2: null,
      chatInputSubmitted: false,
      is_blocked: null,
      customer_name: null,
      customer_number: null,
      customer_mail: null,
      team_id: team_id,
      new: true,
    };
    if (!channelId) setOpen(true);

    const response = (
      await axios.post(
        "https://api.phone91.com/v2/send/",
        {
          type: "widget",
          message_type: "text",
          content: {
            text: message,
            attachment: [],
          },
          ...(!channelId ? { channelDetail: channelDetail } : {}),
          chat_id: !channelId ? null : chat_id,
          session_id: null,
          user_data: {},
          is_anon: true,
        },
        {
          headers: {
            accept: "application/json",
            authorization: localStorage.getItem("HelloAgentAuth"),
          },
        }
      )
    )?.data?.data;
    if (!channelId) dispatch(setChannel({ Channel: response }));
  };

  const onSendHello = (msg?: string, apiCall: boolean = true) => {
    const textMessage = msg || messageRef.current.value;
    if (!textMessage) return;
    apiCall && sendMessageToHello(textMessage);
    setOptions([]);
    setHelloMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: textMessage },
    ]);
    messageRef.current.value = "";
  };

  return (
    <MessageContext.Provider
      value={{
        messages: messages,
        helloMessages: helloMessages,
        addMessage,
        setMessages,
        threadId,
        bridgeName,
        fetchMoreData,
        hasMoreMessages,
        setNewMessage,
        newMessage,
        currentPage,
      }}
    >
      <FormComponent open={open} setOpen={setOpen} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <ChatbotHeader setChatsLoading={setChatsLoading} />
        <ChatbotHeaderTab />
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
        </Grid>
        <Grid
          item
          xs={12}
          className="third-grid"
          sx={{
            paddingX: theme.spacing(3),
            display: "flex",
            alignItems: "end",
            marginBottom: theme.spacing(2),
          }}
        >
          <ChatbotTextField
            loading={loading}
            options={options}
            setChatsLoading={setChatsLoading}
            onSend={() => {
              IsHuman ? onSendHello() : onSend();
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
