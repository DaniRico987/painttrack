import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Input } from "../interfaces/input";
import CustomSnackbar from "./CustomSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  input: Input | null;
  onSave: (updated: Input) => void;
}

const EditInputDialog = ({ open, onClose, input, onSave }: Props) => {
  const [form, setForm] = useState<Input | null>(input);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    setForm(input);
  }, [input]);

  const handleChange = (field: keyof Input, value: any) => {
    if (!form) return;
    setForm((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSave = () => {
    if (!form) return;
    if (form.name.trim() === "") {
      setSnackbarMessage("El campo 'Nombre' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (form.description.trim() === "") {
      setSnackbarMessage("El campo 'Descripción' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (form.quantity <= 0) {
      setSnackbarMessage("La 'Cantidad' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (form.unitPrice <= 0) {
      setSnackbarMessage("El 'Precio por unidad' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (form.type.trim() === "") {
      setSnackbarMessage("El campo 'Tipo' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (form.unit.trim() === "") {
      setSnackbarMessage("El campo 'Unidad' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Insumo</DialogTitle>
      <DialogContent>
        {form && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Descripción"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
            />
            <TextField
              label="Cantidad"
              type="number"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Precio por unidad"
              type="number"
              value={form.unitPrice}
              onChange={(e) => handleChange("unitPrice", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Tipo"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              fullWidth
            />
            <TextField
              label="Unidad"
              value={form.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              fullWidth
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity="warning"
      />
    </Dialog>
  );
};

export default EditInputDialog;
