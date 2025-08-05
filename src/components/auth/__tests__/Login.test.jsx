import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from '../Login';

// Mock del contexto de autenticación
const mockLogin = jest.fn();
const mockClearError = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    error: null,
    clearError: mockClearError,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Tema de Material-UI para los tests
const theme = createTheme();

// Wrapper para renderizar componentes con providers necesarios
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    test('debe renderizar el formulario de login correctamente', () => {
      renderWithProviders(<Login />);
      
      // Verificar elementos principales
      expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument();
      expect(screen.getByText('Sistema de Gestión de Préstamos e Inventario')).toBeInTheDocument();
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('Ingresa tus credenciales para acceder al sistema')).toBeInTheDocument();
      
      // Verificar campos del formulario
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    test('debe mostrar el icono de la biblioteca', () => {
      renderWithProviders(<Login />);
      
      // Verificar que el icono esté presente (por el texto alternativo o aria-label)
      const bookIcon = document.querySelector('[data-testid="BookIcon"]') || 
                      document.querySelector('svg[data-testid="BookIcon"]');
      expect(bookIcon).toBeInTheDocument();
    });
  });

  describe('Validación de formulario', () => {
    test('debe mostrar error cuando el email está vacío', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar solo la contraseña
      await user.type(passwordInput, 'password123');
      
      // Intentar enviar el formulario
      await user.click(submitButton);
      
      // Verificar que aparezca el error de email requerido
      await waitFor(() => {
        expect(screen.getByText('El email es requerido')).toBeInTheDocument();
      });
    });

    test('debe mostrar error cuando la contraseña está vacía', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar solo el email
      await user.type(emailInput, 'test@example.com');
      
      // Intentar enviar el formulario
      await user.click(submitButton);
      
      // Verificar que aparezca el error de contraseña requerida
      await waitFor(() => {
        expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
      });
    });

    test('debe mostrar error cuando el email no es válido', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar con email inválido
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      
      // Intentar enviar el formulario
      await user.click(submitButton);
      
      // Verificar que aparezca el error de email inválido
      await waitFor(() => {
        expect(screen.getByText('Ingrese un email válido')).toBeInTheDocument();
      });
    });

    test('debe mostrar error cuando la contraseña es muy corta', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar con contraseña corta
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '123');
      
      // Intentar enviar el formulario
      await user.click(submitButton);
      
      // Verificar que aparezca el error de contraseña corta
      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidad del formulario', () => {
    test('debe llamar a login con datos válidos', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue();
      
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar el formulario con datos válidos
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Enviar el formulario
      await user.click(submitButton);
      
      // Verificar que se llame a login con los datos correctos
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    test('debe navegar al dashboard después del login exitoso', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue();
      
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar y enviar el formulario
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Verificar que se navegue al dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    test('debe limpiar errores al enviar el formulario', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue();
      
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar y enviar el formulario
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Verificar que se limpie el error
      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
      });
    });
  });

  describe('Toggle de visibilidad de contraseña', () => {
    test('debe cambiar la visibilidad de la contraseña al hacer clic en el icono', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
      
      // Verificar que inicialmente la contraseña esté oculta
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Hacer clic en el botón de toggle
      await user.click(toggleButton);
      
      // Verificar que la contraseña se muestre
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Hacer clic nuevamente para ocultar
      await user.click(toggleButton);
      
      // Verificar que la contraseña se oculte
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Manejo de errores', () => {
    test('debe mostrar error cuando login falla', () => {
      // Mock del contexto con error
      jest.doMock('../../../contexts/AuthContext', () => ({
        useAuth: () => ({
          login: mockLogin,
          error: 'Credenciales inválidas',
          clearError: mockClearError,
        }),
      }));

      renderWithProviders(<Login />);
      
      // Verificar que se muestre el error
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });

    test('debe limpiar el error al hacer clic en cerrar', async () => {
      // Mock del contexto con error
      jest.doMock('../../../contexts/AuthContext', () => ({
        useAuth: () => ({
          login: mockLogin,
          error: 'Credenciales inválidas',
          clearError: mockClearError,
        }),
      }));

      renderWithProviders(<Login />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);
      
      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('Estados de carga', () => {
    test('debe mostrar estado de carga durante el envío', async () => {
      const user = userEvent.setup();
      // Mock que nunca se resuelve para simular carga
      mockLogin.mockImplementation(() => new Promise(() => {}));
      
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Llenar y enviar el formulario
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Verificar que el botón esté deshabilitado durante la carga
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
}); 