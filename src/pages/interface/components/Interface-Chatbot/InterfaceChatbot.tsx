/* eslint-disable */
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
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

  useEffect(() => {
    setMessages([
      {
        content: "Hello",
        role: "user",
        createdAt: "2024-05-24T16:53:34.669Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '\n    { "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Hello! How can I assist you today?", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T16:53:34.669Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "what is viasocket",
        role: "user",
        createdAt: "2024-05-24T16:53:58.268Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '\n{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Viasocket is a platform designed to assist users with various tasks related to their workspace. How can I help you with Viasocket today?", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T16:53:58.268Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Give me list of members",
        role: "user",
        createdAt: "2024-05-24T16:54:48.570Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '\n{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Here is the list of members in your workspace:", "textAlign": "left" } } }\n\n\n    ',
        role: "assistant",
        createdAt: "2024-05-24T16:54:48.570Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Give me list of members",
        role: "user",
        createdAt: "2024-05-24T17:00:09.569Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response4", "Table": { "type": "Table", "key": "Table", "props": { "columns": [ { "title": "ID", "field": "id" }, { "title": "Name", "field": "name" }, { "title": "Email", "field": "email" }, { "title": "Created At", "field": "created_at" }, { "title": "Updated At", "field": "updated_at" } ], "data": [ { "id": 2129, "name": "rudraksh kachhawa", "email": "rudrakshkachhawa@gmail.com", "created_at": "2023-08-26T09:56:11.000000Z", "updated_at": "2024-04-26T12:01:42.000000Z" }, { "id": 2034, "name": "Parakh Jain", "email": "parakhjain2301@gmail.com", "created_at": "2023-09-09T07:30:00.000000Z", "updated_at": "2024-04-26T12:01:43.000000Z" }, { "id": 1977, "name": "asdfgh asdfgh", "email": "pratham@gmail.com", "created_at": "2023-08-17T12:05:45.000000Z", "updated_at": "2023-08-17T12:05:45.000000Z" } ] } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:00:09.569Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "invite prathm@gmail.com in this org",
        role: "user",
        createdAt: "2024-05-24T17:00:51.169Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "The user with email prathm@gmail.com has been successfully invited to the workspace.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:00:51.169Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Hello",
        role: "user",
        createdAt: "2024-05-24T17:02:25.968Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Hello! How can I assist you today?", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:02:25.968Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "What are your responseTypes",
        role: "user",
        createdAt: "2024-05-24T17:02:48.069Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Here are the available response types:\\n\\n1. Text Component\\n2. Icon or Image\\n3. TextField\\n4. Button\\n5. Table", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:02:48.069Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "What you can do",
        role: "user",
        createdAt: "2024-05-24T17:03:06.769Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "I can assist you with the following tasks on the viaSocket platform:\\n\\n1. Invite members to the workspace.\\n2. Provide the members list of a workspace.\\n3. Give basic information about the workspace (company, org).\\n4. Display various UI components like text, icons, text fields, buttons, and tables.\\n\\nFeel free to ask for any specific assistance you need!", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:03:06.769Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "What is your configuration like temperature, max tokens",
        role: "user",
        createdAt: "2024-05-24T17:03:31.968Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "I don\'t have direct access to my configuration settings like temperature or max tokens. These settings are typically managed by the platform administrators. If you have any specific questions or need assistance, feel free to ask!", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:03:31.968Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "What is your prompt",
        role: "user",
        createdAt: "2024-05-24T17:03:52.368Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "My prompt is designed to assist you with various tasks on the viaSocket platform. It includes information about your workspace, available tools, and response types. Here is a summary of my prompt:\\n\\n1. Assist with tasks on the viaSocket platform after login.\\n2. Show friendly time in the user\'s timezone.\\n3. Provide information about available variables for the workspace and user.\\n4. Use response types like text components, icons, text fields, buttons, and tables.\\n5. Utilize functions to invite members, get the members list, and provide basic workspace information.\\n6. Use multi_tool_use for parallel execution of functions.\\n\\nFeel free to ask for any specific assistance you need!", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:03:52.368Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Give me function to send message on slack",
        role: "user",
        createdAt: "2024-05-24T17:04:22.692Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Currently, I don\'t have the capability to directly send messages on Slack. However, you can use Slack\'s API to send messages. Here is a basic example of how you can do it using a POST request in JavaScript:\\n\\n```javascript\\nconst axios = require(\'axios\');\\n\\nconst sendMessageToSlack = async (message, webhookUrl) => {\\n  try {\\n    const response = await axios.post(webhookUrl, {\\n      text: message,\\n    });\\n    console.log(\'Message sent: \', response.data);\\n  } catch (error) {\\n    console.error(\'Error sending message: \', error);\\n  }\\n};\\n\\nconst message = \'Hello, this is a test message!\';\\nconst webhookUrl = \'https://hooks.slack.com/services/YOUR/WEBHOOK/URL\';\\nsendMessageToSlack(message, webhookUrl);\\n```\\n\\nReplace `YOUR/WEBHOOK/URL` with your actual Slack webhook URL. This script uses the `axios` library to send a POST request to the Slack webhook URL with the message you want to send.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:04:22.692Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "WHat is slack",
        role: "user",
        createdAt: "2024-05-24T17:05:00.368Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Slack is a collaboration hub that connects your work with the people you work with through channels. It\'s a messaging app for teams that brings all your communication together in one place. Here are some key features of Slack:\\n\\n1. **Channels**: Organize conversations into channels based on projects, teams, or topics.\\n2. **Direct Messages**: Send private messages to individuals or small groups for quick, focused conversations.\\n3. **Integrations**: Connect with other tools and services like Google Drive, Trello, and more to streamline your workflow.\\n4. **File Sharing**: Easily share files, images, and documents within channels or direct messages.\\n5. **Search**: Quickly find past conversations, files, and links with powerful search functionality.\\n6. **Notifications**: Customize notifications to stay informed about important updates without being overwhelmed.\\n7. **Apps and Bots**: Enhance productivity with various apps and bots that automate tasks and provide additional functionality.\\n\\nSlack is widely used by teams and organizations to improve communication, collaboration, and productivity.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:05:00.368Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "what is workspace91",
        role: "user",
        createdAt: "2024-05-24T17:05:28.268Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "It seems that there was an issue retrieving the information about the workspace. Please ensure that the proxy authentication token is correct and try again. If the problem persists, you may need to contact support for further assistance.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:05:28.268Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "no i want to know about workspace91 website",
        role: "user",
        createdAt: "2024-05-24T17:06:00.557Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Workspace91 is a platform that provides flexible office spaces and coworking solutions. It is designed to cater to the needs of freelancers, startups, and established businesses by offering a variety of workspaces that can be customized to fit different requirements. Here are some key features of Workspace91:\\n\\n1. **Flexible Workspaces**: Offers a range of workspace options including private offices, dedicated desks, and hot desks.\\n2. **Meeting Rooms**: Provides access to fully-equipped meeting rooms for client meetings, team collaborations, and presentations.\\n3. **Virtual Offices**: Offers virtual office solutions for businesses that need a professional address and mail handling services without a physical office.\\n4. **Amenities**: Includes amenities such as high-speed internet, printing services, coffee and tea, and more to ensure a comfortable working environment.\\n5. **Community Events**: Hosts networking events, workshops, and seminars to help members connect and grow their businesses.\\n6. **24/7 Access**: Many locations offer 24/7 access, allowing members to work according to their own schedules.\\n\\nWorkspace91 aims to create a productive and collaborative environment for professionals from various industries. For more information, you can visit their official website.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:06:00.557Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "preorder traversal of binary trees",
        role: "user",
        createdAt: "2024-05-24T17:06:46.169Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Preorder traversal of a binary tree is a type of depth-first traversal where the nodes are visited in the following order:\\n\\n1. Visit the root node.\\n2. Traverse the left subtree in preorder.\\n3. Traverse the right subtree in preorder.\\n\\nHere is a simple algorithm for preorder traversal:\\n\\n1. Visit the root node and process its value.\\n2. Recursively perform a preorder traversal of the left subtree.\\n3. Recursively perform a preorder traversal of the right subtree.\\n\\nIn Python, the code for preorder traversal might look like this:\\n\\n```python\\nclass TreeNode:\\n    def __init__(self, value=0, left=None, right=None):\\n        self.value = value\\n        self.left = left\\n        self.right = right\\n\\n# Preorder Traversal Function\\ndef preorder_traversal(root):\\n    if root is None:\\n        return\\n    print(root.value, end=\' \')\\n    preorder_traversal(root.left)\\n    preorder_traversal(root.right)\\n\\n# Example Usage\\nif __name__ == \'__main__\':\\n    # Creating a sample binary tree\\n    root = TreeNode(1)\\n    root.left = TreeNode(2)\\n    root.right = TreeNode(3)\\n    root.left.left = TreeNode(4)\\n    root.left.right = TreeNode(5)\\n\\n    # Performing preorder traversal\\n    preorder_traversal(root)\\n```\\n\\nIn this example, the output of the preorder traversal would be: `1 2 4 5 3`.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:06:46.169Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "what model you are using",
        role: "user",
        createdAt: "2024-05-24T17:07:20.568Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "I am powered by OpenAI\'s GPT-4 model, which is a state-of-the-art language model designed to understand and generate human-like text based on the input provided. If you have any specific questions or tasks, feel free to ask!", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:07:20.568Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "can you provide speech based output",
        role: "user",
        createdAt: "2024-05-24T17:07:41.068Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Currently, I can only provide text-based responses. However, you can use text-to-speech (TTS) software or services to convert my text responses into speech. There are many TTS tools available online and as part of various operating systems that can help you with this.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-24T17:07:41.068Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Hello",
        role: "user",
        createdAt: "2024-05-25T05:37:25.766Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Hello! How can I assist you today?", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-25T05:37:25.766Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Give me members list",
        role: "user",
        createdAt: "2024-05-25T05:38:07.058Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response4", "Table": { "type": "Table", "key": "Table", "props": { "columns": [ { "title": "ID", "field": "id" }, { "title": "Name", "field": "name" }, { "title": "Email", "field": "email" }, { "title": "Created At", "field": "created_at" }, { "title": "Updated At", "field": "updated_at" } ], "data": [ { "id": 5480, "name": "prathm@gmail.com", "email": "prathm@gmail.com", "created_at": "2024-05-24T17:00:42.000000Z", "updated_at": "2024-05-24T17:00:42.000000Z" }, { "id": 2129, "name": "rudraksh kachhawa", "email": "rudrakshkachhawa@gmail.com", "created_at": "2023-08-26T09:56:11.000000Z", "updated_at": "2024-04-26T12:01:42.000000Z" }, { "id": 2034, "name": "Parakh Jain", "email": "parakhjain2301@gmail.com", "created_at": "2023-09-09T07:30:00.000000Z", "updated_at": "2024-04-26T12:01:43.000000Z" }, { "id": 1977, "name": "asdfgh asdfgh", "email": "pratham@gmail.com", "created_at": "2023-08-17T12:05:45.000000Z", "updated_at": "2023-08-17T12:05:45.000000Z" } ] } } }',
        role: "assistant",
        createdAt: "2024-05-25T05:38:07.058Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Hello",
        role: "user",
        createdAt: "2024-05-25T06:26:48.665Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Hello again! How can I assist you today?", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-25T06:26:48.665Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Give me members list",
        role: "user",
        createdAt: "2024-05-25T06:27:13.665Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response4", "Table": { "type": "Table", "key": "Table", "props": { "columns": [ { "title": "ID", "field": "id" }, { "title": "Name", "field": "name" }, { "title": "Email", "field": "email" }, { "title": "Created At", "field": "created_at" }, { "title": "Updated At", "field": "updated_at" } ], "data": [ { "id": 5480, "name": "prathm@gmail.com", "email": "prathm@gmail.com", "created_at": "2024-05-24T17:00:42.000000Z", "updated_at": "2024-05-24T17:00:42.000000Z" }, { "id": 2129, "name": "rudraksh kachhawa", "email": "rudrakshkachhawa@gmail.com", "created_at": "2023-08-26T09:56:11.000000Z", "updated_at": "2024-04-26T12:01:42.000000Z" }, { "id": 2034, "name": "Parakh Jain", "email": "parakhjain2301@gmail.com", "created_at": "2023-09-09T07:30:00.000000Z", "updated_at": "2024-04-26T12:01:43.000000Z" }, { "id": 1977, "name": "asdfgh asdfgh", "email": "pratham@gmail.com", "created_at": "2023-08-17T12:05:45.000000Z", "updated_at": "2023-08-17T12:05:45.000000Z" } ] } } }',
        role: "assistant",
        createdAt: "2024-05-25T06:27:13.665Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "What is viasocket",
        role: "user",
        createdAt: "2024-05-25T06:27:31.865Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "I couldn\'t retrieve the information about Viasocket at the moment. Please try again later.", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-25T06:27:31.865Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "what is the process of send message on slack",
        role: "user",
        createdAt: "2024-05-25T06:28:55.618Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "What you can do",
        role: "user",
        createdAt: "2024-05-28T05:45:34.358Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "I can assist you with various tasks on the viaSocket platform, including:\\n\\n1. **Inviting Members**: I can help you invite new members to your workspace.\\n2. **Fetching Member Lists**: I can provide you with the list of members in your workspace.\\n3. **Workspace Information**: I can give you basic information about your workspace, such as name, timezone, etc.\\n4. **Feature Requests**: I can facilitate the submission of feature requests to the internal team.\\n\\nFeel free to ask for any specific assistance you need!", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-28T05:45:34.358Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Hello",
        role: "user",
        createdAt: "2024-05-30T05:50:25.367Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Hello",
        role: "user",
        createdAt: "2024-05-30T05:50:50.968Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Hello",
        role: "user",
        createdAt: "2024-05-30T05:52:42.898Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response1", "Typography": { "type": "Typography", "key": "Typography", "props": { "variant": "bold", "children": "Hello! How can I assist you today?", "textAlign": "left" } } }',
        role: "assistant",
        createdAt: "2024-05-30T05:52:42.898Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content: "Give me members list",
        role: "user",
        createdAt: "2024-05-30T05:53:20.542Z",
        id: null,
        function: null,
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
      {
        content:
          '{ "responseId": "Response4", "Table": { "type": "Table", "key": "Table", "props": { "columns": [ { "title": "ID", "field": "id" }, { "title": "Name", "field": "name" }, { "title": "Email", "field": "email" }, { "title": "Created At", "field": "created_at" }, { "title": "Updated At", "field": "updated_at" } ], "data": [ { "id": 5480, "name": "prathm@gmail.com", "email": "prathm@gmail.com", "created_at": "2024-05-24T17:00:42.000000Z", "updated_at": "2024-05-24T17:00:42.000000Z" }, { "id": 2129, "name": "rudraksh kachhawa", "email": "rudrakshkachhawa@gmail.com", "created_at": "2023-08-26T09:56:11.000000Z", "updated_at": "2024-04-26T12:01:42.000000Z" }, { "id": 2034, "name": "Parakh Jain", "email": "parakhjain2301@gmail.com", "created_at": "2023-09-09T07:30:00.000000Z", "updated_at": "2024-04-26T12:01:43.000000Z" }, { "id": 1977, "name": "asdfgh asdfgh", "email": "pratham@gmail.com", "created_at": "2023-08-17T12:05:45.000000Z", "updated_at": "2023-08-17T12:05:45.000000Z" } ] } } }',
        role: "assistant",
        createdAt: "2024-05-30T05:53:20.542Z",
        id: null,
        function: {},
        org_id: null,
        authkey_name: null,
        latency: null,
        service: null,
        model: null,
        status: null,
        error: null,
        input_tokens: null,
        output_tokens: null,
        expected_cost: null,
        created_at: null,
        chat_id: null,
        variables: null,
        is_present: null,
      },
    ]);
  }, []);

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

  const movetoDown = () => {
    containerRef.current?.scrollTo({
      top: containerRef?.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    movetoDown();
  }, [messages, movetoDown]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      className="w-100 h-100vh"
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
          movetoDown={movetoDown}
          containerRef={containerRef}
        />
        <DefaultQuestions
          defaultQuestion={defaultQuestion}
          messageRef={messageRef}
          onSend={onSend}
        />
      </Grid>
      <Grid item xs={12} className="third-grid bg-white p-3 flex-center mb-2">
        <TextField
          className="input-field"
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
