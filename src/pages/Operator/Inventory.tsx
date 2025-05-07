import { useEffect, useState } from "react";
import data from "../../data/files/inventory.json";
import { Product } from "../../interfaces/product";
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
import EditProductDialog from "../../components/EditProductDialog";
import CustomSnackbar from "../../components/CustomSnackbar";
import AlertDialog from "../../components/AlertDialog";
import CreateProductDialog from "../../components/CreateProductDialog";

type Order = "asc" | "desc";

const Inventory = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [orderBy, setOrderBy] = useState<keyof Product>("name");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Dialog para eliminar
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  //Dialog para editar
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  //Dialog para crear
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  //Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("info");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setInventory(data);
  }, []);

  const handleSort = (property: keyof Product) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedInventory = [...inventory].sort((a, b) => {
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

  const CreateProduct = (newProduct: Product) => {
    setInventory((prev) => [...prev, newProduct]);
    showSnackbar("Producto creado correctamente", "success");
  };

  const deleteProduct = (id: number) => {
    try {
      setInventory((prev) => prev.filter((item) => item.id !== id));
      showSnackbar("Producto eliminado correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      showSnackbar("Hubo un error al eliminar el producto", "error");
    }
  };

  const editProduct = (id: number) => {
    const product = inventory.find((item) => item.id === id);
    if (product) {
      setSelectedProduct(product);
      setEditDialogOpen(true);
    }
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    try {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item
        )
      );
      showSnackbar("Producto actualizado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      showSnackbar("Hubo un error al actualizar el producto", "error");
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
        Inventario
      </Typography>
      <Typography variant="body1" gutterBottom>
        En esta sección podrás gestionar el inventario actual de la fábrica.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, mt: 2 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        Agregar producto
      </Button>

      {isMobile ? (
        <Stack spacing={2}>
          {sortedInventory
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <Paper key={item.id} sx={{ p: 2, boxShadow: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Cantidad:</strong> {item.quantity}
                </Typography>
                <Typography variant="body2">
                  <strong>Precio por unidad:</strong> $
                  {item.unitPrice.toFixed(2)}
                </Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => editProduct(item.id)}
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
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: "10px" }}
        >
          <Table sx={{ borderRadius: "10px" }}>
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
                  sx={{ minWidth: "140px" }}
                >
                  <TableSortLabel
                    active={orderBy === "unitPrice"}
                    direction={orderBy === "unitPrice" ? order : "asc"}
                    onClick={() => handleSort("unitPrice")}
                  >
                    Precio por unidad
                  </TableSortLabel>
                </TableCell>

                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedInventory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell sx={{ maxWidth: "200px" }}>
                      {item.description}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{ minWidth: "160px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => editProduct(item.id)}
                        startIcon={<EditOutlinedIcon />}
                        sx={{ mr: 1 }}
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
        count={inventory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Productos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        sx={{
          mt: 2,
          maxWidth: "100%",
          "& .MuiTablePagination-toolbar": {
            flexWrap: {
              xs: "wrap", // móviles: envolver
              sm: "nowrap", // escritorio: mantener en línea
            },
            justifyContent: {
              xs: "space-between",
              sm: "flex-end",
            },
            gap: 1,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "0.9rem",
            },
        }}
      />
      <AlertDialog
        open={dialogOpen}
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        onCancel={() => {
          setDialogOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (pendingDeleteId !== null) {
            deleteProduct(pendingDeleteId);
            setPendingDeleteId(null);
          }
          setDialogOpen(false);
        }}
      />

      <CreateProductDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={CreateProduct}
      />

      <EditProductDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
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

export default Inventory;
