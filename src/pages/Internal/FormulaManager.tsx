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
  TableSortLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import formulasData from "../../data/files/formulas.json";
import AlertDialog from "../../components/AlertDialog";
import CustomSnackbar from "../../components/CustomSnackbar";
import CreateFormulaDialog from "../../components/CreateFormulaDialog";
import EditFormulaDialog from "../../components/EditFormulaDialog";

type Order = "asc" | "desc";

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

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Formula>("name");

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

  const handleRequestSort = (property: keyof Formula) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const stableSort = <T,>(array: T[], comparator: (a: T, b: T) => number) => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (
    order: Order,
    orderBy: keyof Formula
  ): ((a: Formula, b: Formula) => number) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (
    a: Formula,
    b: Formula,
    orderBy: keyof Formula
  ) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return bValue.localeCompare(aValue);
    }

    // Fallback para otros tipos o si no son comparables, no cambia el orden
    return 0;
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

  // Ordenar fórmulas antes de paginar
  const sortedFormulas = stableSort(formulas, getComparator(order, orderBy));

  const paginatedFormulas = sortedFormulas.slice(
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
                <TableCell sortDirection={orderBy === "name" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sortDirection={orderBy === "mixType" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "mixType"}
                    direction={orderBy === "mixType" ? order : "asc"}
                    onClick={() => handleRequestSort("mixType")}
                  >
                    Tipo
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sortDirection={orderBy === "totalAmount" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "totalAmount"}
                    direction={orderBy === "totalAmount" ? order : "asc"}
                    onClick={() => handleRequestSort("totalAmount")}
                  >
                    Cantidad total (L)
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sortDirection={orderBy === "dryingTime" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "dryingTime"}
                    direction={orderBy === "dryingTime" ? order : "asc"}
                    onClick={() => handleRequestSort("dryingTime")}
                  >
                    Tiempo secado (min)
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sortDirection={orderBy === "coverage" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "coverage"}
                    direction={orderBy === "coverage" ? order : "asc"}
                    onClick={() => handleRequestSort("coverage")}
                  >
                    Cobertura (m²/L)
                  </TableSortLabel>
                </TableCell>

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
