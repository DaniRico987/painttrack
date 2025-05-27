import { Box, Paper, Typography } from "@mui/material";
import { Sale } from "../interfaces/sale";

const SaleStatsPanel = ({ sales }: { sales: Sale[] }) => {
  const totalSales = sales.length;
  const totalUnits = sales.reduce((sum, s) => sum + s.quantity, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);

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
          label: "Ventas totales",
          value: totalSales,
        },
        {
          label: "Unidades vendidas",
          value: totalUnits,
        },
        {
          label: "Ingresos",
          value: `$${totalRevenue.toLocaleString()}`,
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

export default SaleStatsPanel;
