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
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomSnackbar from "./CustomSnackbar";

interface CreateFormulaDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newFormula: Formula) => void;
}

const defaultIngredient: Ingredient = {
  id: 0,
  name: "",
  quantity: 0,
  unit: "kg",
};

const CreateFormulaDialog = ({
  open,
  onClose,
  onCreate,
}: CreateFormulaDialogProps) => {
  const [newFormula, setNewFormula] = useState<Formula>({
    id: Date.now(), // temporalmente único
    name: "",
    description: "",
    mixType: "base",
    totalAmount: 0,
    dryingTime: 0,
    coverage: 0,
    ingredients: [defaultIngredient],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (field: keyof Formula, value: any) => {
    setNewFormula((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: any
  ) => {
    const updatedIngredients = [...newFormula.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setNewFormula((prev) => ({
      ...prev,
      ingredients: updatedIngredients,
    }));
  };

  const handleAddIngredient = () => {
    setNewFormula((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          ...defaultIngredient,
          id: Date.now() + Math.random(), // único
        },
      ],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...newFormula.ingredients];
    updatedIngredients.splice(index, 1);
    setNewFormula((prev) => ({
      ...prev,
      ingredients: updatedIngredients,
    }));
  };

  const isFormValid =
    newFormula.name.trim() !== "" &&
    newFormula.description.trim() !== "" &&
    newFormula.totalAmount > 0 &&
    newFormula.dryingTime > 0 &&
    newFormula.coverage > 0 &&
    newFormula.ingredients.length > 0 &&
    newFormula.ingredients.every(
      (ing) =>
        ing.name.trim() !== "" &&
        ing.quantity > 0 &&
        ing.unit.trim() !== ""
    );

  const handleSubmit = () => {
    // Validaciones específicas y mensajes detallados
    if (newFormula.name.trim() === "") {
      setSnackbarMessage("El campo 'Nombre' de la fórmula es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (newFormula.description.trim() === "") {
      setSnackbarMessage("El campo 'Descripción' de la fórmula es obligatorio.");
      setSnackbarOpen(true);
      return;
    }
    if (newFormula.totalAmount <= 0) {
      setSnackbarMessage("La 'Cantidad total' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (newFormula.dryingTime <= 0) {
      setSnackbarMessage("El 'Tiempo de secado' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (newFormula.coverage <= 0) {
      setSnackbarMessage("La 'Cobertura' debe ser mayor a 0.");
      setSnackbarOpen(true);
      return;
    }
    if (newFormula.ingredients.length === 0) {
      setSnackbarMessage("Debes agregar al menos un ingrediente.");
      setSnackbarOpen(true);
      return;
    }
    for (let i = 0; i < newFormula.ingredients.length; i++) {
      const ing = newFormula.ingredients[i];
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

    onCreate(newFormula);
    onClose();
    setNewFormula({
      ...newFormula,
      id: Date.now(),
      name: "",
      description: "",
      mixType: "base",
      totalAmount: 0,
      dryingTime: 0,
      coverage: 0,
      ingredients: [defaultIngredient],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva fórmula</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={newFormula.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="Descripción"
            value={newFormula.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <TextField
            select
            label="Tipo de mezcla"
            value={newFormula.mixType}
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
              value={newFormula.totalAmount}
              onChange={(e) =>
                handleChange("totalAmount", parseFloat(e.target.value))
              }
            />
            <TextField
              label="Tiempo de secado (min)"
              type="number"
              value={newFormula.dryingTime}
              onChange={(e) =>
                handleChange("dryingTime", parseInt(e.target.value))
              }
            />
            <TextField
              label="Cobertura (m²/L)"
              type="number"
              value={newFormula.coverage}
              onChange={(e) =>
                handleChange("coverage", parseFloat(e.target.value))
              }
            />
          </div>

          <Divider />
          <Typography variant="subtitle1">Ingredientes</Typography>
          {newFormula.ingredients.map((ingredient, index) => (
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
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default CreateFormulaDialog;
