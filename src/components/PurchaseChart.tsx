import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { Purchase } from "../interfaces/purchase";

interface Props {
  purchases: Purchase[];
}

const PurchaseChart = ({ purchases }: Props) => {
  const theme = useTheme();

  const grouped = purchases.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.product] = (acc[curr.product] || 0) + curr.quantity;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([product, quantity]) => ({
    product,
    quantity,
  }));

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        maxWidth: 1200,
        mx: "auto", // Centrar horizontalmente
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
      >
        Cantidad de productos comprados
      </Typography>
      <Box
        sx={{
          height: { xs: 300, sm: 350, md: 400 }, // altura adaptable según pantalla
          mt: 2,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey="product"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 8,
              }}
              cursor={{ fill: theme.palette.action.hover }}
            />
            <Bar
              dataKey="quantity"
              fill={theme.palette.primary.main}
              radius={[5, 5, 0, 0]}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PurchaseChart;
