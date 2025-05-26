import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomSnackbar from "./CustomSnackbar";

interface EditFormulaDialogProps {
  open: boolean;
  onClose: () => void;
  product: Formula | null;
  onSave: (updatedFormula: Formula) => void;
}

const EditFormulaDialog = ({
  open,
  onClose,
  product,
  onSave,
}: EditFormulaDialogProps) => {
  const [editedFormula, setEditedFormula] = useState<Formula | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (product) {
      setEditedFormula({ ...product });
    }
  }, [product]);

  const handleChange = (field: keyof Formula, value: any) => {
    if (!editedFormula) return;
    setEditedFormula({
      ...editedFormula,
      [field]: value,
    });
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: any
  ) => {
    if (!editedFormula) return;
    const updatedIngredients = [...editedFormula.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setEditedFormula({
      ...editedFormula,
      ingredients: updatedIngredients,
    });
  };

  const handleAddIngredient = () => {
    if (!editedFormula) return;
    setEditedFormula({
      ...editedFormula,
      ingredients: [
        ...editedFormula.ingredients,
        {
          id: Date.now() + Math.random(),
          name: "",
          quantity: 0,
          unit: "kg",
        },
      ],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    if (!editedFormula) return;
    const updatedIngredients = [...editedFormula.ingredients];
    updatedIngredients.splice(index, 1);
    setEditedFormula({
      ...editedFormula,
      ingredients: updatedIngredients,
    });
  };

  const handleSave = () => {
    if (!editedFormula) return;

    if (editedFormula.name.trim() === "") {
      setSnackbarMessage("El campo 'Nombre' de la fórmula es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (editedFormula.description.trim() === "") {
      setSnackbarMessage("El campo 'Descripción' de la fórmula es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (editedFormula.totalAmount <= 0) {
      setSnackbarMessage("La 'Cantidad total' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (editedFormula.dryingTime <= 0) {
      setSnackbarMessage("El 'Tiempo de secado' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (editedFormula.coverage <= 0) {
      setSnackbarMessage("La 'Cobertura' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (editedFormula.ingredients.length === 0) {
      setSnackbarMessage("Debes agregar al menos un ingrediente.");
      setSnackbarOpen(true);
      return;
    }
    for (let i = 0; i < editedFormula.ingredients.length; i++) {
      const ing = editedFormula.ingredients[i];
      if (ing.name.trim() === "") {
        setSnackbarMessage(`El nombre del ingrediente #${i + 1} es obligatorio.`);
        setSnackbarOpen(true);
        return;
      }
      if (ing.quantity <= 0) {
        setSnackbarMessage(
          `La cantidad del ingrediente '${ing.name || `#${i + 1}`}' debe ser mayor a 0.`
        );
        setSnackbarOpen(true);
        return;
      }
      if (ing.unit.trim() === "") {
        setSnackbarMessage(
          `La unidad del ingrediente '${ing.name || `#${i + 1}`}' es obligatoria.`
        );
        setSnackbarOpen(true);
        return;
      }
    }

    onSave(editedFormula);
    onClose();
  };

  if (!editedFormula) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar fórmula</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={editedFormula.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Descripción"
            value={editedFormula.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <TextField
            select
            label="Tipo de mezcla"
            value={editedFormula.mixType}
            onChange={(e) => handleChange("mixType", e.target.value)}
          >
            <MenuItem value="base">Base</MenuItem>
            <MenuItem value="finish">Acabado</MenuItem>
            <MenuItem value="special">Especial</MenuItem>
          </TextField>
          <div style={{ display: "flex", gap: "16px" }}>
          <TextField
            label="Cantidad total (L)"
            type="number"
            value={editedFormula.totalAmount}
            onChange={(e) =>
              handleChange("totalAmount", parseFloat(e.target.value))
            }
          />
          <TextField
            label="Tiempo de secado (min)"
            type="number"
            value={editedFormula.dryingTime}
            onChange={(e) =>
              handleChange("dryingTime", parseInt(e.target.value))
            }
          />
          <TextField
            label="Cobertura (m²/L)"
            type="number"
            value={editedFormula.coverage}
            onChange={(e) =>
              handleChange("coverage", parseFloat(e.target.value))
            }
          />
          </div>

          <Divider />
          <Typography variant="subtitle1">Ingredientes</Typography>
          {editedFormula.ingredients.map((ingredient, index) => (
            <Stack
              direction="row"
              spacing={1}
              key={ingredient.id}
              alignItems="center"
            >
              <TextField
                label="Nombre"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Cantidad"
                type="number"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(
                    index,
                    "quantity",
                    parseFloat(e.target.value)
                  )
                }
                sx={{ width: "120px" }}
              />
              <TextField
                select
                label="Unidad"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                sx={{ width: "120px" }}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="unidades">unidades</MenuItem>
              </TextField>
              <IconButton
                onClick={() => handleRemoveIngredient(index)}
                color="primary"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleAddIngredient}
              sx={{
                maxWidth: "fit-content",
              }}
            >
              Agregar ingrediente
            </Button>
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave}>
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

export default EditFormulaDialog;
