/* eslint-disable */
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import isColorLight from "../../../../utils/themeUtility.js";
import { isJSONString } from "../../utils/InterfaceUtils.ts";
import InterfaceGrid from "../Grid/Grid.tsx";
import DoneIcon from "@mui/icons-material/Done";
import "./Message.scss";
import copy from "copy-to-clipboard";

const Code = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  const [tipForCopy, setTipForCopy] = useState(false);

  const handlecopyfunction = (text: string) => {
    copy(text);
    setTipForCopy(true);
    setTimeout(() => {
      setTipForCopy(false);
    }, 800);
  };
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <div className="m-0">
      <p
        className="m-0 flex-end-center cursor-pointer p-1 pr-2"
        style={{
          backgroundColor: "#DCDCDC",
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}
        onClick={() => handlecopyfunction(children)}
      >
        {!tipForCopy ? (
          <>
            {" "}
            <ContentCopyIcon
              fontSize="inherit"
              sx={{ height: 20 }}
              className="mr-1"
            />
            copy
          </>
        ) : (
          <>
            <DoneIcon fontSize="inherit" sx={{ height: 20 }} className="mr-1" />
            copied!
          </>
        )}
      </p>
      <SyntaxHighlighter
        // style={vs}
        className="bg-white outline-none border-0 m-0"
        language={match[1]}
        wrapLongLines={true} // Enable word wrapping
        codeTagProps={{ style: { whiteSpace: "pre-wrap" } }} // Ensure word wrapping
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

function Message({ message, dragRef }) {
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
              wordBreak: "break-word",
              whiteSpace: "normal",
              overflowWrap: "break-word",
              maxWidth: "80%",
              //  boxShadow: "0 4px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                // fontFamily: "var(--theme-font-family)",
                color: textColor,
                whiteSpace: "pre-wrap",
                // fontSize: "15px",
                // "@media(max-width:991px)": { fontSize: "14px" },
                // "@media(max-width:479px)": { fontSize: "12px" },
              }}
            >
              {message?.content}
            </Typography>
          </Box>
        </Stack>
      ) : message?.role === "assistant" ? (
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
              wordBreak: "break-word",
              overflowWrap: "break-word",
              maxWidth: "100%",
              color: "black",
              textAlign: "justify",
              // overflow: "hidden",
              whiteSpace: "pre-wrap",
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
                {(() => {
                  const parsedContent = isJSONString(message?.content)
                    ? JSON.parse(message.content)
                    : null;
                  if (parsedContent && "isMarkdown" in parsedContent) {
                    return parsedContent.isMarkdown ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: Code,
                        }}
                      >
                        {parsedContent.markdown}
                      </ReactMarkdown>
                    ) : (
                      <InterfaceGrid
                        style={{ height: window.innerHeight }}
                        dragRef={dragRef}
                        inpreview={false}
                        ingrid={false}
                        gridId={parsedContent.responseId || "default"}
                        loadInterface={false}
                        componentJson={parsedContent}
                        msgId={message?.createdAt}
                      />
                    );
                  }
                  return (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: Code,
                      }}
                    >
                      {message?.content}
                    </ReactMarkdown>
                  );
                })()}
              </Box>
            )}
          </Box>
        </Stack>
      ) : message?.role === "tools_call" && Object.keys(message?.function) ? (
        <Box className="flex gap-2 mb-2">
          <Stack
            sx={{
              alignItems: "center",
              width: "30px",
              justifyContent: "flex-end",
              "@media(max-width:479px)": { width: "30px" },
            }}
            spacing="5px"
          ></Stack>
          <CheckCircleIcon color="success" />
          <Typography>
            {Object.keys(message?.function).length} Functions executed
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export default Message;
