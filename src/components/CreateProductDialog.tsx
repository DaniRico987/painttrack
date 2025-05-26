import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Product } from "../interfaces/product";
import CustomSnackbar from "./CustomSnackbar";

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newProduct: Product) => void;
}

const CreateProductDialog: React.FC<CreateProductDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 1,
  });

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("warning");

  const showSnackbar = (message: string, severity: typeof snackbarSeverity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      showSnackbar("El campo 'Nombre' es obligatorio.", "warning");
      return;
    }
    if (!form.description.trim()) {
      showSnackbar("El campo 'Descripción' es obligatorio.", "warning");
      return;
    }
    if (form.quantity < 1) {
      showSnackbar("La cantidad mínima es 1.", "warning");
      return;
    }
    if (form.unitPrice < 1) {
      showSnackbar("El precio mínimo por unidad es $1.", "warning");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      ...form,
    };

    onCreate(newProduct);
    handleCancel();
  };

  const handleCancel = () => {
    onClose();
    setForm({ name: "", description: "", quantity: 1, unitPrice: 1 });
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar nuevo producto</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
            />
            <TextField
              label="Cantidad"
              name="quantity"
              type="number"
              inputProps={{ min: 1 }}
              value={form.quantity}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Precio por unidad"
              name="unitPrice"
              type="number"
              inputProps={{ min: 1 }}
              value={form.unitPrice}
              onChange={handleChange}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};

export default CreateProductDialog;
