import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  LocalLibrary as LibraryIcon,
  CheckCircle as ActiveIcon,
  Block as BlockIcon,
  ArrowBack as ArrowBackIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';
import Pagination from '../common/Pagination';

const UserSearch = () => {
  const { isAdmin, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Obtener parámetros de la URL
  const getSearchParams = () => ({
    query: searchParams.get('q') || '',
    role: searchParams.get('role') || '',
    status: searchParams.get('status') || '',
    email: searchParams.get('email') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 12,
  });

  // Verificar acceso (solo admin y bibliotecario)
  useEffect(() => {
    if (!isAdmin() && !isLibrarian()) {
      navigate('/dashboard');
    }
  }, [isAdmin, isLibrarian, navigate]);

  // Búsqueda automática cuando cambian los parámetros de URL
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = getSearchParams();
      if (params.query || params.role || params.status || params.email) {
        searchUsers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  // Cargar datos iniciales si hay parámetros
  useEffect(() => {
    const params = getSearchParams();
    if (params.query || params.role || params.status || params.email) {
      searchUsers();
    }
  }, []);

  const searchUsers = async () => {
    try {
      setLoading(true);
      const params = getSearchParams();
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      if (params.email) queryParams.append('email', params.email);
      queryParams.append('page', params.page);
      queryParams.append('limit', params.limit);

      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.USERS.BASE}?${queryParams}`);
      setUsers(response.data || []);
      setPagination({
        currentPage: params.page,
        totalPages: Math.ceil((response.total || 0) / params.limit),
        totalItems: response.total || 0,
        itemsPerPage: params.limit,
      });
    } catch (error) {
      console.error('Error searching users:', error);
      setSnackbar({
        open: true,
        message: 'Error al buscar usuarios',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (field) => (event) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (event.target.value) {
      newParams.set(field, event.target.value);
    } else {
      newParams.delete(field);
    }
    newParams.set('page', '1'); // Reset a página 1
    
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (event, page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const handleItemsPerPageChange = (event) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('limit', event.target.value.toString());
    newParams.set('page', '1'); // Reset a página 1
    setSearchParams(newParams);
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

  const handleUserAction = (user, action) => {
    if (action === 'view') {
      // Ver detalles del usuario
      navigate(`/users/${user.id}`);
    } else if (action === 'edit' && isAdmin()) {
      // Editar usuario (solo admin)
      navigate(`/admin/users/edit/${user.id}`);
    } else if (action === 'delete' && isAdmin()) {
      // Eliminar usuario (solo admin)
      handleDeleteUser(user.id);
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
        searchUsers();
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

  const UserCard = ({ user }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
            {getRoleIcon(user.role)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={getRoleIcon(user.role)}
            label={getRoleDisplayName(user.role)}
            color={getRoleColor(user.role)}
            variant="filled"
            size="small"
          />
          <Chip
            icon={user.status === 'active' ? <ActiveIcon /> : <BlockIcon />}
            label={getStatusDisplayName(user.status)}
            color={getStatusColor(user.status)}
            variant="filled"
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Fecha de registro:</strong> {new Date(user.createdAt).toLocaleDateString('es-ES')}
        </Typography>

        {user.lastLogin && (
          <Typography variant="body2" color="text.secondary">
            <strong>Último acceso:</strong> {new Date(user.lastLogin).toLocaleDateString('es-ES')}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleUserAction(user, 'view')}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          
          {isAdmin() && (
            <>
              <Tooltip title="Editar usuario">
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => handleUserAction(user, 'edit')}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar usuario">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleUserAction(user, 'delete')}
                  disabled={user.id === 1} // No permitir eliminar al admin principal
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </CardActions>
    </Card>
  );

  const UserTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha de Registro</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
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
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  icon={user.status === 'active' ? <ActiveIcon /> : <BlockIcon />}
                  label={getStatusDisplayName(user.status)}
                  color={getStatusColor(user.status)}
                  variant="filled"
                  size="small"
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
                      onClick={() => handleUserAction(user, 'view')}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  
                  {isAdmin() && (
                    <>
                      <Tooltip title="Editar usuario">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleUserAction(user, 'edit')}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar usuario">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleUserAction(user, 'delete')}
                          disabled={user.id === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (!isAdmin() && !isLibrarian()) {
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
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Búsqueda de Usuarios
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Encuentra y gestiona usuarios del sistema
          </Typography>
        </Box>

        {/* Filtros de búsqueda */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Filtros de Búsqueda
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                              <TextField
                  fullWidth
                  label="Buscar por nombre"
                  value={getSearchParams().query}
                  onChange={handleSearchChange('q')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                              <TextField
                  fullWidth
                  label="Email específico"
                  value={getSearchParams().email}
                  onChange={handleSearchChange('email')}
                />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={getSearchParams().role}
                    onChange={handleSearchChange('role')}
                    label="Rol"
                  >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="librarian">Bibliotecario</MenuItem>
                  <MenuItem value="user">Usuario</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={getSearchParams().status}
                    onChange={handleSearchChange('status')}
                    label="Estado"
                  >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Limpiar Filtros
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              startIcon={<ViewListIcon />}
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              Tabla
            </Button>
            <Button
              variant="outlined"
              startIcon={<GridViewIcon />}
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              Tarjetas
            </Button>
          </Box>
        </Paper>

        {/* Resultados */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Resultados ({pagination.totalItems} usuarios encontrados)
            </Typography>
            {loading && <CircularProgress size={24} />}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar los filtros de búsqueda
              </Typography>
            </Paper>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                      <UserCard user={user} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <UserTable />
              )}

              {/* Paginación */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </Box>

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
      </Container>
    </Box>
  );
};

export default UserSearch; 