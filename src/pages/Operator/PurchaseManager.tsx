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

function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const PurchaseCards = ({ purchases, onEdit, onDelete }: PurchaseCardsProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        width: "100%",
      }}
    >
      {purchases.map((purchase) => (
        <Paper
          key={purchase.id}
          elevation={3}
          sx={{
            flex: "1 1 320px",
            minWidth: 220,
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {capitalize(`producto: ${purchase.product}`)}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {capitalize(`proveedor: ${purchase.supplier}`)}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {capitalize(`fecha: ${purchase.date}`)}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {capitalize(`cantidad: ${purchase.quantity}`)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {capitalize(`costo total: $${purchase.totalCost.toLocaleString()}`)}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit(purchase)}
            >
              {capitalize("editar")}
            </Button>
            <Tooltip title={capitalize("eliminar")}>
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
  };

  // Ordenar y paginar las compras
  const sortedPurchases = [...purchases].sort((a, b) => {
    if (orderDirection === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });
  const paginatedPurchases = sortedPurchases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: isSmallScreen ? 1 : 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Gestión de Compras
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Registrar compra
        </Button>
      </Stack>
      <PurchaseStatsPanel purchases={purchases} />
      <PurchaseChart purchases={purchases} />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                <TableCell>${purchase.totalCost.toLocaleString()}</TableCell>
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
      <TablePagination
        component="div"
        count={purchases.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Compras por página"
      />
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
