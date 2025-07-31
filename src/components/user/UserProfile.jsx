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
  Alert,
  Snackbar,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const UserProfile = () => {
  const { user, isUser, updateUser } = useAuth();
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

  // Verificar acceso de usuario
  useEffect(() => {
    if (!isUser()) {
      navigate('/dashboard');
    }
  }, [isUser, navigate]);

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

  if (!isUser()) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Volver al Dashboard
            </Button>
          </Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
            Mi Perfil
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
            Gestiona tu información personal
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {/* Información Personal */}
          <Grid xs={12} md={8}>
            <Card sx={{ minWidth: '31rem' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2, width: 56, height: 56 }}>
                    <PersonIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h2">
                      Información Personal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actualiza tus datos personales
                    </Typography>
                  </Box>
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
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
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
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mr: 2, width: 40, height: 40 }}>
                    <SecurityIcon />
                  </Avatar>
                  <Typography variant="h6" component="h3">
                    Cambiar Contraseña
                  </Typography>
                </Box>

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
                        startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />,
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
                        startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />,
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
                      InputProps={{
                        startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
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

          {/* Información del Usuario */}
          <Grid xs={12} md={4}>
            <Card sx={{ minWidth: '31rem' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de la Cuenta
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {user?.name || 'Usuario'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {user?.email || 'usuario@email.com'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Miembro desde: {new Date().getFullYear()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary.main" gutterBottom>
                        Usuario
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tipo de Cuenta
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

export default UserProfile; 