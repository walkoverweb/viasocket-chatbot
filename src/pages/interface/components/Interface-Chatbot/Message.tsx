/* eslint-disable */
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import copy from "copy-to-clipboard";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import isColorLight from "../../../../utils/themeUtility.js";
import { isJSONString } from "../../utils/InterfaceUtils.ts";
import InterfaceGrid from "../Grid/Grid.tsx";
import "./Message.scss";

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

  const handlecopyfunction = (text: any) => {
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

const Anchor = ({ href, children, ...props }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
};

const ResetHistoryLine = () => {
  return (
    <Divider className="mb-2">
      <Chip label="History cleard" size="small" color="error" />
    </Divider>
  );
};

const UserMessageCard = React.memo(({ message, theme, textColor }: any) => {
  return (
    <>
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
          marginBottom: "10px",
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
      {message?.is_reset && <ResetHistoryLine />}
    </>
  );
});

const AssistantMessageCard = React.memo(
  ({ message, theme, isError = false, textColor }: any) => {
    return (
      <>
        <Stack
          sx={{
            alignItems: "flex-end",
            gap: "10px",
            maxWidth: "90%",
            "@media(max-width:479px)": {
              height: "fit-content",
              columnGap: "5px",
            },
            marginBottom: "10px",
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
              padding: "2px 10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "150px",
              borderRadius: "10px 10px 10px 1px",
              boxShadow: "0 2px 1px rgba(0, 0, 0, 0.1)",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              maxWidth: "100%",
              color: "black",
              // textAlign: "justify",
              // overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
          >
            {message?.wait ? (
              <Box className="flex-start-center w-100 gap-2 p-3">
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
                  const parsedContent = isJSONString(
                    isError ? message?.error : message?.content
                  )
                    ? JSON.parse(isError ? message.error : message.content)
                    : null;
                  if (parsedContent && "isMarkdown" in parsedContent) {
                    return parsedContent.isMarkdown ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: Code,
                          a: Anchor,
                        }}
                      >
                        {parsedContent.markdown}
                      </ReactMarkdown>
                    ) : (
                      <InterfaceGrid
                        style={{ height: window.innerHeight }}
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
                        a: Anchor,
                      }}
                    >
                      {!isError ? message.content : message.error}
                    </ReactMarkdown>
                  );
                })()}
              </Box>
            )}
          </Box>
        </Stack>
        {message?.is_reset && <ResetHistoryLine />}
      </>
    );
  }
);

function Message({ message }) {
  const theme = useTheme();
  const backgroundColor = theme.palette.primary.main;
  const textColor = isColorLight(backgroundColor) ? "black" : "white";

  return (
    <Box className="w-100">
      {message?.role === "user" ? (
        <>
          <UserMessageCard
            message={message}
            theme={theme}
            textColor={textColor}
          />
          {message?.error && (
            <AssistantMessageCard
              message={message}
              isError={true}
              theme={theme}
              textColor={textColor}
            />
          )}
        </>
      ) : message?.role === "assistant" ? (
        <AssistantMessageCard
          message={message}
          theme={theme}
          textColor={textColor}
        />
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
      ) : message?.role === "reset" ? (
        <ResetHistoryLine />
      ) : null}
    </Box>
  );
}

export default Message;
