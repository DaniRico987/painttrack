import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Paper,
  TableContainer,
  TablePagination,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import formulasData from "../../data/files/formulas.json";
import AlertDialog from "../../components/AlertDialog";
import CustomSnackbar from "../../components/CustomSnackbar";
import CreateFormulaDialog from "../../components/CreateFormulaDialog";
import EditFormulaDialog from "../../components/EditFormulaDialog";

const FormulaManager = () => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (formula: Formula) => {
    setSelectedFormula(formula);
    setEditDialogOpen(true);
  };

  const handleSaveFormula = (updated: Formula) => {
    setFormulas((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setSnackbarMessage("Fórmula actualizada correctamente");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCreateFormula = (newFormula: Formula) => {
    setFormulas((prev) => [...prev, newFormula]);
    setSnackbarMessage("Fórmula creada correctamente");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const mixTypeLabels: Record<string, string> = {
    base: "Base",
    finish: "Acabado",
    special: "Especial",
  };

  const deleteFormula = (id: number) => {
    try {
      setFormulas((prev) => prev.filter((f) => f.id !== id));
      setSnackbarMessage("Fórmula eliminada correctamente");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Error al eliminar la fórmula");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const paginatedFormulas = formulas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestor de fórmulas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        Agregar fórmula
      </Button>

      {isMobile ? (
        <Stack spacing={2}>
          {paginatedFormulas.map((f) => (
            <Paper key={f.id} sx={{ p: 2 }}>
              <Typography variant="h6">{f.name}</Typography>
              <Typography>
                <strong>Tipo:</strong> {mixTypeLabels[f.mixType]}
              </Typography>
              <Typography>
                <strong>Total:</strong> {f.totalAmount} L
              </Typography>
              <Typography>
                <strong>Secado:</strong> {f.dryingTime} min
              </Typography>
              <Typography>
                <strong>Cobertura:</strong> {f.coverage} m²/L
              </Typography>
              <Typography>
                <strong>Ingredientes:</strong> {f.ingredients.length}
              </Typography>
              <Typography>
                <strong>Descripción:</strong>{" "}
                {f.description.length > 60
                  ? f.description.slice(0, 60) + "..."
                  : f.description}
              </Typography>
              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(f)}
                  startIcon={<EditOutlinedIcon />}
                >
                  Editar
                </Button>
                <Tooltip title="Eliminar">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setPendingDeleteId(f.id);
                      setDialogOpen(true);
                    }}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad total (L)</TableCell>
                <TableCell>Tiempo secado (min)</TableCell>
                <TableCell>Cobertura (m²/L)</TableCell>
                <TableCell>Ingredientes</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFormulas.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{mixTypeLabels[f.mixType]}</TableCell>
                  <TableCell>{f.totalAmount}</TableCell>
                  <TableCell>{f.dryingTime}</TableCell>
                  <TableCell>{f.coverage}</TableCell>
                  <TableCell>{f.ingredients.length}</TableCell>
                  <TableCell>
                    {f.description.length > 40
                      ? f.description.slice(0, 40) + "..."
                      : f.description}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(f)}
                      startIcon={<EditOutlinedIcon />}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          setPendingDeleteId(f.id);
                          setDialogOpen(true);
                        }}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={formulas.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Fórmulas por página"
        sx={{
          mt: 2,
          maxWidth: "100%",
          "& .MuiTablePagination-toolbar": {
            flexWrap: { xs: "wrap", sm: "nowrap" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
            gap: 1,
          },
        }}
      />

      <AlertDialog
        open={dialogOpen}
        message="¿Estás seguro de que deseas eliminar esta fórmula?"
        onCancel={() => {
          setDialogOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (pendingDeleteId !== null) deleteFormula(pendingDeleteId);
          setPendingDeleteId(null);
          setDialogOpen(false);
        }}
      />

      <CreateFormulaDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateFormula}
      />

      <EditFormulaDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        product={selectedFormula}
        onSave={handleSaveFormula}
      />

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default FormulaManager;
