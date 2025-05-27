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
import { Sale } from "../interfaces/sale";
import CustomSnackbar from "./CustomSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  sale: Sale | null;
}

const EditSaleDialog = ({ open, onClose, onSave, sale }: Props) => {
  const [client, setClient] = useState("");
  const [product, setProduct] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (sale) {
      setClient(sale.client);
      setProduct(sale.product);
      setDate(sale.date);
      setQuantity(sale.quantity);
      setTotalPrice(sale.totalPrice);
    }
  }, [sale]);

  const handleSubmit = () => {
    if (!sale) return;
    if (client.trim() === "") {
      setSnackbarMessage("El campo 'Cliente' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (product.trim() === "") {
      setSnackbarMessage("El campo 'Producto' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (date.trim() === "") {
      setSnackbarMessage("El campo 'Fecha' es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (quantity <= 0) {
      setSnackbarMessage("La 'Cantidad' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (totalPrice <= 0) {
      setSnackbarMessage("El 'Precio total' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    const updated: Sale = {
      ...sale,
      client,
      product,
      date,
      quantity,
      totalPrice,
    };
    onSave(updated);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar venta</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Cliente"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            fullWidth
          />
          <TextField
            label="Producto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            fullWidth
          />
          <TextField
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Cantidad"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Precio total"
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(Number(e.target.value))}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Guardar cambios
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

export default EditSaleDialog;
