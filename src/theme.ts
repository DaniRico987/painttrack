import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ba6b7a", // Rosado suave
    },
    secondary: {
      main: "#d26c6c", // Rojo pastel
    },
    background: {
      default: "#181818",
      paper: "#242424",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#f4a9b8",
    },
    divider: "#ba6b7a",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: "bold",
          color: "#e0e0e0",
          "&:hover": {
            backgroundColor: "#8f4c59",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#242424",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#ba6b7a",
          "& .MuiTableCell-head": {
            color: "#ffffff",
            fontWeight: "bold",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #444",
          color: "#e0e0e0",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            color: "#e0e0e0",
            "& .MuiTableSortLabel-icon": {
              color: "#e0e0e0",
            },
          },
        },
      },
    },
  },
});
export default theme;
