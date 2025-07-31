import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Avatar,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Book as BookIcon,
  Person as PersonIcon,
  LocalLibrary as LibraryIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const Reports = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Datos de ejemplo para las gráficas
  const [reportData, setReportData] = useState({
    bookStats: [],
    userStats: [],
    loanStats: [],
    categoryStats: [],
    monthlyLoans: [],
    topBooks: [],
    userActivity: [],
  });

  // Verificar acceso de administrador
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Cargar datos de reportes
  useEffect(() => {
    loadReportData();
  }, [timeRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos reales del mock
      const response = await apiService.get(API_CONFIG.ENDPOINTS.REPORTS.STATISTICS, {
        params: { timeRange }
      });
      
      if (response.data) {
        setReportData(response.data);
      } else {
        // Fallback a datos de ejemplo si no hay respuesta del mock
        const mockData = generateMockReportData();
        setReportData(mockData);
      }
      
    } catch (error) {
      console.error('Error loading report data:', error);
      // Fallback a datos de ejemplo en caso de error
      const mockData = generateMockReportData();
      setReportData(mockData);
      
      setSnackbar({
        open: true,
        message: 'Usando datos de ejemplo - Error al cargar datos del servidor',
        severity: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockReportData = () => {
    // Datos de ejemplo para las gráficas
    const bookStats = [
      { name: 'Disponibles', value: 890, color: '#4caf50' },
      { name: 'Prestados', value: 360, color: '#2196f3' },
      { name: 'En Reparación', value: 45, color: '#ff9800' },
      { name: 'Perdidos', value: 15, color: '#f44336' },
    ];

    const userStats = [
      { name: 'Ene', usuarios: 420, activos: 380 },
      { name: 'Feb', usuarios: 450, activos: 410 },
      { name: 'Mar', usuarios: 480, activos: 440 },
      { name: 'Abr', usuarios: 520, activos: 480 },
      { name: 'May', usuarios: 550, activos: 510 },
      { name: 'Jun', usuarios: 580, activos: 540 },
    ];

    const loanStats = [
      { name: 'Lun', prestamos: 45, devoluciones: 38 },
      { name: 'Mar', prestamos: 52, devoluciones: 42 },
      { name: 'Mie', prestamos: 48, devoluciones: 45 },
      { name: 'Jue', prestamos: 61, devoluciones: 53 },
      { name: 'Vie', prestamos: 55, devoluciones: 49 },
      { name: 'Sab', prestamos: 38, devoluciones: 35 },
      { name: 'Dom', prestamos: 25, devoluciones: 22 },
    ];

    const categoryStats = [
      { name: 'Ficción', value: 35, color: '#ff6b6b' },
      { name: 'No Ficción', value: 25, color: '#4ecdc4' },
      { name: 'Ciencia', value: 20, color: '#45b7d1' },
      { name: 'Historia', value: 15, color: '#96ceb4' },
      { name: 'Otros', value: 5, color: '#feca57' },
    ];

    const monthlyLoans = [
      { name: 'Ene', prestamos: 1200, devoluciones: 1150 },
      { name: 'Feb', prestamos: 1350, devoluciones: 1280 },
      { name: 'Mar', prestamos: 1420, devoluciones: 1380 },
      { name: 'Abr', prestamos: 1580, devoluciones: 1520 },
      { name: 'May', prestamos: 1650, devoluciones: 1600 },
      { name: 'Jun', prestamos: 1780, devoluciones: 1720 },
    ];

    const topBooks = [
      { name: 'El Señor de los Anillos', prestamos: 45 },
      { name: 'Don Quijote', prestamos: 38 },
      { name: 'Cien años de soledad', prestamos: 32 },
      { name: '1984', prestamos: 28 },
      { name: 'El Principito', prestamos: 25 },
    ];

    const userActivity = [
      { name: '00:00', usuarios: 5 },
      { name: '04:00', usuarios: 2 },
      { name: '08:00', usuarios: 15 },
      { name: '12:00', usuarios: 45 },
      { name: '16:00', usuarios: 38 },
      { name: '20:00', usuarios: 22 },
      { name: '24:00', usuarios: 8 },
    ];

    return {
      bookStats,
      userStats,
      loanStats,
      categoryStats,
      monthlyLoans,
      topBooks,
      userActivity,
    };
  };



  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!isAdmin()) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth={false} sx={{ py: 4 }}>
        {/* Header Mejorado */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            p: 4, 
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                mr: 2, 
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 56,
                height: 56
              }}
            >
              <AssessmentIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Reportes del Sistema
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                Análisis y estadísticas de la biblioteca
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Volver al Dashboard
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: 'white' }}>Período</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Período"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="week">Última Semana</MenuItem>
                  <MenuItem value="month">Último Mes</MenuItem>
                  <MenuItem value="quarter">Último Trimestre</MenuItem>
                  <MenuItem value="year">Último Año</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Actualizar datos">
                <IconButton 
                  onClick={loadReportData} 
                  disabled={loading}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Estado de Libros - Gráfica de Dona */}
            <Grid xs={12} lg={6}>
              <Card sx={{ height: '100%', p: 2, minWidth: '31rem' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PieChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h2">
                        Estado de Libros
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={reportData.bookStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {reportData.bookStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Categorías de Libros - Gráfica de Barras */}
            <Grid xs={12} lg={6}>
              <Card sx={{ height: '100%', p: 2, minWidth: '31rem' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BarChart sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h2">
                        Libros por Categoría
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={reportData.categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Actividad de Usuarios - Gráfica de Líneas */}
            <Grid xs={12} lg={6}>
              <Card sx={{ height: '100%', p: 2, minWidth: '31rem' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h2">
                        Actividad de Usuarios
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={reportData.userActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="usuarios" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Préstamos Semanales - Gráfica de Barras */}
            <Grid xs={12} lg={6}>
              <Card sx={{ height: '100%', p: 2, minWidth: '31rem' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BarChart sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h2">
                        Préstamos Semanales
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={reportData.loanStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="prestamos" fill="#8884d8" />
                      <Bar dataKey="devoluciones" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Préstamos Mensuales - Gráfica de Líneas */}
            <Grid xs={12}>
              <Card sx={{ p: 2, minWidth: '31rem' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h2">
                        Préstamos Mensuales
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={500}>
                    <AreaChart data={reportData.monthlyLoans}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area type="monotone" dataKey="prestamos" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="devoluciones" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Crecimiento de Usuarios - Gráfica de Líneas */}
            <Grid xs={12} lg={6}>
              <Card sx={{ height: '100%', p: 2, minWidth: '31rem' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h2">
                        Crecimiento de Usuarios
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={reportData.userStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="usuarios" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="activos" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Libros Más Prestados - Gráfica de Barras Horizontales */}
            <Grid xs={12} lg={6}>
              <Card sx={{ height: '100%', p: 2, minWidth: '31rem' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BookIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" component="h2">
                        Libros Más Prestados
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={reportData.topBooks} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <RechartsTooltip />
                      <Bar dataKey="prestamos" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

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

export default Reports; 