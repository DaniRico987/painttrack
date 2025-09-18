import React from "react";
import { Box, Typography, Paper } from "@mui/material";

function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {capitalize("dashboard general")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {capitalize(
          "vista rápida de métricas, alertas y accesos directos a los módulos principales."
        )}
      </Typography>
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Paper sx={{ flex: "1 1 220px", minWidth: 220, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {capitalize("usuarios")}
          </Typography>
          <Typography variant="h5" color="primary">
            7
          </Typography>
        </Paper>
        <Paper sx={{ flex: "1 1 220px", minWidth: 220, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {capitalize("roles")}
          </Typography>
          <Typography variant="h5" color="secondary">
            3
          </Typography>
        </Paper>
        <Paper sx={{ flex: "1 1 220px", minWidth: 220, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {capitalize("compras")}
          </Typography>
          <Typography variant="h5" color="success.main">
            3
          </Typography>
        </Paper>
        <Paper sx={{ flex: "1 1 220px", minWidth: 220, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {capitalize("ventas")}
          </Typography>
          <Typography variant="h5" color="info.main">
            3
          </Typography>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Paper sx={{ flex: "1 1 320px", minWidth: 220, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {capitalize("acceso rápido")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("usuarios")}
            </Paper>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("roles")}
            </Paper>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("compras")}
            </Paper>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("ventas")}
            </Paper>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("inventario")}
            </Paper>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("fórmulas")}
            </Paper>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("monitor")}
            </Paper>
            <Paper sx={{ p: 1, cursor: "pointer" }} elevation={2}>
              {capitalize("backups")}
            </Paper>
          </Box>
        </Paper>
        <Paper sx={{ flex: "2 1 320px", minWidth: 320, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {capitalize("alertas")}
          </Typography>
          <Typography variant="body2" color="error.main">
            {capitalize("no hay alertas críticas.")}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
