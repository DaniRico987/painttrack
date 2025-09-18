import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import rolesData from "../../data/files/roles.json";

function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const RolesManager = () => {
  const [roles, setRoles] = useState(rolesData);
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewRole({ name: "", permissions: "" });
  };
  const handleChange = (e: any) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value });
  };
  const handleAddRole = () => {
    setRoles([
      ...roles,
      {
        id: roles.length + 1,
        name: newRole.name,
        permissions: newRole.permissions
          .split(",")
          .map((p: string) => p.trim()),
      },
    ]);
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {capitalize("gestor de roles")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {capitalize("administra los roles y permisos de los usuarios.")}
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {capitalize("roles registrados")}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{capitalize("nombre")}</TableCell>
                <TableCell>{capitalize("permisos")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role: any) => (
                <TableRow key={role.id}>
                  <TableCell>{capitalize(role.name)}</TableCell>
                  <TableCell>
                    {Array.isArray(role.permissions)
                      ? capitalize(role.permissions.join(", "))
                      : capitalize(role.permissions)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            {capitalize("crear rol")}
          </Button>
        </Stack>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{capitalize("crear rol")}</DialogTitle>
        <DialogContent>
          <TextField
            label={capitalize("nombre del rol")}
            name="name"
            value={newRole.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label={capitalize("permisos (separados por coma)")}
            name="permissions"
            value={newRole.permissions}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{capitalize("cancelar")}</Button>
          <Button onClick={handleAddRole} variant="contained" color="primary">
            {capitalize("crear")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default RolesManager;
