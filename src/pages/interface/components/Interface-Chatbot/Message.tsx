import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Box, Typography } from "@mui/material";
import React from "react";
import InterfaceGrid from "../Grid/Grid.tsx";
import "./InterfaceChatbot.scss";

function Message({ message, isJSONString, dragRef }) {
  console.log(JSON.parse(message?.content || "{}"), 23423);
  return (
    <Box className="w-100">
      {message?.role === "user" ? (
        <Box className="flex w-100 chat-row box-sizing-border-box mr-2">
          <Box className="w-100 flex-start-center">
            <AccountBoxIcon />
            <Typography variant="body1" className="ml-2">
              {message?.content}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box className="chat-row w-100 box-sizing-border-box mr-2">
          <Box className="w-100 flex-start-start">
            <SmartToyIcon className="mr-1" />
            {message?.wait ? (
              <Box className="flex-start-center w-100 gap-2 p-1 ml-3">
                <div className="loader" />
                <Typography variant="body">{message?.content}</Typography>
              </Box>
            ) : message?.timeOut ? (
              <Box className="flex-start-center w-100 gap-5 p-1">
                <Typography variant="body">
                  Timeout reached. Please try again later.
                </Typography>
              </Box>
            ) : (
              <Box className="w-100 flex-start-center">
                {isJSONString(message?.content || "{}")?.responseId ? (
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
                ) : (
                  <Typography className="ml-1 flex-start-center">
                    {message?.content}
                    <ReportProblemIcon
                      fontSize="small"
                      color="error"
                      className="ml-2"
                    />
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
export default Message;
