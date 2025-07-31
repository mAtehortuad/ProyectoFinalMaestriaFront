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
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Book as BookIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Warning as OverdueIcon,
  CheckCircle as ActiveIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const MyLoans = () => {
  const { isUser } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Verificar acceso de usuario
  useEffect(() => {
    if (!isUser()) {
      navigate('/dashboard');
    }
  }, [isUser, navigate]);

  // Cargar préstamos
  useEffect(() => {
    loadMyLoans();
  }, []);

  const loadMyLoans = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_CONFIG.ENDPOINTS.LOANS.USER_LOANS);
      setLoans(response.data || []);
    } catch (error) {
      console.error('Error loading loans:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar préstamos',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExtendLoan = async (loanId) => {
    try {
      await apiService.post(`${API_CONFIG.ENDPOINTS.LOANS.EXTEND}/${loanId}`);
      setSnackbar({
        open: true,
        message: 'Préstamo extendido exitosamente',
        severity: 'success',
      });
      loadMyLoans();
    } catch (error) {
      console.error('Error extending loan:', error);
      setSnackbar({
        open: true,
        message: 'Error al extender préstamo',
        severity: 'error',
      });
    }
  };

  const getLoanStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <ActiveIcon />;
      case 'overdue':
        return <OverdueIcon />;
      case 'pending':
        return <PendingIcon />;
      default:
        return <BookIcon />;
    }
  };

  const getLoanStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLoanStatusDisplayName = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'overdue':
        return 'Vencido';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!isUser()) {
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
            Mis Préstamos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestiona tus libros prestados y fechas de devolución
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {loans.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Préstamos
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                    <BookIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {loans.filter(loan => loan.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Préstamos Activos
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                    <ActiveIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {loans.filter(loan => loan.status === 'overdue' || isOverdue(loan.dueDate)).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Préstamos Vencidos
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                    <OverdueIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {loans.filter(loan => loan.status === 'pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Préstamos Pendientes
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                    <PendingIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de Préstamos */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Lista de Préstamos
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadMyLoans}
              disabled={loading}
            >
              Actualizar
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : loans.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <BookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes préstamos activos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ve a buscar libros para solicitar un préstamo
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/books')}
                sx={{
                  background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #654321, #8B4513)',
                  },
                }}
              >
                Buscar Libros
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Libro</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de Préstamo</TableCell>
                    <TableCell>Fecha de Devolución</TableCell>
                    <TableCell>Días Restantes</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                            <BookIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {loan.book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              por {loan.book.author}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getLoanStatusIcon(loan.status)}
                          label={getLoanStatusDisplayName(loan.status)}
                          color={getLoanStatusColor(loan.status)}
                          variant="filled"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(loan.loanDate).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={isOverdue(loan.dueDate) ? 'error.main' : 'text.primary'}
                          sx={{ fontWeight: isOverdue(loan.dueDate) ? 600 : 400 }}
                        >
                          {new Date(loan.dueDate).toLocaleDateString('es-ES')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const daysRemaining = getDaysRemaining(loan.dueDate);
                          if (daysRemaining < 0) {
                            return (
                              <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                                Vencido hace {Math.abs(daysRemaining)} días
                              </Typography>
                            );
                          } else if (daysRemaining === 0) {
                            return (
                              <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                                Vence hoy
                              </Typography>
                            );
                          } else {
                            return (
                              <Typography variant="body2" color="text.secondary">
                                {daysRemaining} días restantes
                              </Typography>
                            );
                          }
                        })()}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Ver detalles del libro">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/books/${loan.book.id}`)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {loan.status === 'active' && !isOverdue(loan.dueDate) && (
                            <Tooltip title="Solicitar extensión">
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleExtendLoan(loan.id)}
                                sx={{ ml: 1 }}
                              >
                                Extender
                              </Button>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

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

export default MyLoans; 