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
import { Sale } from "../interfaces/sale";
import CustomSnackbar from "./CustomSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (sale: Sale) => void;
}

const CreateSaleDialog = ({ open, onClose, onCreate }: Props) => {
  const [client, setClient] = useState("");
  const [product, setProduct] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = () => {
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

    const newSale: Sale = {
      id: Date.now(),
      client,
      product,
      date,
      quantity,
      totalPrice,
    };
    onCreate(newSale);
    onClose();
    setClient("");
    setProduct("");
    setDate("");
    setQuantity(0);
    setTotalPrice(0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar venta</DialogTitle>
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
          Crear venta
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

export default CreateSaleDialog;
