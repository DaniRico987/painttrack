import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../components/CustomSnackbar";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = () => {
  const { login, role } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
