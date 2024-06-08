import EastIcon from "@mui/icons-material/East";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";

function DefaultQuestions({ defaultQuestion, messageRef, onSend }) {
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={{ marginTop: 2 }}>
      {defaultQuestion.map((response, index) => (
        <Grid item xs={6} sm={6} key={`${response?.length}${index}`}>
          <Box
            sx={{
              borderRadius: theme.shape.borderRadius,
              boxShadow: theme.shadows[1],
              border: `0.5px solid ${theme.palette.primary.main}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: theme.spacing(1.5),
            }}
            className="w-100 h-100 flex-spaceBetween-center"
            onClick={() => {
              messageRef.current.value = response;
              onSend();
            }}
          >
            <Typography variant="subtitle2">{response}</Typography>
            <EastIcon />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default DefaultQuestions;
