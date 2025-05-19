import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  ThemeProvider,
  CircularProgress,
  GlobalStyles,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ExitToApp } from "@mui/icons-material";

import Sidebar from "./components/Sidebar";
import theme from "./theme";
import { useAuth } from "./utils/AuthContext";

// Páginas ADMIN
import Monitor from "./pages/Internal/Monitor";
import Analytics from "./pages/Internal/Analytics";
import BackupManager from "./pages/Internal/BackupManager";
import RolesManager from "./pages/Internal/RolesManager";
import FormulasManager from "./pages/Internal/FormulaManager";

// Páginas OPERARIO
import InputManager from "./pages/Operator/InputManager";
import PurchaseManager from "./pages/Operator/PurchaseManager";
import SaleManager from "./pages/Operator/SaleManager";
import Inventory from "./pages/Operator/Inventory";
import Formulas from "./pages/Operator/Formulas";

// Login
import LoginForm from "./pages/Login/LoginForm";

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const { role, clearRole, isLoaded } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isLoaded) return;
    if (!role) navigate("/login");
  }, [role, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121212",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {/* Aquí el GlobalStyles para quitar flechitas en inputs tipo number */}
      <GlobalStyles
        styles={{
          "input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
      />

      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {role && (
          <>
            <AppBar
              position="fixed"
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <Toolbar
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                  Paint Track
                </Typography>
                <IconButton
                  onClick={() => {
                    clearRole();
                    navigate("/login");
                  }}
                  color="inherit"
                >
                  <ExitToApp />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Sidebar
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
          </>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {role && <Toolbar />}

          <Routes>
            <Route path="/login" element={<LoginForm />} />

            {isAdmin && (
              <>
                <Route path="/analisis" element={<Analytics />} />
                <Route path="/respaldo" element={<BackupManager />} />
                <Route path="/rol" element={<RolesManager />} />
                <Route path="/Gformulas" element={<FormulasManager />} />
                <Route path="/monitor" element={<Monitor />} />
              </>
            )}

            <Route path="/insumos" element={<InputManager />} />
            <Route path="/compras" element={<PurchaseManager />} />
            <Route path="/ventas" element={<SaleManager />} />
            <Route path="/inventario" element={<Inventory />} />
            <Route path="/formulas" element={<Formulas />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
