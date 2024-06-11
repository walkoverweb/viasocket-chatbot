import { createTheme } from "@mui/material/styles";

// Color map for predefined color names
// const colorMap = {
//   black: "#000000",
//   red: "#f44336",
//   pink: "#e91e63",
//   purple: "#9c27b0",
//   deepPurple: "#673ab7",
//   indigo: "#3f51b5",
//   blue: "#2196f3",
//   lightBlue: "#03a9f4",
//   cyan: "#00bcd4",
//   teal: "#009688",
//   green: "#4caf50",
//   lightGreen: "#8bc34a",
//   lime: "#cddc39",
//   yellow: "#ffeb3b",
//   amber: "#ffc107",
//   orange: "#ff9800",
//   deepOrange: "#ff5722",
//   brown: "#795548",
//   grey: "#9e9e9e",
//   blueGrey: "#607d8b",
//   white: "#ffffff",
// };

// Function to generate theme based on color name
const generateTheme = (colorHex) => {
  return createTheme({
    palette: {
      primary: {
        main: colorHex,
      },
      secondary: {
        main: colorHex,
      },
      background: {
        default: "#f5f5f5", // Light grey
        paper: "#ffffff", // White
      },
      text: {
        primary: "#000000", // Black
        secondary: "#ffffff", // White for secondary text
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: colorHex,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: colorHex,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: colorHex,
              },
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: colorHex,
          },
        },
      },
    },
  });
};

export default generateTheme;
