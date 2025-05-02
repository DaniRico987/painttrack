import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ScienceIcon from "@mui/icons-material/Science";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const adminMenu = [
  { section: "Administrador" },
  { text: "Monitoreo", path: "/", icon: <HomeIcon /> },
  { text: "Análisis", path: "/analisis", icon: <AnalyticsIcon /> },
  { text: "Gestor de respaldo", path: "/respaldo", icon: <InventoryIcon /> },
  { text: "Gestor de roles y permisos", path: "/rol", icon: <ReceiptIcon /> },
  { text: "Gestor de fórmulas", path: "/Gformulas", icon: <ScienceIcon /> },
];

const userMenu = [
  { section: "Operario" },
  { text: "Gestor de insumos", path: "/insumos", icon: <InventoryIcon /> },
  { text: "Gestor de compras", path: "/compras", icon: <ReceiptIcon /> },
  { text: "Gestor de ventas", path: "/ventas", icon: <ReceiptIcon /> },
  { text: "Inventario", path: "/inventario", icon: <InventoryIcon /> },
  { text: "Fórmulas", path: "/formulas", icon: <ScienceIcon /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  isAdmin,
}) => {
  const menuItems = isAdmin ? [...adminMenu, ...userMenu] : userMenu;

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6">Menú</Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item, index) => {
          if (item.section) {
            return (
              <ListItem key={`section-${item.section}`}>
                <ListItemText
                  primary={item.section}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: 14,
                    color: "text.primary",
                  }}
                />
              </ListItem>
            );
          }

          return (
            <ListItem
              key={item.text + (item.path || "")}
              component={item.path ? Link : "div"}
              to={item.path || ""}
              sx={{
                "& .MuiListItemText-primary": {
                  textDecoration: "none",
                  color: "text.primary",
                  fontSize: 14,
                },
                "&:visited": {
                  color: "text.primary", // Para que los enlaces visitados no se pongan morados
                },
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "primary.main",
                },
                "&:hover .MuiListItemIcon-root": {
                  color: "white", // Cambia el color del icono al hacer hover
                },
              }}
            >
              <ListItemIcon sx={{ color: "primary.main" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <>
      {/* Sidebar permanente en desktop */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Sidebar móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          [`& .MuiDrawer-paper`]: { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
