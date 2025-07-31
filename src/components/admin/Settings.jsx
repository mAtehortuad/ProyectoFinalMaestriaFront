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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const Settings = () => {
  const { user, isAdmin, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Estados para la información del usuario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estados para configuraciones del sistema
  const [systemSettings, setSystemSettings] = useState({
    emailNotifications: true,
    loanReminders: true,
    overdueAlerts: true,
    maintenanceMode: false,
    maxLoansPerUser: 5,
    loanDurationDays: 14,
    overdueFinePerDay: 1.00,
  });

  // Verificar acceso de administrador
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSystemSettingChange = (field) => (event) => {
    setSystemSettings({
      ...systemSettings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Validar contraseña si se está cambiando
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setSnackbar({
            open: true,
            message: 'Las contraseñas no coinciden',
            severity: 'error',
          });
          return;
        }
        if (formData.newPassword.length < 6) {
          setSnackbar({
            open: true,
            message: 'La contraseña debe tener al menos 6 caracteres',
            severity: 'error',
          });
          return;
        }
      }

      // Preparar datos para actualizar
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Llamar a la API para actualizar perfil
      await apiService.put(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${user.id}`, updateData);

      // Actualizar contexto de autenticación
      if (updateUser) {
        updateUser({
          ...user,
          name: formData.name,
          email: formData.email,
        });
      }

      setSnackbar({
        open: true,
        message: 'Perfil actualizado exitosamente',
        severity: 'success',
      });

      // Limpiar campos de contraseña
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar perfil',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      setLoading(true);

      // Llamar a la API para guardar configuraciones del sistema
      await apiService.put(API_CONFIG.ENDPOINTS.SETTINGS.BASE, systemSettings);

      setSnackbar({
        open: true,
        message: 'Configuraciones del sistema guardadas exitosamente',
        severity: 'success',
      });

    } catch (error) {
      console.error('Error saving system settings:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar configuraciones del sistema',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
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
            Configuración
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
            Gestiona tu perfil y configuraciones del sistema
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {/* Perfil del Usuario */}
          <Grid xs={12} md={6}>
            <Card sx={{ height: '100%', minWidth: '68rem' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h5" component="h2">
                    Perfil del Administrador
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      margin="normal"
                      required
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Cambiar Contraseña
                </Typography>

                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña actual"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={handleInputChange('currentPassword')}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      label="Nueva contraseña"
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleInputChange('newPassword')}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      label="Confirmar nueva contraseña"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #654321, #8B4513)',
                      },
                    }}
                  >
                    Guardar Cambios
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Configuraciones del Sistema */}
          <Grid xs={12} md={6}>
            <Card sx={{ height: '100%', minWidth: '68rem' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mr: 2 }}>
                    <SettingsIcon />
                  </Avatar>
                  <Typography variant="h5" component="h2">
                    Configuraciones del Sistema
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Notificaciones
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.emailNotifications}
                          onChange={handleSystemSettingChange('emailNotifications')}
                        />
                      }
                      label="Notificaciones por email"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.loanReminders}
                          onChange={handleSystemSettingChange('loanReminders')}
                        />
                      }
                      label="Recordatorios de préstamos"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.overdueAlerts}
                          onChange={handleSystemSettingChange('overdueAlerts')}
                        />
                      }
                      label="Alertas de préstamos vencidos"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.maintenanceMode}
                          onChange={handleSystemSettingChange('maintenanceMode')}
                        />
                      }
                      label="Modo mantenimiento"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Parámetros del Sistema
                </Typography>

                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Máximo préstamos por usuario"
                      type="number"
                      value={systemSettings.maxLoansPerUser}
                      onChange={handleSystemSettingChange('maxLoansPerUser')}
                      margin="normal"
                      inputProps={{ min: 1, max: 10 }}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Duración del préstamo (días)"
                      type="number"
                      value={systemSettings.loanDurationDays}
                      onChange={handleSystemSettingChange('loanDurationDays')}
                      margin="normal"
                      inputProps={{ min: 1, max: 30 }}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Multa por día vencido ($)"
                      type="number"
                      value={systemSettings.overdueFinePerDay}
                      onChange={handleSystemSettingChange('overdueFinePerDay')}
                      margin="normal"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveSystemSettings}
                    disabled={loading}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #654321, #8B4513)',
                      },
                    }}
                  >
                    Guardar Configuraciones
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información del Sistema */}
          <Grid xs={12}>
            <Card sx={{ height: 'auto', minWidth: '68rem' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información del Sistema
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary.main" gutterBottom>
                        v1.0.0
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Versión del Sistema
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="success.main" gutterBottom>
                        Activo
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estado del Sistema
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="info.main" gutterBottom>
                        99.9%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tiempo de Actividad
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="warning.main" gutterBottom>
                        <Chip label="Admin" color="error" size="small" />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rol Actual
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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

export default Settings; 