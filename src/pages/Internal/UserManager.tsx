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
  Select,
  MenuItem,
} from "@mui/material";
import usersData from "../../data/files/users.json";
import rolesData from "../../data/files/roles.json";

function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const UserManager = () => {
  const [users, setUsers] = useState(usersData);
  const [roles] = useState(rolesData);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    nameUser: "",
    password: "",
    role: roles[0]?.name || "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewUser({ nameUser: "", password: "", role: roles[0]?.name || "" });
  };
  const handleChange = (e: any) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const handleAddUser = () => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {capitalize("gestor de usuarios")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {capitalize("administra los usuarios, roles y permisos del sistema.")}
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {capitalize("usuarios registrados")}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{capitalize("nombre de usuario")}</TableCell>
                <TableCell>{capitalize("contraseña")}</TableCell>
                <TableCell>{capitalize("rol")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nameUser}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            {capitalize("crear usuario")}
          </Button>
          <Button variant="outlined" color="secondary">
            {capitalize("gestionar roles")}
          </Button>
        </Stack>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{capitalize("crear usuario")}</DialogTitle>
        <DialogContent>
          <TextField
            label={capitalize("nombre de usuario")}
            name="nameUser"
            value={newUser.nameUser}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label={capitalize("contraseña")}
            name="password"
            value={newUser.password}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            type="password"
          />
          <Select
            label={capitalize("rol")}
            name="role"
            value={newUser.role}
            onChange={handleChange}
            fullWidth
          >
            {roles.map((role: any) => (
              <MenuItem key={role.id} value={role.name}>
                {capitalize(role.name)}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{capitalize("cancelar")}</Button>
          <Button onClick={handleAddUser} variant="contained" color="primary">
            {capitalize("crear")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManager;
