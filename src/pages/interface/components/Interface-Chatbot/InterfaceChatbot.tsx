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
    setMessages([
      {
        content: "Give me users list with name, age and company",
        role: "user",
        createdAt: "2024-09-20T06:30:49.422Z",
        id: 10866,
        function: null,
        is_reset: false,
        chatbot_message: null,
        updated_message: null,
        raw_data_id: "46c5d9c1-24ca-4e2e-b47c-f3123f17e513",
        org_id: "5662",
        chat_id: 10866,
        error: "",
        input_tokens: 1158,
        output_tokens: 127,
        variables: {
          message: "Give me users list with name, age and company",
          actions: [
            {
              actionId: "kZdfBC87UPgC",
              description:
                'When user need a code so use this action by using a button type of mui and name of the button will be the "use it"',
              type: "sendDataToFrontend",
              variable: "{code,config}",
            },
          ],
        },
        authkey_name: "not_found",
        latency: 37074,
        service: "openai",
        model: "gpt-4-turbo",
        status: true,
        created_at: "2024-09-20T12:00:49.940Z",
        is_present: true,
        "raw_data.id": "46c5d9c1-24ca-4e2e-b47c-f3123f17e513",
        "raw_data.org_id": "5662",
        "raw_data.authkey_name": "not_found",
        "raw_data.latency": 37074,
        "raw_data.service": "openai",
        "raw_data.status": true,
        "raw_data.error": "",
        "raw_data.model": "gpt-4-turbo",
        "raw_data.input_tokens": 1158,
        "raw_data.output_tokens": 127,
        "raw_data.expected_cost": 0.015390000000000001,
        "raw_data.created_at": "2024-09-20T12:00:49.940Z",
        "raw_data.chat_id": 10866,
        "raw_data.variables": {
          message: "Give me users list with name, age and company",
          actions: [
            {
              actionId: "kZdfBC87UPgC",
              description:
                'When user need a code so use this action by using a button type of mui and name of the button will be the "use it"',
              type: "sendDataToFrontend",
              variable: "{code,config}",
            },
          ],
        },
        "raw_data.is_present": true,
      },
      {
        content:
          "I'm sorry, but I can't provide personal data about individuals such as names, ages, or the companies they work for. If you have any other questions or need information on a different topic, feel free to ask!",
        role: "assistant",
        createdAt: "2024-09-20T06:30:49.422Z",
        id: 10867,
        function: {},
        is_reset: false,
        chatbot_message:
          '{\n  "components": {\n    "apologyMessage": {\n      "type": "Markdown",\n      "props": {\n        "children": "I\'m sorry, but I can\'t provide personal data about individuals such as names, ages, or the companies they work for. If you have any other questions or need information on a different topic, feel free to ask!"\n      }\n    }\n  }\n}',
        updated_message: null,
        raw_data_id: null,
        org_id: null,
        chat_id: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        variables: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        created_at: null,
        is_present: null,
        "raw_data.id": null,
        "raw_data.org_id": null,
        "raw_data.authkey_name": null,
        "raw_data.latency": null,
        "raw_data.service": null,
        "raw_data.status": null,
        "raw_data.error": null,
        "raw_data.model": null,
        "raw_data.input_tokens": null,
        "raw_data.output_tokens": null,
        "raw_data.expected_cost": null,
        "raw_data.created_at": null,
        "raw_data.chat_id": null,
        "raw_data.variables": null,
        "raw_data.is_present": null,
      },
      {
        content: "Give me dummy users list with name, age and company",
        role: "user",
        createdAt: "2024-09-20T06:31:23.447Z",
        id: 10868,
        function: null,
        is_reset: false,
        chatbot_message: null,
        updated_message: null,
        raw_data_id: "7fdb179b-be71-4841-b034-b65d30cc1736",
        org_id: "5662",
        chat_id: 10868,
        error: "",
        input_tokens: 1458,
        output_tokens: 565,
        variables: {
          message: "Give me dummy users list with name, age and company",
          actions: [
            {
              actionId: "kZdfBC87UPgC",
              description:
                'When user need a code so use this action by using a button type of mui and name of the button will be the "use it"',
              type: "sendDataToFrontend",
              variable: "{code,config}",
            },
          ],
        },
        authkey_name: "not_found",
        latency: 20260,
        service: "openai",
        model: "gpt-4-turbo",
        status: true,
        created_at: "2024-09-20T12:01:23.579Z",
        is_present: true,
        "raw_data.id": "7fdb179b-be71-4841-b034-b65d30cc1736",
        "raw_data.org_id": "5662",
        "raw_data.authkey_name": "not_found",
        "raw_data.latency": 20260,
        "raw_data.service": "openai",
        "raw_data.status": true,
        "raw_data.error": "",
        "raw_data.model": "gpt-4-turbo",
        "raw_data.input_tokens": 1458,
        "raw_data.output_tokens": 565,
        "raw_data.expected_cost": 0.03153,
        "raw_data.created_at": "2024-09-20T12:01:23.579Z",
        "raw_data.chat_id": 10868,
        "raw_data.variables": {
          message: "Give me dummy users list with name, age and company",
          actions: [
            {
              actionId: "kZdfBC87UPgC",
              description:
                'When user need a code so use this action by using a button type of mui and name of the button will be the "use it"',
              type: "sendDataToFrontend",
              variable: "{code,config}",
            },
          ],
        },
        "raw_data.is_present": true,
      },
      {
        content:
          "Sure, here's a list of dummy users with their names, ages, and companies. These are fictional and for illustrative purposes only:\n\n1. Name: John Doe, Age: 28, Company: Acme Corp.\n2. Name: Jane Smith, Age: 34, Company: Globex Inc.\n3. Name: Alice Johnson, Age: 22, Company: Initech\n4. Name: Bob Brown, Age: 45, Company: Umbrella Corporation\n5. Name: Carol White, Age: 30, Company: Stark Industries\n6. Name: Dave Wilson, Age: 38, Company: Wayne Enterprises\n7. Name: Emily Davis, Age: 26, Company: Soylent Corp.\n8. Name: Frank Green, Age: 41, Company: Vandelay Industries\n9. Name: Grace Lee, Age: 29, Company: Hooli\n10. Name: Henry Martin, Age: 35, Company: Pied Piper\n\nLet me know if you need more information or additional entries!",
        role: "assistant",
        createdAt: "2024-09-20T06:31:23.447Z",
        id: 10869,
        function: {},
        is_reset: true,
        chatbot_message:
          '{\n"variables": {\n  "list": [\n    { "name": "John Doe", "age": 28, "company": "Acme Corp." },\n    { "name": "Jane Smith", "age": 34, "company": "Globex Inc." },\n    { "name": "Alice Johnson", "age": 22, "company": "Initech" },\n    { "name": "Bob Brown", "age": 45, "company": "Umbrella Corporation" },\n    { "name": "Carol White", "age": 30, "company": "Stark Industries" },\n    { "name": "Dave Wilson", "age": 38, "company": "Wayne Enterprises" },\n    { "name": "Emily Davis", "age": 26, "company": "Soylent Corp." },\n    { "name": "Frank Green", "age": 41, "company": "Vandelay Industries" },\n    { "name": "Grace Lee", "age": 29, "company": "Hooli" },\n    { "name": "Henry Martin", "age": 35, "company": "Pied Piper" }\n  ]\n},\n"components": {\n  "userTable": {\n    "type": "Table",\n    "props": {\n      "data": "variables.list",\n      "columns": [\n        { "field": "name", "headerName": "Name" },\n        { "field": "age", "headerName": "Age" },\n        { "field": "company", "headerName": "Company" }\n      ]\n    }\n  }\n}\n}',
        updated_message: null,
        raw_data_id: null,
        org_id: null,
        chat_id: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        variables: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        created_at: null,
        is_present: null,
        "raw_data.id": null,
        "raw_data.org_id": null,
        "raw_data.authkey_name": null,
        "raw_data.latency": null,
        "raw_data.service": null,
        "raw_data.status": null,
        "raw_data.error": null,
        "raw_data.model": null,
        "raw_data.input_tokens": null,
        "raw_data.output_tokens": null,
        "raw_data.expected_cost": null,
        "raw_data.created_at": null,
        "raw_data.chat_id": null,
        "raw_data.variables": null,
        "raw_data.is_present": null,
      },
      {
        content:
          "function to reverse an array and search on google with reversed array",
        role: "user",
        createdAt: "2024-09-20T06:40:52.696Z",
        id: 10870,
        function: null,
        is_reset: false,
        chatbot_message: null,
        updated_message: null,
        raw_data_id: "ba69360b-948f-490f-84f4-7d80e872c221",
        org_id: "5662",
        chat_id: 10870,
        error: "",
        input_tokens: 1987,
        output_tokens: 867,
        variables: {
          message:
            "function to reverse an array and search on google with reversed array",
          actions: [
            {
              actionId: "kZdfBC87UPgC",
              description:
                'When user need a code so use this action by using a button type of mui and name of the button will be the "use it"',
              type: "sendDataToFrontend",
              variable: "{code,config}",
            },
          ],
        },
        authkey_name: "not_found",
        latency: 28387,
        service: "openai",
        model: "gpt-4-turbo",
        status: true,
        created_at: "2024-09-20T12:10:52.849Z",
        is_present: true,
        "raw_data.id": "ba69360b-948f-490f-84f4-7d80e872c221",
        "raw_data.org_id": "5662",
        "raw_data.authkey_name": "not_found",
        "raw_data.latency": 28387,
        "raw_data.service": "openai",
        "raw_data.status": true,
        "raw_data.error": "",
        "raw_data.model": "gpt-4-turbo",
        "raw_data.input_tokens": 1987,
        "raw_data.output_tokens": 867,
        "raw_data.expected_cost": 0.045880000000000004,
        "raw_data.created_at": "2024-09-20T12:10:52.849Z",
        "raw_data.chat_id": 10870,
        "raw_data.variables": {
          message:
            "function to reverse an array and search on google with reversed array",
          actions: [
            {
              actionId: "kZdfBC87UPgC",
              description:
                'When user need a code so use this action by using a button type of mui and name of the button will be the "use it"',
              type: "sendDataToFrontend",
              variable: "{code,config}",
            },
          ],
        },
        "raw_data.is_present": true,
      },
      {
        content:
          "To create a JavaScript function that reverses an array and then searches the reversed array on Google, we need to consider the following:\n\n1. **Reversing the Array**: We'll use JavaScript's native array method `.reverse()` to reverse the array.\n2. **Searching on Google**: We'll construct a Google search URL using the reversed array elements.\n\nSince the task involves interacting with an external search engine (Google), we'll simulate the search URL construction as we cannot perform actual web searches within the script.\n\nHere's the JavaScript code and configuration object:\n\n```json\n{\n  \"code\": \"const config = { arrayToReverse: context.arrayToReverse || 'Enter array elements separated by commas' };\\nfunction reverseArrayAndSearch() {\\n  const array = config.arrayToReverse.split(',');\\n  const reversedArray = array.reverse();\\n  const searchQuery = reversedArray.join('+');\\n  const googleSearchURL = `https://www.google.com/search?q=${searchQuery}`;\\n  return googleSearchURL;\\n}\\nconst result = reverseArrayAndSearch();\\nreturn result;\",\n  \"config\": { \"arrayToReverse\": \"Enter array elements separated by commas\" }\n}\n```\n\n**Explanation**:\n- **Configuration**: The `config` object contains `arrayToReverse`, which should be provided by the user or taken from the context.\n- **Function `reverseArrayAndSearch`**: This function splits the input string into an array, reverses it, joins it into a search query, and constructs a Google search URL.\n- **Return Value**: The function returns the Google search URL based on the reversed array.\n\nThis code assumes that the user or the context provides a string of array elements separated by commas. If you need to handle different input formats or additional functionalities, please let me know!",
        role: "assistant",
        createdAt: "2024-09-20T06:40:52.696Z",
        id: 10871,
        function: {},
        is_reset: false,
        chatbot_message:
          '{\n"variables": {\n  "code": "const config = { arrayToReverse: context.arrayToReverse || \'Enter array elements separated by commas\' };\\nfunction reverseArrayAndSearch() {\\n  const array = config.arrayToReverse.split(\',\');\\n  const reversedArray = array.reverse();\\n  const searchQuery = reversedArray.join(\'+\');\\n  const googleSearchURL = `https://www.google.com/search?q=${searchQuery}`;\\n  return googleSearchURL;\\n}\\nconst result = reverseArrayAndSearch();\\nreturn result;",\n  "config": { "arrayToReverse": "Enter array elements separated by commas" }\n},\n"components": {\n  "code": {\n    "type": "Markdown",\n    "props": {\n      "children": "Here\'s the JavaScript code that reverses an array and constructs a Google search URL with the reversed array elements:\\n\\n```javascript\\nconst config = { arrayToReverse: context.arrayToReverse || \'Enter array elements separated by commas\' };\\nfunction reverseArrayAndSearch() {\\n  const array = config.arrayToReverse.split(\',\');\\n  const reversedArray = array.reverse();\\n  const searchQuery = reversedArray.join(\'+\');\\n  const googleSearchURL = `https://www.google.com/search?q=${searchQuery}`;\\n  return googleSearchURL;\\n}\\nconst result = reverseArrayAndSearch();\\nreturn result;\\n```\\n\\n**Configuration**: The `config` object contains `arrayToReverse`, which should be provided by the user or taken from the context.\\n**Function `reverseArrayAndSearch`**: This function splits the input string into an array, reverses it, joins it into a search query, and constructs a Google search URL.\\n**Return Value**: The function returns the Google search URL based on the reversed array."\n    }\n  },\n  "Button": {\n    "type": "Button",\n    "props": {\n      "label": "Use it",\n      "onClick": "kZdfBC87UPgC"\n    }\n  }\n},\n"action": {\n  "actionId": "kZdfBC87UPgC",\n  "actionType": "sendDataToFrontend",\n  "variables": {\n    "code": "variables.code",\n    "config": "variables.config"\n  }\n}\n}',
        updated_message: null,
        raw_data_id: null,
        org_id: null,
        chat_id: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        variables: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        created_at: null,
        is_present: null,
        "raw_data.id": null,
        "raw_data.org_id": null,
        "raw_data.authkey_name": null,
        "raw_data.latency": null,
        "raw_data.service": null,
        "raw_data.status": null,
        "raw_data.error": null,
        "raw_data.model": null,
        "raw_data.input_tokens": null,
        "raw_data.output_tokens": null,
        "raw_data.expected_cost": null,
        "raw_data.created_at": null,
        "raw_data.chat_id": null,
        "raw_data.variables": null,
        "raw_data.is_present": null,
      },
    ]);
    // if (threadId && interfaceId) {
    //   setChatsLoading(true);
    //   try {
    //     const previousChats = await getPreviousMessage(threadId, bridgeName);
    //     if (Array.isArray(previousChats)) {
    //       setMessages(previousChats.length === 0 ? [] : [...previousChats]);
    //     } else {
    //       setMessages([]);
    //       console.error("previousChats is not an array");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching previous chats:", error);
    //     setMessages([]);
    //   } finally {
    //     setChatsLoading(false);
    //   }
    // }
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
          const content = parsedMessage.response.data.content;
          setLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { role: parsedMessage.response.role || "assistant", content },
          ]);
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
