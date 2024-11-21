/* eslint-disable */
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AiIcon, UserAssistant } from "../../../../assests/assestsIndex.ts";
import { setHuman } from "../../../../store/hello/helloSlice.ts";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector.js";
import isColorLight from "../../../../utils/themeUtility";
import { MessageContext } from "./InterfaceChatbot.tsx";

interface ChatbotTextFieldType {
  onSend?: any;
  loading?: boolean;
  messageRef?: any;
  disabled?: boolean;
  options?: any[];
  setChatsLoading?: any;
}
function ChatbotTextField({
  onSend = () => {},
  loading,
  messageRef,
  disabled = false,
  options = [],
  setChatsLoading = () => {},
}: ChatbotTextFieldType) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const theme = useTheme(); // Hook to access the theme
  const isLight = isColorLight(theme.palette.primary.main);
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);
  const { IsHuman, mode } = useCustomSelector((state: $ReduxCoreType) => ({
    IsHuman: state.Hello?.isHuman,
    mode: state.Hello?.mode || [],
  }));
  const isHelloAssistantEnabled = mode?.length > 0;

  const MessagesList: any = useContext(MessageContext);
  const { addMessage } = MessagesList;
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && !loading) {
      event.preventDefault();
      onSend(message);
    }
  };

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event?.data?.type === "open") {
      messageRef?.current?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const EnableHumanAgent = async () => {
    setChatsLoading(true);
    dispatch(setHuman({}));
    setChatsLoading(false);
  };

  const EnableAI = async () => {
    setChatsLoading(true);
    dispatch(setHuman({ isHuman: false }));
    setChatsLoading(false);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {options && options.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: theme.spacing(1),
            flexWrap: "wrap",
            padding: theme.spacing(1),
            animation: "fadeIn 0.5s ease-in-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0 },
              "100%": { opacity: 1 },
            },
          }}
        >
          {options?.map((option, index) => (
            <Box
              key={index}
              onClick={() => addMessage(option)}
              className="border-p5 p-2 cursor-pointer flex-center-center"
              sx={{
                borderRadius: 7,
                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="caption">{option}</Typography>
            </Box>
          ))}
        </Box>
      )}
      {/* <TextField
        inputRef={messageRef}
        className="input-field"
        multiline // Todo: need to un comment this code
        maxRows={8}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your message"
        fullWidth
        focused
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ display: "flex", position: "relative" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "28px",
                    height: "28px",
                    "& > *": {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transition: "opacity 0.2s ease-in-out",
                    },
                    ...(isHelloAssistantEnabled && {
                      "& > .icon-visible": {
                        opacity: 1,
                      },
                      "& > .icon-hidden": {
                        opacity: 0,
                      },
                      "&:hover > .icon-visible": {
                        opacity: 0,
                      },
                      "&:hover > .icon-hidden": {
                        opacity: 1,
                      },
                    }),
                  }}
                  onClick={isHelloAssistantEnabled ? handlePopoverOpen : null}
                >
                  <img
                    src={IsHuman ? UserAssistant : AiIcon}
                    width="28"
                    height="28"
                    alt="AI"
                    className="icon-visible"
                    style={{
                      cursor: "pointer",
                      filter: !IsHuman ? "drop-shadow(0 0 5px pink)" : "",
                    }}
                  />
                  {isHelloAssistantEnabled && (
                    <ExpandLessIcon
                      className="icon-hidden"
                      sx={{ fontSize: "28px", cursor: "pointer" }}
                    />
                  )}
                </Box>
                <Popover
                  open={isPopoverOpen}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{
                    "& .MuiPopover-paper": {
                      display: "flex",
                      flexDirection: "column",
                      padding: 2,
                    },
                  }}
                >
                  <Button
                    onClick={() => {
                      EnableAI();
                      handlePopoverClose();
                    }}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <img
                      src={AiIcon}
                      width="30"
                      height="30"
                      alt="AI Icon"
                      style={{
                        marginRight: 8,
                        filter: "drop-shadow(0 0 5px pink)",
                      }}
                    />
                    <Typography variant="body1" color="black">
                      AI
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      EnableHumanAgent();
                      handlePopoverClose();
                    }}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <img
                      src={UserAssistant}
                      width="30"
                      height="30"
                      alt="AI Icon"
                      style={{ marginRight: 8 }}
                    />
                    <Typography variant="body1" color="black">
                      Human Agent
                    </Typography>
                  </Button>
                </Popover>
              </Box>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start" sx={{ visibility: "" }}>
              <img
                src={AiIcon}
                width="28"
                height="28"
                alt="AI"
                style={{ color: "red" }}
              />
              <img
                src={HumanIcon}
                width="28"
                height="28"
                alt="AI"
                style={{ color: "red" }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#f5f5f5",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
       */}
      <TextField
        inputRef={messageRef}
        className="input-field"
        multiline // Todo: need to un comment this code
        maxRows={8}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your message"
        fullWidth
        focused
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ display: "flex", position: "relative" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "28px",
                    height: "28px",
                    "& > *": {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transition: "opacity 0.2s ease-in-out",
                    },
                    ...(isHelloAssistantEnabled && {
                      "& > .icon-visible": {
                        opacity: 1,
                      },
                      "& > .icon-hidden": {
                        opacity: 0,
                      },
                      "&:hover > .icon-visible": {
                        opacity: 0,
                      },
                      "&:hover > .icon-hidden": {
                        opacity: 1,
                      },
                    }),
                  }}
                  onClick={isHelloAssistantEnabled ? handlePopoverOpen : null}
                >
                  <img
                    src={IsHuman ? UserAssistant : AiIcon}
                    width="28"
                    height="28"
                    alt="AI"
                    className="icon-visible"
                    style={{
                      cursor: "pointer",
                      filter: !IsHuman ? "drop-shadow(0 0 5px pink)" : "",
                    }}
                  />
                  {isHelloAssistantEnabled && (
                    <ExpandLessIcon
                      className="icon-hidden"
                      sx={{ fontSize: "28px", cursor: "pointer" }}
                    />
                  )}
                </Box>
                <Popover
                  open={isPopoverOpen}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{
                    "& .MuiPopover-paper": {
                      display: "flex",
                      flexDirection: "column",
                      padding: 2,
                    },
                  }}
                >
                  <Button
                    onClick={() => {
                      EnableAI();
                      handlePopoverClose();
                    }}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <img
                      src={AiIcon}
                      width="30"
                      height="30"
                      alt="AI Icon"
                      style={{
                        marginRight: 8,
                        filter: "drop-shadow(0 0 5px pink)",
                      }}
                    />
                    <Typography variant="body1" color="black">
                      AI
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      EnableHumanAgent();
                      handlePopoverClose();
                    }}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <img
                      src={UserAssistant}
                      width="30"
                      height="30"
                      alt="AI Icon"
                      style={{ marginRight: 8 }}
                    />
                    <Typography variant="body1" color="black">
                      Human Agent
                    </Typography>
                  </Button>
                </Popover>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#f5f5f5",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
      <IconButton
        onClick={() => (!loading ? onSend(message) : null)}
        sx={{
          position: "absolute",
          bottom: theme.spacing(1),
          right: theme.spacing(1),
          opacity: loading ? 0.5 : 1,
          backgroundColor: theme.palette.primary.main,
          padding: theme.spacing(1),
        }}
        disableRipple
      >
        <SendIcon sx={{ color: isLight ? "black" : "white" }} />
      </IconButton>
    </Box>
  );
}

export default ChatbotTextField;
