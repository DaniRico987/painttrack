import React, { useEffect, useState } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
  duration?: number;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity = "info",
  onClose,
  duration = 4000,
}) => {
  const [internalOpen, setInternalOpen] = useState(open);
  const [queued, setQueued] = useState<{
    message: string;
    severity: AlertColor;
  } | null>(null);

  const [currentMessage, setCurrentMessage] = useState(message);
  const [currentSeverity, setCurrentSeverity] = useState(severity);

  // Maneja cambios en props cuando la snackbar ya está abierta
  useEffect(() => {
    if (internalOpen) {
      if (message !== currentMessage || severity !== currentSeverity) {
        setInternalOpen(false);
        setQueued({ message, severity });
      }
    } else {
      setCurrentMessage(message);
      setCurrentSeverity(severity);
      setInternalOpen(open);
    }
  }, [message, severity, open, internalOpen, currentMessage, currentSeverity]);

  // Reabre la snackbar si hay algo en cola
  useEffect(() => {
    if (!internalOpen && queued) {
      const timeout = setTimeout(() => {
        setCurrentMessage(queued.message);
        setCurrentSeverity(queued.severity);
        setQueued(null);
        setInternalOpen(true);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [internalOpen, queued]);

  return (
    <Snackbar
      open={internalOpen}
      autoHideDuration={duration}
      onClose={() => {
        setInternalOpen(false);
        onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={() => {
          setInternalOpen(false);
          onClose();
        }}
        severity={currentSeverity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {currentMessage}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
