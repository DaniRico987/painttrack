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

interface Props {
  open: boolean;
  onClose: () => void;
  input: Input | null;
  onSave: (updated: Input) => void;
}

const EditInputDialog = ({ open, onClose, input, onSave }: Props) => {
  const [form, setForm] = useState<Input | null>(input);

  useEffect(() => {
    setForm(input);
  }, [input]);

  const handleChange = (field: keyof Input, value: any) => {
    if (!form) return;
    setForm((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSave = () => {
    if (form) {
      onSave(form);
      onClose();
    }
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
              onChange={(e) => handleChange("type", e.target.value)}
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
    </Dialog>
  );
};

export default EditInputDialog;
