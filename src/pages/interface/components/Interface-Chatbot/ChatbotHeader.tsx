import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import "./InterfaceChatbot.scss";

function ChatbotHeader({ title, subtitle }) {
  return (
    <Grid item xs={12} className="first-grid" sx={{ paddingX: 2, paddingY: 1 }}>
      <Box className="flex-col-start-start">
        <Typography
          variant="h6"
          className="interface-chatbot__header__title color-white"
        >
          {title || "ChatBot"}
        </Typography>
        <Typography
          variant="overline"
          className="interface-chatbot__header__subtitle color-white"
        >
          {subtitle || "Do you have any questions? Ask us!"}
        </Typography>
      </Box>
    </Grid>
  );
}

export default ChatbotHeader;
