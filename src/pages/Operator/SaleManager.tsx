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
import { Sale, SaleCardsProps } from "../../interfaces/sale";
import data from "../../data/files/sales.json";
import CustomSnackbar from "../../components/CustomSnackbar";
import AlertDialog from "../../components/AlertDialog";
import CreateSaleDialog from "../../components/CreateSaleDialog";
import EditSaleDialog from "../../components/EditSaleDialog";
import SaleStatsPanel from "../../components/SaleStatsPanel";
import SaleChart from "../../components/SaleChart";

const SaleCards = ({ sales, onEdit, onDelete }: SaleCardsProps) => {
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
      {sales.map((sale) => (
        <Paper
          key={sale.id}
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Producto: {sale.product}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Cliente: {sale.client}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Fecha: {sale.date}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Cantidad: {sale.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingreso total: ${sale.totalPrice.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit(sale)}
            >
              Editar
            </Button>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => onDelete(sale.id)}>
                <DeleteOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

const SaleManager = () => {
  const [sales, setSales] = useState<Sale[]>([]);
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
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [orderBy, setOrderBy] = useState<keyof Sale>("date");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setSales(data);
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleCreateSale = (newSale: Sale) => {
    setSales((prev) => [...prev, newSale]);
    showSnackbar("Venta registrada correctamente", "success");
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setEditDialogOpen(true);
  };

  const handleSaveSale = (updated: Sale) => {
    setSales((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showSnackbar("Venta actualizada correctamente", "success");
  };

  const deleteSale = (id: number) => {
    try {
      setSales((prev) => prev.filter((s) => s.id !== id));
      showSnackbar("Venta eliminada correctamente", "success");
    } catch {
      showSnackbar("Error al eliminar la venta", "error");
    }
  };

  const showSnackbar = (msg: string, sev: "success" | "error") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(sev);
    setSnackbarOpen(true);
  };

  const handleSort = (field: keyof Sale) => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("asc");
    }
    setPage(0);
  };

  const sortedSales = [...sales].sort((a, b) => {
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

  const paginatedSales = sortedSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestor de ventas
      </Typography>
      <Typography variant="subtitle1" pb={3} color="text.primary">
        Visualiza, registra y administra todas las ventas realizadas de
        productos.
      </Typography>

      <SaleStatsPanel sales={sales} />
      <SaleChart sales={sales} />

      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        Registrar venta
      </Button>

      {isSmallScreen ? (
        <SaleCards
          sales={paginatedSales}
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
                        active={orderBy === "client"}
                        direction={orderDirection}
                        onClick={() => handleSort("client")}
                      >
                        Cliente
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
                        active={orderBy === "totalPrice"}
                        direction={orderDirection}
                        onClick={() => handleSort("totalPrice")}
                      >
                        Ingreso total
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.client}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>${sale.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => handleEdit(sale)}
                        >
                          Editar
                        </Button>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              setPendingDeleteId(sale.id);
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
            count={sales.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Ventas por página"
          />
        </>
      )}

      <AlertDialog
        open={dialogOpen}
        message="¿Estás seguro de que deseas eliminar esta venta?"
        onCancel={() => {
          setDialogOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => {
          if (pendingDeleteId !== null) deleteSale(pendingDeleteId);
          setPendingDeleteId(null);
          setDialogOpen(false);
        }}
      />

      <CreateSaleDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateSale}
      />

      {selectedSale && (
        <EditSaleDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedSale(null);
          }}
          sale={selectedSale}
          onSave={handleSaveSale}
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

export default SaleManager;
