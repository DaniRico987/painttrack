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

interface CreateFormulaDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newFormula: Formula) => void;
}

const defaultIngredient: Ingredient = {
  id: 0,
  name: "",
  quantity: 0,
  unit: "g",
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

  const handleSubmit = () => {
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
        <Stack spacing={2}>
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
          <Button onClick={handleAddIngredient}>Agregar ingrediente</Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFormulaDialog;
