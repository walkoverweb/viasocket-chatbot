import { Box, Grid, Typography, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { ChatbotContext } from "../../../../App";
import isColorLight from "../../../../utils/themeUtility";
import "./InterfaceChatbot.scss";

function ChatbotHeader() {
  const theme = useTheme();
  const {
    chatbotConfig: { chatbotTitle, chatbotSubtitle },
  } = useContext<any>(ChatbotContext);
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  return (
    <Grid
      item
      xs={12}
      className="first-grid"
      sx={{ paddingX: 2, paddingY: 1, background: theme.palette.primary.main }}
    >
      <Box className="flex-col-start-start">
        <Typography
          variant="h6"
          className="interface-chatbot__header__title"
          sx={{ color: textColor }}
        >
          {chatbotTitle || "AI Assistant"}
        </Typography>
        {chatbotSubtitle && (
          <Typography
            variant="overline"
            className="interface-chatbot__header__subtitle"
            sx={{ color: textColor }}
          >
            {chatbotSubtitle || "Do you have any questions? Ask us!"}
          </Typography>
        )}
      </Box>
    </Grid>
  );
}

export default ChatbotHeader;

export function ChatbotHeaderPreview() {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  return (
    <Grid
      item
      xs={12}
      className="first-grid"
      sx={{ paddingX: 2, paddingY: 1, background: theme.palette.primary.main }}
    >
      <Box className="flex-col-start-start">
        <Typography
          variant="h6"
          className="interface-chatbot__header__title"
          sx={{ color: textColor }}
        >
          AI Assistant
        </Typography>
        {/* {chatbotSubtitle && ( */}
        <Typography
          variant="overline"
          className="interface-chatbot__header__subtitle"
          sx={{ color: textColor }}
        >
          Do you have any questions? Ask us!
        </Typography>
        {/* )} */}
      </Box>
    </Grid>
  );
}
