import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import "./InterfaceChatbot.scss";
import isColorLight from "../../../../utils/themeUtility";

function ChatbotHeader({ title, subtitle }) {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  console.log(
    isLightBackground,
    theme.palette.primary.main,
    "isLightBackground"
  );
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
          {title || "ChatBot"}
        </Typography>
        <Typography
          variant="overline"
          className="interface-chatbot__header__subtitle"
          sx={{ color: textColor }}
        >
          {subtitle || "Do you have any questions? Ask us!"}
        </Typography>
      </Box>
    </Grid>
  );
}

export default ChatbotHeader;
