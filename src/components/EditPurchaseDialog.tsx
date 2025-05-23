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
import { Purchase } from "../interfaces/purchase";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (purchase: Purchase) => void;
  purchase: Purchase | null;
}

const EditPurchaseDialog = ({ open, onClose, onSave, purchase }: Props) => {
  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    if (purchase) {
      setProduct(purchase.product);
      setSupplier(purchase.supplier);
      setDate(purchase.date);
      setQuantity(purchase.quantity);
      setTotalCost(purchase.totalCost);
    }
  }, [purchase]);

  const handleSubmit = () => {
    if (!purchase) return;
    const updated: Purchase = {
      ...purchase,
      product,
      supplier,
      date,
      quantity,
      totalCost,
    };
    onSave(updated);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar compra</DialogTitle>
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
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !product || !supplier || !date || quantity <= 0 || totalCost <= 0
          }
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPurchaseDialog;
