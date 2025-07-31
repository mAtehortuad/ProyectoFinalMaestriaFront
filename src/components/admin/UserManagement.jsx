import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Fab,
  CircularProgress,
  InputAdornment,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  LocalLibrary as LibraryIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
  });

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('name');

  // Verificar acceso de administrador
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuarios basado en búsqueda
  useEffect(() => {
    let filtered = users;

    if (appliedSearch.trim()) {
      const term = appliedSearch.toLowerCase();
      filtered = users.filter(user => {
        switch (appliedFilter) {
          case 'name':
            return user.name.toLowerCase().includes(term);
          case 'email':
            return user.email.toLowerCase().includes(term);
          case 'role':
            return getRoleDisplayName(user.role).toLowerCase().includes(term);
          case 'status':
            return getStatusDisplayName(user.status).toLowerCase().includes(term);
          default:
            return (
              user.name.toLowerCase().includes(term) ||
              user.email.toLowerCase().includes(term) ||
              getRoleDisplayName(user.role).toLowerCase().includes(term) ||
              getStatusDisplayName(user.status).toLowerCase().includes(term)
            );
        }
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando se filtra
  }, [users, appliedSearch, appliedFilter]);

  // Calcular usuarios para la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_CONFIG.ENDPOINTS.USERS.BASE);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar usuarios',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        // Actualizar usuario existente
        await apiService.put(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${editingUser.id}`, formData);
        setSnackbar({
          open: true,
          message: 'Usuario actualizado exitosamente',
          severity: 'success',
        });
      } else {
        // Crear nuevo usuario
        await apiService.post(API_CONFIG.ENDPOINTS.USERS.BASE, formData);
        setSnackbar({
          open: true,
          message: 'Usuario creado exitosamente',
          severity: 'success',
        });
      }
      handleCloseDialog();
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar usuario',
        severity: 'error',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await apiService.delete(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${userId}`);
        setSnackbar({
          open: true,
          message: 'Usuario eliminado exitosamente',
          severity: 'success',
        });
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar usuario',
          severity: 'error',
        });
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedFilter(searchFilter);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchFilter('all');
    setAppliedSearch('');
    setAppliedFilter('all');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon />;
      case 'librarian':
        return <LibraryIcon />;
      case 'user':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'librarian':
        return 'warning';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'librarian':
        return 'Bibliotecario';
      case 'user':
        return 'Usuario';
      default:
        return 'Usuario';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStatusDisplayName = (status) => {
    return status === 'active' ? 'Activo' : 'Inactivo';
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth={false} sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                mr: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                  color: 'primary.dark',
                },
              }}
            >
              Volver al Dashboard
            </Button>
          </Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
            Administra los usuarios del sistema de biblioteca
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {users.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Usuarios
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {users.filter(u => u.role === 'admin').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Administradores
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                    <AdminIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {users.filter(u => u.role === 'librarian').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bibliotecarios
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                    <LibraryIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {users.filter(u => u.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuarios Activos
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                    <ActiveIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Barra de búsqueda */}
        <Paper sx={{ p: 2, mb: 3, justifyContent: 'center' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por</InputLabel>
                <Select
                  value={searchFilter}
                  onChange={handleFilterChange}
                  label="Filtrar por"
                >
                  <MenuItem value="name">Nombre</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="role">Rol</MenuItem>
                  <MenuItem value="status">Estado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={2}>
              <Button
                variant="contained"
                onClick={handleSearch}
                fullWidth
                sx={{
                  background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #654321, #8B4513)',
                  },
                }}
              >
                Buscar
              </Button>
            </Grid>
            <Grid xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={handleClearSearch}
                fullWidth
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                  },
                }}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid xs={12} md={1}>
              <Typography variant="body2" color="text.secondary" align="center">
                {filteredUsers.length} de {users.length}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de Usuarios */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Lista de Usuarios
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #654321, #8B4513)',
                },
              }}
            >
              Agregar Usuario
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha de Creación</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                              {getRoleIcon(user.role)}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(user.role)}
                            label={getRoleDisplayName(user.role)}
                            color={getRoleColor(user.role)}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={user.status === 'active' ? <ActiveIcon /> : <BlockIcon />}
                            label={getStatusDisplayName(user.status)}
                            color={getStatusColor(user.status)}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleOpenDialog(user)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar usuario">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(user)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar usuario">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.id === 1} // No permitir eliminar al admin principal
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginación */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Dialog para Crear/Editar Usuario */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.name}
                onChange={handleInputChange('name')}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleInputChange('role')}
                  label="Rol"
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="librarian">Bibliotecario</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleInputChange('status')}
                  label="Estado"
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #654321, #8B4513)',
                },
              }}
            >
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* FAB para agregar usuario */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(45deg, #8B4513, #D2691E)',
            '&:hover': {
              background: 'linear-gradient(45deg, #654321, #8B4513)',
            },
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default UserManagement; 