import { useEffect, useState } from "react";
import data from "../../data/files/inputs.json";
import { Input } from "../../interfaces/input";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  TablePagination,
  useMediaQuery,
  Stack,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CustomSnackbar from "../../components/CustomSnackbar";
import AlertDialog from "../../components/AlertDialog";
import CreateInputDialog from "../../components/CreateInputDialog";
import EditInputDialog from "../../components/EditInputDialog";

type Order = "asc" | "desc";

const InputManager = () => {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [orderBy, setOrderBy] = useState<keyof Input>("name");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [selectedInput, setSelectedInput] = useState<Input | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("info");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setInputs(data);
  }, []);

  const handleSort = (property: keyof Input) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedInputs = [...inputs].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return order === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createInput = (newInput: Input) => {
    setInputs((prev) => [...prev, newInput]);
    showSnackbar("Insumo creado correctamente", "success");
  };

  const deleteInput = (id: number) => {
    try {
      setInputs((prev) => prev.filter((item) => item.id !== id));
      showSnackbar("Insumo eliminado correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar el insumo:", error);
      showSnackbar("Hubo un error al eliminar el insumo", "error");
    }
  };

  const editInput = (id: number) => {
    const input = inputs.find((item) => item.id === id);
    if (input) {
      setSelectedInput(input);
      setEditDialogOpen(true);
    }
  };

  const handleSaveInput = (updatedInput: Input) => {
    try {
      setInputs((prev) =>
        prev.map((item) => (item.id === updatedInput.id ? updatedInput : item))
      );
      showSnackbar("Insumo actualizado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el insumo:", error);
      showSnackbar("Hubo un error al actualizar el insumo", "error");
    }
  };

  const showSnackbar = (message: string, severity: typeof snackbarSeverity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestor de insumos
      </Typography>
      <Typography variant="body1" gutterBottom>
        Aquí puedes gestionar los insumos utilizados en las fórmulas.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, mt: 2 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        Agregar insumo
      </Button>

      {isMobile ? (
        <Stack spacing={2}>
          {sortedInputs
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <Paper key={item.id} sx={{ p: 2, boxShadow: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Cantidad:</strong> {item.quantity} {item.unit}
                </Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => editInput(item.id)}
                    startIcon={<EditOutlinedIcon />}
                  >
                    Editar
                  </Button>
                  <Tooltip title="Eliminar">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setPendingDeleteId(item.id);
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
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === "name" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell
                  sortDirection={orderBy === "quantity" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "quantity"}
                    direction={orderBy === "quantity" ? order : "asc"}
                    onClick={() => handleSort("quantity")}
                  >
                    Cantidad
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "unitPrice" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "unitPrice"}
                    direction={orderBy === "unitPrice" ? order : "asc"}
                    onClick={() => handleSort("unitPrice")}
                  >
                    Precio por unidad
                  </TableSortLabel>
                </TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedInputs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => editInput(item.id)}
                        startIcon={<EditOutlinedIcon />}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            setPendingDeleteId(item.id);
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={inputs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Insumos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        sx={{ mt: 2 }}
      />

      <AlertDialog
        open={dialogOpen}
        message="¿Estás seguro de que deseas eliminar este insumo?"
        onCancel={() => {
          setDialogOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (pendingDeleteId !== null) {
            deleteInput(pendingDeleteId);
            setPendingDeleteId(null);
          }
          setDialogOpen(false);
        }}
      />

      <CreateInputDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={createInput}
      />

      <EditInputDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        input={selectedInput}
        onSave={handleSaveInput}
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

export default InputManager;
