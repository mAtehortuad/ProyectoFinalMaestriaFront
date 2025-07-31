import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Esquema de validación
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Ingrese un email válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
}).required();

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearError();
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      maxWidth="sm"
      className="login-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FDF5E6 0%, #FAF0E6 100%)',
        py: 4,
        mx: 'auto',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <BookIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mr: 2,
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Biblioteca Digital
            </Typography>
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            Sistema de Gestión de Préstamos e Inventario
          </Typography>
        </Box>

        {/* Login Card */}
        <Paper
          elevation={8}
          className="login-card"
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            maxWidth: '450px',
          }}
        >
          <Card sx={{ border: 'none', boxShadow: 'none' }} className='center'>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Iniciar Sesión
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Ingresa tus credenciales para acceder al sistema
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={clearError}
                >
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  {...register('email')}
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  {...register('password')}
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<LoginIcon />}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #654321, #8B4513)',
                    },
                  }}
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </Box>

              {/* Demo Credentials */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.secondary', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Credenciales de demostración (cualquier contraseña funciona):
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Admin:</strong> admin@biblioteca.com / (cualquier contraseña)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Bibliotecario:</strong> bibliotecario@biblioteca.com / (cualquier contraseña)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Usuario:</strong> usuario@biblioteca.com / (cualquier contraseña)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3, width: '100%', maxWidth: '400px' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Sistema de Gestión de Biblioteca - Proyecto Final de Maestría
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 