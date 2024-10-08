import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import isColorLight from "../../../../utils/themeUtility";

interface ChatbotTextFieldType {
  onSend?: any;
  loading?: boolean;
  messageRef?: any;
  disabled?: boolean;
}
function ChatbotTextField({
  onSend = () => {},
  loading,
  messageRef,
  disabled = false,
}: ChatbotTextFieldType) {
  const [message, setMessage] = useState("");
  const theme = useTheme(); // Hook to access the theme
  const isLight = isColorLight(theme.palette.primary.main);

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
