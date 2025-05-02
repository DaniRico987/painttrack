import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  ThemeProvider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Sidebar from "./components/Sidebar";
import theme from "./theme";

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

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const isAdmin = true; // Cambia esto para simular diferentes roles

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          {/* AppBar */}
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
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
            </Toolbar>
          </AppBar>

          {/* Sidebar */}
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
            isAdmin={isAdmin}
          />

          {/* Contenido principal */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Toolbar />

            <Routes>
              {/* ADMIN */}
              {isAdmin && (
                <>
                  <Route path="/" element={<Monitor />} />
                  <Route path="/analisis" element={<Analytics />} />
                  <Route path="/respaldo" element={<BackupManager />} />
                  <Route path="/rol" element={<RolesManager />} />
                  <Route path="/Gformulas" element={<FormulasManager />} />
                </>
              )}

              {/* OPERARIO (y también accesibles por admin) */}
              <Route path="/insumos" element={<InputManager />} />
              <Route path="/compras" element={<PurchaseManager />} />
              <Route path="/ventas" element={<SaleManager />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route path="/formulas" element={<Formulas />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
