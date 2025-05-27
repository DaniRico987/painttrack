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
  Paper,
  TableContainer,
  TablePagination,
  Stack,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  TableSortLabel,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Purchase, PurchaseCardsProps } from "../../interfaces/purchase";
import data from "../../data/files/purchases.json";
import CustomSnackbar from "../../components/CustomSnackbar";
import AlertDialog from "../../components/AlertDialog";
import CreatePurchaseDialog from "../../components/CreatePurchaseDialog";
import EditPurchaseDialog from "../../components/EditPurchaseDialog";
import PurchaseStatsPanel from "../../components/PurchaseStatsPanel";
import PurchaseChart from "../../components/PurchaseChart";

const PurchaseCards = ({ purchases, onEdit, onDelete }: PurchaseCardsProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
        },
        width: "100%",
      }}
    >
      {purchases.map((purchase) => (
        <Paper
          key={purchase.id}
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Producto: {purchase.product}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Proveedor: {purchase.supplier}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Fecha: {purchase.date}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Cantidad: {purchase.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Costo total: ${purchase.totalCost.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit(purchase)}
            >
              Editar
            </Button>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => onDelete(purchase.id)}>
                <DeleteOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

const PurchaseManager = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Estados para ordenar
  const [orderBy, setOrderBy] = useState<keyof Purchase>("date");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setPurchases(data);
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

  const handleCreatePurchase = (newPurchase: Purchase) => {
    setPurchases((prev) => [...prev, newPurchase]);
    showSnackbar("Compra registrada correctamente", "success");
  };

  const handleEdit = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setEditDialogOpen(true);
  };

  const handleSavePurchase = (updated: Purchase) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showSnackbar("Compra actualizada correctamente", "success");
  };

  const deletePurchase = (id: number) => {
    try {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      showSnackbar("Compra eliminada correctamente", "success");
    } catch (err) {
      showSnackbar("Error al eliminar la compra", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Manejar ordenamiento
  const handleSort = (field: keyof Purchase) => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("asc");
    }
    setPage(0);
  };

  // Ordenar antes de paginar
  const sortedPurchases = [...purchases].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (orderBy === "date") {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (aValue < bValue) return orderDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return orderDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedPurchases = sortedPurchases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestor de compras
      </Typography>
      <Typography variant="subtitle1" pb={3} color="text.primary">
        Visualiza, registra y administra todas las compras realizadas de insumos
        y materiales.
      </Typography>

      <PurchaseStatsPanel purchases={purchases} />
      <PurchaseChart purchases={purchases} />

      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        Registrar compra
      </Button>

      {isSmallScreen ? (
        <PurchaseCards
          purchases={paginatedPurchases}
          onEdit={handleEdit}
          onDelete={(id) => {
            setPendingDeleteId(id);
            setDialogOpen(true);
          }}
        />
      ) : (
        <>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "product"}
                        direction={orderDirection}
                        onClick={() => handleSort("product")}
                      >
                        Producto
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "supplier"}
                        direction={orderDirection}
                        onClick={() => handleSort("supplier")}
                      >
                        Proveedor
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "date"}
                        direction={orderDirection}
                        onClick={() => handleSort("date")}
                      >
                        Fecha
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "quantity"}
                        direction={orderDirection}
                        onClick={() => handleSort("quantity")}
                      >
                        Cantidad
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "totalCost"}
                        direction={orderDirection}
                        onClick={() => handleSort("totalCost")}
                      >
                        Costo total
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.product}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>
                        ${purchase.totalCost.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => handleEdit(purchase)}
                        >
                          Editar
                        </Button>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              setPendingDeleteId(purchase.id);
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
          </Box>

          <TablePagination
            component="div"
            count={purchases.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Compras por página"
          />
        </>
      )}

      <AlertDialog
        open={dialogOpen}
        message="¿Estás seguro de que deseas eliminar esta compra?"
        onCancel={() => {
          setDialogOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (pendingDeleteId !== null) deletePurchase(pendingDeleteId);
          setPendingDeleteId(null);
          setDialogOpen(false);
        }}
      />

      <CreatePurchaseDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreatePurchase}
      />

      {selectedPurchase && (
        <EditPurchaseDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedPurchase(null);
          }}
          purchase={selectedPurchase}
          onSave={handleSavePurchase}
        />
      )}

      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default PurchaseManager;
