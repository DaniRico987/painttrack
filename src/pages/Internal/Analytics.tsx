import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  useTheme,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { Input } from "../../interfaces/input";
import { Product } from "../../interfaces/product";
import { Purchase } from "../../interfaces/purchase";
import { Sale } from "../../interfaces/sale";
import { Formula } from "../../interfaces/formula";

// Label personalizado para PieChart
const renderPieLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, name } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const labelMap: { [key: string]: string } = {
    name: "Nombre",
    quantity: "Cantidad",
    price: "Precio Unitario",
    value: "Valor",
    revenue: "Ingresos",
    cost: "Costo",
    date: "Fecha",
  };
  let translated = name;
  if (labelMap[name]) {
    translated = labelMap[name];
  }
  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={16}
      fontWeight="bold"
      style={{ pointerEvents: "none" }}
    >
      {`${translated} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Analytics = () => {
  const theme = useTheme();
  const [inputs, setInputs] = useState<Input[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>([]);

  // Simulación de datos (en producción vendría de una API)
  useEffect(() => {
    // Datos de ejemplo para análisis
    const mockInputs: Input[] = [
      {
        id: 1,
        name: "Pigmento Azul",
        description: "Pigmento azul cobalto",
        quantity: 150,
        unitPrice: 25.5,
        type: "Sólido",
        unit: "kg",
      },
      {
        id: 2,
        name: "Resina Acrílica",
        description: "Resina base acrílica",
        quantity: 200,
        unitPrice: 18.75,
        type: "Líquido",
        unit: "L",
      },
      {
        id: 3,
        name: "Solvente",
        description: "Solvente universal",
        quantity: 100,
        unitPrice: 12.3,
        type: "Líquido",
        unit: "L",
      },
    ];

    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Pintura Azul Premium",
        description: "Pintura azul de alta calidad",
        quantity: 80,
        unitPrice: 45.0,
      },
      {
        id: 2,
        name: "Pintura Blanca Base",
        description: "Pintura blanca universal",
        quantity: 120,
        unitPrice: 35.0,
      },
      {
        id: 3,
        name: "Pintura Roja Mate",
        description: "Pintura roja acabado mate",
        quantity: 60,
        unitPrice: 42.0,
      },
    ];

    const mockPurchases: Purchase[] = [
      {
        id: 1,
        product: "Pigmento Azul",
        supplier: "QuímicaColor SA",
        date: "2024-01-15",
        quantity: 50,
        totalCost: 1275.0,
      },
      {
        id: 2,
        product: "Resina Acrílica",
        supplier: "Resinas del Norte",
        date: "2024-01-20",
        quantity: 100,
        totalCost: 1875.0,
      },
      {
        id: 3,
        product: "Solvente",
        supplier: "Químicos Unidos",
        date: "2024-01-25",
        quantity: 75,
        totalCost: 922.5,
      },
    ];

    const mockSales: Sale[] = [
      {
        id: 1,
        client: "Pinturas del Centro",
        product: "Pintura Azul Premium",
        date: "2024-01-16",
        quantity: 20,
        totalPrice: 900.0,
      },
      {
        id: 2,
        client: "Constructora ABC",
        product: "Pintura Blanca Base",
        date: "2024-01-18",
        quantity: 30,
        totalPrice: 1050.0,
      },
      {
        id: 3,
        client: "Decoraciones Elite",
        product: "Pintura Roja Mate",
        date: "2024-01-22",
        quantity: 15,
        totalPrice: 630.0,
      },
    ];

    const mockFormulas: Formula[] = [
      {
        id: 1,
        name: "Azul Premium",
        description: "Fórmula para pintura azul premium",
        mixType: "base",
        totalAmount: 100,
        dryingTime: 120,
        coverage: 12,
        ingredients: [
          { id: 1, name: "Pigmento Azul", quantity: 15, unit: "kg" },
          { id: 2, name: "Resina Acrílica", quantity: 70, unit: "L" },
          { id: 3, name: "Solvente", quantity: 15, unit: "L" },
        ],
      },
    ];

    setInputs(mockInputs);
    setProducts(mockProducts);
    setPurchases(mockPurchases);
    setSales(mockSales);
    setFormulas(mockFormulas);
  }, []);

  // Cálculos de métricas
  const totalInventoryValue = inputs.reduce(
    (sum, input) => sum + input.quantity * input.unitPrice,
    0
  );
  const totalSalesRevenue = sales.reduce(
    (sum, sale) => sum + sale.totalPrice,
    0
  );
  const totalPurchaseCosts = purchases.reduce(
    (sum, purchase) => sum + purchase.totalCost,
    0
  );
  const totalProductsInStock = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const profitMargin =
    totalSalesRevenue > 0
      ? ((totalSalesRevenue - totalPurchaseCosts) / totalSalesRevenue) * 100
      : 0;

  // Datos para gráficos
  const salesTrendData = sales.map((sale) => ({
    date: new Date(sale.date).toLocaleDateString(),
    revenue: sale.totalPrice,
    quantity: sale.quantity,
  }));

  const purchaseTrendData = purchases.map((purchase) => ({
    date: new Date(purchase.date).toLocaleDateString(),
    cost: purchase.totalCost,
    quantity: purchase.quantity,
  }));

  const inventoryData = inputs.map((input) => ({
    name: input.name,
    value: input.quantity * input.unitPrice,
    quantity: input.quantity,
  }));

  const productDistribution = products.map((product) => ({
    name: product.name,
    value: product.quantity,
    price: product.unitPrice,
  }));

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    // Traducción de etiquetas para tooltip
    const labelTranslations: Record<string, string> = {
      name: "Nombre",
      quantity: "Cantidad",
      price: "Precio Unitario",
      value: "Valor",
      revenue: "Ingresos",
      cost: "Costo",
      date: "Fecha",
      Ventas: "Ingresos por Ventas",
      Compras: "Costos de Compras",
      Unidades: "Unidades",
      Activos: "Activos",
      Egresos: "Egresos",
      Rentabilidad: "Rentabilidad",
    };
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            padding: "12px",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {labelTranslations[label] || label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {(labelTranslations[entry.name] || entry.name) + ": "}
              {typeof entry.value === "number"
                ? `$${entry.value.toFixed(2)}`
                : entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Análisis y reportes
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Dashboard completo con métricas clave del negocio y tendencias de
        mercado
      </Typography>

      {/* Métricas Principales */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Card sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom variant="subtitle2">
              Valor total inventario
            </Typography>
            <Typography variant="h5" component="div" color="primary">
              ${totalInventoryValue.toLocaleString()}
            </Typography>
            <Chip label="Activos" color="success" size="small" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom variant="subtitle2">
              Ingresos por ventas
            </Typography>
            <Typography variant="h5" component="div" color="success.main">
              ${totalSalesRevenue.toLocaleString()}
            </Typography>
            <Chip
              label="Ingresos"
              color="success"
              size="small"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom variant="subtitle2">
              Costos de compras
            </Typography>
            <Typography variant="h5" component="div" color="error.main">
              ${totalPurchaseCosts.toLocaleString()}
            </Typography>
            <Chip label="Egresos" color="error" size="small" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom variant="subtitle2">
              Productos en stock
            </Typography>
            <Typography variant="h5" component="div" color="info.main">
              {totalProductsInStock.toLocaleString()}
            </Typography>
            <Chip label="Unidades" color="info" size="small" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 220px", minWidth: 220 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom variant="subtitle2">
              Margen de ganancia
            </Typography>
            <Typography variant="h5" component="div" color="warning.main">
              {profitMargin.toFixed(1)}%
            </Typography>
            <Chip
              label="Rentabilidad"
              color={
                profitMargin > 20
                  ? "success"
                  : profitMargin > 10
                  ? "warning"
                  : "error"
              }
              size="small"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Gráficos Principales */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Paper sx={{ flex: "1 1 400px", minWidth: 320, p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Tendencia de ventas
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={salesTrendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme.palette.action.hover }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={theme.palette.success.main}
                fill={theme.palette.success.light}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ flex: "1 1 400px", minWidth: 320, p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Tendencia de compras
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={purchaseTrendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme.palette.action.hover }}
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke={theme.palette.error.main}
                fill={theme.palette.error.light}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Análisis de Inventario y Distribución */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Paper sx={{ flex: "2 1 500px", minWidth: 320, p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Valor del inventario por insumo
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={inventoryData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme.palette.action.hover }}
              />
              <Bar
                dataKey="value"
                fill={theme.palette.primary.main}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ flex: "1 1 320px", minWidth: 220, p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Distribución de productos
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {productDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme.palette.action.hover }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Comparación de Tendencias */}
      <Box sx={{ width: "100%", mb: 4 }}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Análisis comparativo de flujo de caja
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={[
                {
                  name: "Enero",
                  ventas: totalSalesRevenue,
                  compras: totalPurchaseCosts,
                },
              ]}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.primary }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme.palette.action.hover }}
              />
              <Legend />
              <Bar
                dataKey="ventas"
                fill={theme.palette.success.main}
                name="Ingresos por Ventas"
              />
              <Bar
                dataKey="compras"
                fill={theme.palette.error.main}
                name="Costos de Compras"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Resumen de Rendimiento */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen de rendimiento del negocio
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Typography variant="body1">
            <strong>Análisis de rentabilidad:</strong> El margen de ganancia
            actual es del {profitMargin.toFixed(1)}%,
            {profitMargin > 20
              ? " lo cual indica un excelente rendimiento del negocio."
              : profitMargin > 10
              ? " lo cual indica un rendimiento aceptable con oportunidades de mejora."
              : " lo cual indica la necesidad de optimizar costos o aumentar precios."}
          </Typography>
          <Typography variant="body1">
            <strong>Estado del inventario:</strong> El valor total del
            inventario asciende a ${totalInventoryValue.toLocaleString()},
            distribuido en {inputs.length} tipos de insumos diferentes.
          </Typography>
          <Typography variant="body1">
            <strong>Flujo de caja:</strong> Los ingresos por ventas ($
            {totalSalesRevenue.toLocaleString()})
            {totalSalesRevenue > totalPurchaseCosts
              ? " superan"
              : " no superan"}{" "}
            los costos de compras (${totalPurchaseCosts.toLocaleString()}),
            generando un{" "}
            {totalSalesRevenue > totalPurchaseCosts
              ? "flujo positivo"
              : "flujo negativo"}{" "}
            de $
            {Math.abs(totalSalesRevenue - totalPurchaseCosts).toLocaleString()}.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Analytics;
