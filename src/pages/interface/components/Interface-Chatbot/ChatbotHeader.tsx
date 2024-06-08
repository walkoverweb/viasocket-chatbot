import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Utility function to check if a color is light or dark
function isColorLight(color) {
  // Create an offscreen canvas for measuring the color brightness
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);

  // Get the color data (RGBA) of the filled rectangle
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;

  // Calculate brightness (luminance)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return true if the color is light, otherwise false
  return brightness > 128;
}

function ChatbotHeader({ title, subtitle }) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const isLight = isColorLight(primaryColor);

  return (
    <Grid
      item
      xs={12}
      sx={{
        paddingX: 2,
        paddingY: 1,
        backgroundColor: primaryColor,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h6" sx={{ color: isLight ? "black" : "white" }}>
          {title || "ChatBot"}
        </Typography>
        <Typography
          variant="overline"
          sx={{ color: isLight ? "black" : "white" }}
        >
          {subtitle || "Do you have any questions? Ask us!"}
        </Typography>
      </Box>
    </Grid>
  );
}

export default ChatbotHeader;
