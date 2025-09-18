import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const BackupManager = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleBackup = () => {
    setSnackbar({
      open: true,
      message: "Backup realizado exitosamente.",
      severity: "success",
    });
  };
  const handleRestore = () => {
    setSnackbar({
      open: true,
      message: "Backup restaurado correctamente.",
      severity: "info",
    });
  };
  const handleClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {capitalize("gestor de backups")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {capitalize(
          "realiza copias de seguridad y restauración de datos del sistema."
        )}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleBackup}>
            {capitalize("crear backup")}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleRestore}>
            {capitalize("restaurar backup")}
          </Button>
        </Stack>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity as any}
          sx={{ width: "100%" }}
        >
          {capitalize(snackbar.message)}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default BackupManager;
