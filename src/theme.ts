import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#e91e63", // Rose
    },
    secondary: {
      main: "#f44336", // Red
    },
    background: {
      default: "#121212", // Fondo principal oscuro
      paper: "#1e1e1e", // Tarjetas y superficies
    },
    text: {
      primary: "#ffffff",
      secondary: "#f8bbd0", // Rose claro
    },
    divider: "#880e4f",
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
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#ad1457", // tono más oscuro
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#1e1e1e",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#e91e63",
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
          borderBottom: "1px solid #333",
          color: "#ffffff",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            color: "#ffffff",
            "& .MuiTableSortLabel-icon": {
              color: "#ffffff",
            },
          },
        },
      },
    },
  },
});

export default theme;
