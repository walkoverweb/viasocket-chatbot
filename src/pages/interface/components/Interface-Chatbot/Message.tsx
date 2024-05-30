/* eslint-disable */
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import InterfaceGrid from "../Grid/Grid.tsx";
import "./Message.scss";

function Message({ message, isJSONString, dragRef }) {
  const jsonstring = {
    actions: {
      actionId1: {
        type: "SendDataToFrontend",
        data: {
          type: "function",
          data: "data.isPalindrome",
        },
      },
    },
    data: {
      isPalindrome:
        "function isPalindrome(str) {\n  const cleanedStr = str.replace(/[^A-Za-z0-9]/g, '').toLowerCase();\n  const reversedStr = cleanedStr.split('').reverse().join('');\n  return cleanedStr === reversedStr;\n}",
      buttonText: "Check Palindrome",
    },
    components: {
      Typography: {
        key: "text",
        type: "Typography",
        props: {
          defaultValue: "data.isPalindrome",
          children: "data.isPalindrome",
        },
      },
      button: {
        key: "button",
        type: "Button",
        value: "data.isPalindrome",
        props: {
          variant: "contained",
          label: "data.buttonText",
        },
        action: "actionId1",
      },
    },
  };

  return (
    <Box className="w-100">
      {message?.role === "user" ? (
        <Stack
          sx={{
            alignItems: "flex-end",
            gap: "0px",
            width: "100%",
            // minHeight: "50px",
            justifyContent: "flex-end",
            " @media(max-width:479px)": {
              // height: "90px",
              height: "fit-content",
              columnGap: "5px",
            },
            marginBottom: "20px",
          }}
          direction="row"
        >
          <Box
            sx={{
              backgroundColor: "#d4e9ff",
              padding: "10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "150px",
              borderRadius: "10px 10px 1px 10px",
              boxShadow: "0 4px 2px rgba(0, 0, 0, 0)",
              wordBreak: "break-all",
              maxWidth: "80%",
            }}
          >
            <Typography
              variant="p"
              sx={{
                fontFamily: "var(--theme-font-family)",
                color: "var(--theme-color-base)",
                fontSize: "15px",
                " @media(max-width:991px)": { fontSize: "14px" },
                " @media(max-width:479px)": { fontSize: "12px" },
              }}
            >
              {message?.content}
            </Typography>
          </Box>

          {/* <Typography
              variant="p"
              sx={{
                fontFamily: 'var(--theme-font-family)',
                color: 'var(--theme-color-base)',
                fontSize: '12px',
                ' @media(max-width:991px)': { fontSize: '12px' },
                ' @media(max-width:479px)': { fontSize: '10px' },
              }}>
              11:00 AM
            </Typography> */}
          {/* </Stack> */}
        </Stack>
      ) : (
        <Stack
          sx={{
            alignItems: "flex-end",
            gap: "10px",
            // width: "100%",
            maxWidth: "90%",
            // minHeight: "50px",
            " @media(max-width:479px)": {
              // height: "90px",
              height: "fit-content",
              columnGap: "5px",
            },
            marginBottom: "15px",
          }}
          direction="row"
        >
          <Stack
            sx={{
              alignItems: "center",
              width: "30px",
              justifyContent: "flex-end",
              " @media(max-width:479px)": { width: "50px" },
            }}
            spacing="5px"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-bot"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
            {/* <Typography
              variant="p"
              sx={{
                fontFamily: 'var(--theme-font-family)',
                color: 'var(--theme-color-base)',
                fontSize: '12px',
                ' @media(max-width:991px)': { fontSize: '12px' },
                ' @media(max-width:479px)': { fontSize: '10px' },
              }}>
              11:00 AM
            </Typography> */}
          </Stack>
          <Box
            sx={{
              backgroundColor: "#EAEAEA",
              padding: "10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "250px",
              borderRadius: "10px 10px 10px 1px",
              maxWidth: "90%",
            }}
          >
            {
              // message?.wait ? (
              //   <Box className="flex-start-center w-100 gap-2 p-1">
              //     <div className="loader" />
              //     <Typography variant="body">{message?.content}</Typography>
              //   </Box>
              // ) : message?.timeOut ? (
              //   <Box className="flex-start-center w-100 gap-5 p-1">
              //     <Typography variant="body">
              //       Timeout reached. Please try again later.
              //     </Typography>
              //   </Box>
              // ) : (
              <Box className="flex-start-center">
                {/* {isJSONString(jsonstring || "{}")?.responseId ? ( */}
                <InterfaceGrid
                  style={{ height: window.innerHeight }}
                  dragRef={dragRef}
                  inpreview={false}
                  ingrid={false}
                  // gridId={
                  //   JSON.parse(message?.content || "{}")?.responseId ||
                  //   "default"
                  // }
                  loadInterface={false}
                  // componentJson={JSON.parse(message?.content || "{}")}
                  componentJson={jsonstring}
                  msgId={message?.createdAt}
                />
                {/* ) : (
                  <Typography className="ml-1 flex-start-center">
                    {message?.content}
                    <ReportProblemIcon
                      fontSize="small"
                      color="error"
                      className="ml-2"
                    />
                  </Typography>
                )} */}
              </Box>
              // )
            }
          </Box>
        </Stack>
      )}
    </Box>
  );
}
export default Message;
