import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface AlertDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 3,
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Avatar
          sx={{
            bgcolor: "warning.main",
            mb: 2,
            width: 56,
            height: 56,
          }}
        >
          <WarningAmberRoundedIcon
            sx={{
              fontSize: 35,
            }}
          />
        </Avatar>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          id="alert-dialog-description"
        >
          {message}
        </Typography>
      </Box>

      <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
        <Button onClick={onCancel} color="inherit" variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
