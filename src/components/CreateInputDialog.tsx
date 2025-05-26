import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { Input } from "../interfaces/input";
import CustomSnackbar from "./CustomSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (input: Input) => void;
}

const CreateInputDialog = ({ open, onClose, onCreate }: Props) => {
  const [form, setForm] = useState<Omit<Input, "id">>({
    name: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    type: "",
    unit: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
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

    const newInput: Input = {
      ...form,
      id: Date.now(),
    };
    onCreate(newInput);
    onClose();
    setForm({
      name: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      type: "",
      unit: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar Insumo</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Descripción"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Cantidad"
            type="number"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Precio por unidad"
            type="number"
            value={form.unitPrice}
            onChange={(e) => handleChange("unitPrice", Number(e.target.value))}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Tipo(Solido, Liquido, etc.)"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Unidad (kg, L, etc.)"
            value={form.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleCreate}>
          Crear
        </Button>
      </DialogActions>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity="warning"
        onClose={() => setSnackbarOpen(false)}
      />
    </Dialog>
  );
};

export default CreateInputDialog;
