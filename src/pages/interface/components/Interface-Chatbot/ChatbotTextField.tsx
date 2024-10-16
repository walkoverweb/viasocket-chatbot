import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import isColorLight from "../../../../utils/themeUtility";
import { MessageContext } from "./InterfaceChatbot.tsx";

interface ChatbotTextFieldType {
  onSend?: any;
  loading?: boolean;
  messageRef?: any;
  disabled?: boolean;
  options?: any[];
}
function ChatbotTextField({
  onSend = () => {},
  loading,
  messageRef,
  disabled = false,
  options = [],
}: ChatbotTextFieldType) {
  const [message, setMessage] = useState("");
  const theme = useTheme(); // Hook to access the theme
  const isLight = isColorLight(theme.palette.primary.main);

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
          endAdornment: (
            <InputAdornment position="end" sx={{ visibility: "hidden" }}>
              <IconButton />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: theme.palette.background.default,
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
