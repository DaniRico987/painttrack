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
import { Props } from "../interfaces/purchase";

const PurchaseChart = ({ purchases }: Props) => {
  const theme = useTheme();

  const N = 10; // cantidad de compras recientes a mostrar

  // Ordena por fecha descendente (más reciente primero)
  const sortedPurchases = [...purchases].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Toma las últimas N compras (más recientes)
  const recentPurchases = sortedPurchases.slice(0, N);

  // Agrupa la cantidad total por producto SOLO en esas compras recientes
  const grouped = recentPurchases.reduce<Record<string, number>>(
    (acc, curr) => {
      acc[curr.product] = (acc[curr.product] || 0) + curr.quantity;
      return acc;
    },
    {}
  );

  // Crea el arreglo de datos para el gráfico
  const data = Object.entries(grouped).map(([product, quantity]) => ({
    product,
    quantity,
  }));

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
    if (active && payload && payload.length) {
      const maxWidth = 150;
      let transformStyle = "translate(-50%, -100%)";

      if (coordinate && coordinate.x > window.innerWidth - maxWidth) {
        transformStyle = "translate(0, -100%)";
      }

      return (
        <Paper
          elevation={3}
          sx={{
            padding: "8px 12px",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: theme.shadows[3],
            position: "absolute",
            left: coordinate.x,
            top: 10,
            transform: transformStyle,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 9999,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {label}
          </Typography>
          <Typography variant="body2">Cantidad: {payload[0].value}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      sx={{
        pt: 3,
        pl: 2,
        pr: 2,
        pb: 0,
        borderRadius: 3,
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
      >
        Cantidad de productos comprados (últimas {N} compras)
      </Typography>
      <Box
        sx={{
          height: { xs: 300, sm: 350, md: 400 },
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
              tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: theme.palette.text.primary }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: theme.palette.action.hover }}
              animationEasing="ease-in-out"
              animationDuration={300}
              position={{ y: 0 }}
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
