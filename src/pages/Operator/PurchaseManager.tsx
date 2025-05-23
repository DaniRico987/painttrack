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
          <Typography variant="body2" color="text.secondary">
            Proveedor: {purchase.supplier}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fecha: {purchase.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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

  const paginatedPurchases = purchases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" pb={3} gutterBottom>
        Gestor de compras
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
                    <TableCell>Producto</TableCell>
                    <TableCell>Proveedor</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Costo total</TableCell>
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

      <EditPurchaseDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        purchase={selectedPurchase}
        onSave={handleSavePurchase}
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

export default PurchaseManager;
