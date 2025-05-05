import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../components/CustomSnackbar";

const LoginForm = () => {
  const { login, role } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("info");

  const navigate = useNavigate();

  useEffect(() => {
    if (role === "admin") {
      navigate("/monitor");
    } else if (role === "operario") {
      navigate("/insumos");
    }
  }, [role, navigate]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const success = login(username, password);
    if (!success) {
      setSnackbarMessage("Credenciales incorrectas");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false);
    }
  };

  // Retornar null si ya tiene un rol
  if (role) {
    return null;
  }

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar sesión
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />

            <Button variant="contained" color="primary" type="submit">
              Entrar
            </Button>
          </Box>
        </Paper>
      </Container>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};

export default LoginForm;
