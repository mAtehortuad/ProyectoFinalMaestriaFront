import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Book as BookIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  LocalLibrary as LibraryIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, isAdmin, isLibrarian, isUser } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({
    totalBooks: 1250,
    availableBooks: 890,
    borrowedBooks: 360,
    totalUsers: 450,
    activeLoans: 320,
    overdueLoans: 15,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
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

  // Componente para estadísticas
  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: `${color}.main` }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Componente para acciones rápidas
  const QuickActionCard = ({ title, description, icon, onClick, color = 'primary' }) => (
    <Card 
      sx={{ 
        cursor: 'pointer', 
        transition: 'all 0.2s', 
        '&:hover': { 
          transform: 'translateY(-2px)', 
          boxShadow: 4 
        } 
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, mx: 'auto', mb: 2, width: 56, height: 56 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', width: '100%' }}>
      {/* Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BookIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                Biblioteca Digital
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={getRoleIcon(user?.role)}
                label={getRoleDisplayName(user?.role)}
                color={getRoleColor(user?.role)}
                variant="filled"
                sx={{ color: 'white' }}
              />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user?.name || user?.email}
              </Typography>
              <Tooltip title="Cerrar sesión">
                <IconButton onClick={handleLogout} sx={{ color: 'white' }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth={false} sx={{ py: 4, px: 3 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            ¡Bienvenido, {user?.name || 'Usuario'}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Panel de control del Sistema de Gestión de Biblioteca
          </Typography>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <StatCard
              title="Total de Libros"
              value={stats.totalBooks}
              icon={<BookIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <StatCard
              title="Libros Disponibles"
              value={stats.availableBooks}
              icon={<BookIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <StatCard
              title="Préstamos Activos"
              value={stats.activeLoans}
              icon={<TrendingUpIcon />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <StatCard
              title="Préstamos Vencidos"
              value={stats.overdueLoans}
              icon={<NotificationsIcon />}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Role-based Content */}
        {isAdmin() && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Panel de Administración
            </Typography>
            <Grid container spacing={3} sx={{ width: '100%' }}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Gestionar Usuarios"
                  description="Administrar usuarios del sistema"
                  icon={<PersonIcon />}
                  color="primary"
                  onClick={() => navigate('/admin/users')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Gestionar Libros"
                  description="Administrar inventario de libros"
                  icon={<BookIcon />}
                  color="secondary"
                  onClick={() => navigate('/admin/books')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Reportes"
                  description="Generar reportes del sistema"
                  icon={<TrendingUpIcon />}
                  color="info"
                  onClick={() => navigate('/admin/reports')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Configuración"
                  description="Configurar parámetros del sistema"
                  icon={<SettingsIcon />}
                  color="warning"
                  onClick={() => navigate('/admin/settings')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Estados de Libros"
                  description="Gestionar estados del inventario"
                  icon={<EditIcon />}
                  color="success"
                  onClick={() => navigate('/admin/book-status')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Categorías"
                  description="Administrar categorías de libros"
                  icon={<LibraryIcon />}
                  color="error"
                  onClick={() => navigate('/admin/categories')}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {isLibrarian() && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Panel de Bibliotecario
            </Typography>
            <Grid container spacing={3} sx={{ width: '100%' }}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Gestionar Préstamos"
                  description="Procesar préstamos y devoluciones"
                  icon={<BookIcon />}
                  color="primary"
                  onClick={() => navigate('/librarian/loans')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Buscar Libros"
                  description="Buscar en el inventario"
                  icon={<SearchIcon />}
                  color="secondary"
                  onClick={() => navigate('/librarian/search')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Agregar Libros"
                  description="Registrar nuevos libros"
                  icon={<AddIcon />}
                  color="success"
                  onClick={() => navigate('/librarian/add-book')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Usuarios"
                  description="Gestionar usuarios"
                  icon={<PersonIcon />}
                  color="info"
                  onClick={() => navigate('/librarian/users')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Reportes"
                  description="Ver reportes de actividad"
                  icon={<TrendingUpIcon />}
                  color="warning"
                  onClick={() => navigate('/librarian/reports')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Estados"
                  description="Actualizar estados de libros"
                  icon={<EditIcon />}
                  color="error"
                  onClick={() => navigate('/librarian/book-status')}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {isUser() && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Panel de Usuario
            </Typography>
            <Grid container spacing={3} sx={{ width: '100%' }}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Mis Préstamos"
                  description="Ver mis libros prestados"
                  icon={<BookIcon />}
                  color="primary"
                  onClick={() => navigate('/user/my-loans')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Buscar Libros"
                  description="Buscar libros disponibles"
                  icon={<SearchIcon />}
                  color="secondary"
                  onClick={() => navigate('/user/search')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Solicitar Préstamo"
                  description="Solicitar un nuevo préstamo"
                  icon={<AddIcon />}
                  color="success"
                  onClick={() => navigate('/user/request-loan')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Mi Perfil"
                  description="Ver y editar mi perfil"
                  icon={<PersonIcon />}
                  color="info"
                  onClick={() => navigate('/user/profile')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Historial"
                  description="Ver mi historial de préstamos"
                  icon={<TrendingUpIcon />}
                  color="warning"
                  onClick={() => navigate('/user/history')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <QuickActionCard
                  title="Notificaciones"
                  description="Ver notificaciones"
                  icon={<NotificationsIcon />}
                  color="error"
                  onClick={() => navigate('/user/notifications')}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Recent Activity */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            Actividad Reciente
          </Typography>
          <Card>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <BookIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nuevo libro agregado: 'El Señor de los Anillos'"
                    secondary="Hace 2 horas"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Préstamo procesado para María García"
                    secondary="Hace 3 horas"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="success" />
                  </ListItemIcon>
                    <ListItemText
                      primary="Devolución registrada: 'Cien años de soledad'"
                      secondary="Hace 4 horas"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Recordatorio: 3 préstamos próximos a vencer"
                    secondary="Hace 5 horas"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 