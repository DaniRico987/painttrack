import { Box, Paper, Typography } from "@mui/material";
import { Purchase } from "../interfaces/purchase";

interface Props {
  purchases: Purchase[];
}

const PurchaseStatsPanel = ({ purchases }: Props) => {
  const totalPurchases = purchases.length;
  const totalQuantity = purchases.reduce((acc, p) => acc + p.quantity, 0);
  const totalCost = purchases.reduce((acc, p) => acc + p.totalCost, 0);
  const suppliers = new Set(purchases.map((p) => p.supplier)).size;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
        justifyContent: "center",
      }}
    >
      {[
        {
          label: "Compras totales",
          value: totalPurchases,
        },
        {
          label: "Cantidad total",
          value: totalQuantity,
        },
        {
          label: "Gasto total",
          value: `$${totalCost.toFixed(2)}`,
        },
        {
          label: "Proveedores únicos",
          value: suppliers,
        },
      ].map((stat) => (
        <Paper
          key={stat.label}
          sx={{
            flex: "1 1 200px",
            p: 2,
            textAlign: "center",
            minWidth: 200,
            maxWidth: 300,
          }}
        >
          <Typography variant="h6">{stat.label}</Typography>
          <Typography variant="h5" color="primary">
            {stat.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default PurchaseStatsPanel;
