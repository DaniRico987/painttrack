import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import logsData from "../../data/files/logs.json";

function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const Monitor = () => {
  const [logs] = useState(logsData);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {capitalize("monitor de actividad")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {capitalize(
          "visualiza la actividad reciente, logs y auditoría del sistema."
        )}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {capitalize("actividad reciente")}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{capitalize("usuario")}</TableCell>
                <TableCell>{capitalize("acción")}</TableCell>
                <TableCell>{capitalize("fecha")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
export default Monitor;
