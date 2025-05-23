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
import { Purchase } from "../interfaces/purchase";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (purchase: Purchase) => void;
}

const CreatePurchaseDialog = ({ open, onClose, onCreate }: Props) => {
  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleSubmit = () => {
    const newPurchase: Purchase = {
      id: Date.now(),
      product,
      supplier,
      date,
      quantity,
      totalCost,
    };
    onCreate(newPurchase);
    onClose();
    setProduct("");
    setSupplier("");
    setDate("");
    setQuantity(0);
    setTotalCost(0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar nueva compra</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Producto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            fullWidth
          />
          <TextField
            label="Proveedor"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
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
            label="Costo total"
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(Number(e.target.value))}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !product || !supplier || !date || quantity <= 0 || totalCost <= 0
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePurchaseDialog;
