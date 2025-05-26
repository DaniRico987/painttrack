import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { Product } from "../interfaces/product";
import CustomSnackbar from "./CustomSnackbar";

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  open,
  onClose,
  product,
  onSave,
}) => {
  const [editedProduct, setEditedProduct] = React.useState<Product | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  React.useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProduct) return;
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    });
  };

  const handleSave = () => {
    if (!editedProduct) return;
    if (editedProduct.name.trim() === "") {
      setSnackbarMessage("El campo 'Nombre' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (editedProduct.description.trim() === "") {
      setSnackbarMessage("El campo 'Descripción' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (editedProduct.quantity <= 0) {
      setSnackbarMessage("La 'Cantidad' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (editedProduct.unitPrice <= 0) {
      setSnackbarMessage("El 'Precio por unidad' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    onSave(editedProduct);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar producto</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            name="name"
            fullWidth
            value={editedProduct?.name || ""}
            onChange={handleChange}
          />
          <TextField
            label="Descripción"
            name="description"
            fullWidth
            multiline
            value={editedProduct?.description || ""}
            onChange={handleChange}
          />
          <TextField
            label="Cantidad"
            name="quantity"
            type="number"
            fullWidth
            value={editedProduct?.quantity || ""}
            onChange={handleChange}
          />
          <TextField
            label="Precio por unidad"
            name="unitPrice"
            type="number"
            fullWidth
            value={editedProduct?.unitPrice || ""}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
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

export default EditProductDialog;
