import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Divider,
  TablePagination,
  Stack,
} from "@mui/material";
import formulasData from "../../data/files/formulas.json";

const Formulas = () => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setFormulas(
      formulasData.map((formula) => ({
        ...formula,
        mixType: formula.mixType as "base" | "finish" | "special",
        ingredients: formula.ingredients.map((ingredient) => ({
          ...ingredient,
          unit: ingredient.unit as "kg" | "g" | "ml" | "L" | "unidades",
        })),
      }))
    );
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Busca las formulas por todos los campos
  const filteredFormulas = formulas.filter(
    (formula) =>
      // Busca en los campos principales de la fórmula (nombre, descripción, tipo de mezcla, etc.)
      formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.mixType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.totalAmount.toString().includes(searchTerm) ||
      formula.dryingTime.toString().includes(searchTerm) ||
      formula.coverage.toString().includes(searchTerm) ||
      // Busca en los ingredientes (nombre, cantidad y unidad)
      formula.ingredients.some(
        (ingredient) =>
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ingredient.quantity.toString().includes(searchTerm) ||
          ingredient.unit.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const mixTypeLabels: Record<string, string> = {
    base: "Base",
    finish: "Acabado",
    special: "Especial",
  };

  const paginatedFormulas = filteredFormulas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fórmulas de Pintura
      </Typography>

      <TextField
        label="Buscar fórmula"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {paginatedFormulas.map((formula) => (
        <Paper key={formula.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{formula.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formula.description}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Tipo de mezcla:</strong> {mixTypeLabels[formula.mixType]}
          </Typography>
          <Typography>
            <strong>Cantidad total:</strong> {formula.totalAmount} litros
          </Typography>
          <Typography>
            <strong>Tiempo de secado:</strong> {formula.dryingTime} minutos
          </Typography>
          <Typography>
            <strong>Cobertura:</strong> {formula.coverage} m² por litro
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Ingredientes:</Typography>
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            {formula.ingredients.map((ingredient) => (
              <Typography key={ingredient.id}>
                • {ingredient.name} - {ingredient.quantity} {ingredient.unit}
              </Typography>
            ))}
          </Stack>
        </Paper>
      ))}

      <TablePagination
        component="div"
        count={filteredFormulas.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Fórmulas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        sx={{
          mt: 2,
          "& .MuiTablePagination-toolbar": {
            flexWrap: { xs: "wrap", sm: "nowrap" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
            gap: 1,
          },
        }}
      />
    </Box>
  );
};

export default Formulas;
