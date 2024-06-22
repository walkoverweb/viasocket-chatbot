/* eslint-disable */
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import InterfaceGrid from "../Grid/Grid.tsx";
import "./Message.scss";
import isColorLight from "../../../../utils/themeUtility.js";
import { CSSTransition } from "react-transition-group";

function Message({ message, isJSONString, dragRef }) {
  const theme = useTheme();
  const backgroundColor = theme.palette.primary.main;
  const textColor = isColorLight(backgroundColor) ? "black" : "white";

  return (
    <Box className="w-100">
      {message?.role === "user" ? (
        <Stack
          sx={{
            alignItems: "flex-end",
            gap: "0px",
            width: "100%",
            justifyContent: "flex-end",
            "@media(max-width:479px)": {
              height: "fit-content",
              columnGap: "5px",
            },
            marginBottom: "20px",
          }}
          direction="row"
        >
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: "10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "150px",
              borderRadius: "10px 10px 1px 10px",
              // boxShadow: "0 4px 2px rgba(0, 0, 0, 0.1)",
              wordBreak: "break-all",
              maxWidth: "80%",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                // fontFamily: "var(--theme-font-family)",
                color: textColor,
                // fontSize: "15px",
                // "@media(max-width:991px)": { fontSize: "14px" },
                // "@media(max-width:479px)": { fontSize: "12px" },
              }}
            >
              {message?.content}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Stack
          sx={{
            alignItems: "flex-end",
            gap: "10px",
            maxWidth: "90%",
            "@media(max-width:479px)": {
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
              "@media(max-width:479px)": { width: "30px" },
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bot"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </Stack>
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              padding: "10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "150px",
              borderRadius: "10px 10px 10px 1px",
              boxShadow: "0 4px 2px rgba(0, 0, 0, 0.1)",
              wordBreak: "break-all",
              maxWidth: "80%",
              color: "black",
            }}
          >
            {message?.wait ? (
              <Box className="flex-start-center w-100 gap-2 p-1">
                <div className="loader" />
                <Typography variant="body1">{message?.content}</Typography>
              </Box>
            ) : message?.timeOut ? (
              <Box className="flex-start-center w-100 gap-5 p-1">
                <Typography variant="body1">
                  Timeout reached. Please try again later.
                </Typography>
              </Box>
            ) : (
              <Box>
                {isJSONString(message?.content) ? (
                  JSON.parse(message.content)?.isMarkdown == true ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {JSON.parse(message.content)?.markdown}
                    </ReactMarkdown>
                  ) : (
                    <InterfaceGrid
                      style={{ height: window.innerHeight }}
                      dragRef={dragRef}
                      inpreview={false}
                      ingrid={false}
                      gridId={
                        JSON.parse(message?.content || "{}")?.responseId ||
                        "default"
                      }
                      loadInterface={false}
                      componentJson={JSON.parse(message?.content || "{}")}
                      msgId={message?.createdAt}
                    />
                  )
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message?.content}
                  </ReactMarkdown>
                )}
              </Box>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export default Message;
