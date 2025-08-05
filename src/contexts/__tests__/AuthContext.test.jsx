import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import authService from '../../services/auth.service';

// Mock del servicio de autenticación
jest.mock('../../services/auth.service');

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { user, loading, error, login, logout, updateProfile, clearError, hasRole, isAdmin, isLibrarian, isUser, isStaff } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'null'}</div>
      <button data-testid="login-btn" onClick={() => login({ email: 'test@test.com', password: 'password' })}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
      <button data-testid="update-profile-btn" onClick={() => updateProfile({ name: 'New Name' })}>
        Update Profile
      </button>
      <button data-testid="clear-error-btn" onClick={clearError}>
        Clear Error
      </button>
      <div data-testid="has-role-admin">{hasRole('admin').toString()}</div>
      <div data-testid="is-admin">{isAdmin().toString()}</div>
      <div data-testid="is-librarian">{isLibrarian().toString()}</div>
      <div data-testid="is-user">{isUser().toString()}</div>
      <div data-testid="is-staff">{isStaff().toString()}</div>
    </div>
  );
};

// Wrapper para renderizar con el provider
const renderWithAuthProvider = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialización', () => {
    test('debe inicializar con estado de carga', () => {
      authService.isAuthenticated.mockReturnValue(false);
      
      renderWithAuthProvider(<TestComponent />);
      
      expect(screen.getByTestId('loading')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('error')).toHaveTextContent('null');
    });

    test('debe cargar usuario si está autenticado', async () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'admin' };
      authService.isAuthenticated.mockReturnValue(true);
      authService.getCurrentUser.mockReturnValue(mockUser);
      authService.verifyToken.mockResolvedValue(true);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    test('debe limpiar usuario si el token no es válido', async () => {
      authService.isAuthenticated.mockReturnValue(true);
      authService.getCurrentUser.mockReturnValue({ id: 1, email: 'test@test.com' });
      authService.verifyToken.mockResolvedValue(false);
      authService.logout.mockResolvedValue();
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(authService.logout).toHaveBeenCalled();
    });

    test('debe manejar errores durante la inicialización', async () => {
      authService.isAuthenticated.mockReturnValue(true);
      authService.getCurrentUser.mockReturnValue({ id: 1, email: 'test@test.com' });
      authService.verifyToken.mockRejectedValue(new Error('Token inválido'));
      authService.logout.mockResolvedValue();
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('Login', () => {
    test('debe hacer login exitosamente', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      const mockUser = { id: 1, email: 'test@test.com', role: 'admin' };
      const mockResponse = { user: mockUser, token: 'mock-token' };
      authService.login.mockResolvedValue(mockResponse);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        loginButton.click();
      });
      
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'test@test.com',
          password: 'password'
        });
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('error')).toHaveTextContent('null');
    });

    test('debe manejar errores durante el login', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      const errorMessage = 'Credenciales inválidas';
      authService.login.mockRejectedValue({
        response: { data: { message: errorMessage } }
      });
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      const loginButton = screen.getByTestId('login-btn');
      
      await act(async () => {
        loginButton.click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  describe('Logout', () => {
    test('debe hacer logout exitosamente', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      authService.logout.mockResolvedValue();
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      const logoutButton = screen.getByTestId('logout-btn');
      
      await act(async () => {
        logoutButton.click();
      });
      
      await waitFor(() => {
        expect(authService.logout).toHaveBeenCalled();
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('error')).toHaveTextContent('null');
    });

    test('debe limpiar estado local aunque falle el logout en el servidor', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      authService.logout.mockRejectedValue(new Error('Error de red'));
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      const logoutButton = screen.getByTestId('logout-btn');
      
      await act(async () => {
        logoutButton.click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('error')).toHaveTextContent('null');
      });
    });
  });

  describe('Update Profile', () => {
    test('debe actualizar perfil exitosamente', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      const updatedUser = { id: 1, email: 'test@test.com', name: 'New Name', role: 'admin' };
      const mockResponse = { user: updatedUser };
      authService.updateProfile.mockResolvedValue(mockResponse);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      const updateButton = screen.getByTestId('update-profile-btn');
      
      await act(async () => {
        updateButton.click();
      });
      
      await waitFor(() => {
        expect(authService.updateProfile).toHaveBeenCalledWith({ name: 'New Name' });
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(updatedUser));
      expect(screen.getByTestId('error')).toHaveTextContent('null');
    });

    test('debe manejar errores durante la actualización del perfil', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      const errorMessage = 'Error al actualizar perfil';
      authService.updateProfile.mockRejectedValue({
        response: { data: { message: errorMessage } }
      });
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      const updateButton = screen.getByTestId('update-profile-btn');
      
      await act(async () => {
        updateButton.click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });
  });

  describe('Clear Error', () => {
    test('debe limpiar el error', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      const clearErrorButton = screen.getByTestId('clear-error-btn');
      
      await act(async () => {
        clearErrorButton.click();
      });
      
      expect(screen.getByTestId('error')).toHaveTextContent('null');
    });
  });

  describe('Role Checking', () => {
    test('debe verificar roles correctamente', async () => {
      authService.isAuthenticated.mockReturnValue(false);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      // Sin usuario, todos los roles deben ser false
      expect(screen.getByTestId('has-role-admin')).toHaveTextContent('false');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
      expect(screen.getByTestId('is-librarian')).toHaveTextContent('false');
      expect(screen.getByTestId('is-user')).toHaveTextContent('false');
      expect(screen.getByTestId('is-staff')).toHaveTextContent('false');
    });

    test('debe verificar roles con usuario admin', async () => {
      authService.isAuthenticated.mockReturnValue(true);
      const adminUser = { id: 1, email: 'admin@test.com', role: 'admin' };
      authService.getCurrentUser.mockReturnValue(adminUser);
      authService.verifyToken.mockResolvedValue(true);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      expect(screen.getByTestId('has-role-admin')).toHaveTextContent('true');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      expect(screen.getByTestId('is-librarian')).toHaveTextContent('false');
      expect(screen.getByTestId('is-user')).toHaveTextContent('false');
      expect(screen.getByTestId('is-staff')).toHaveTextContent('true');
    });

    test('debe verificar roles con usuario librarian', async () => {
      authService.isAuthenticated.mockReturnValue(true);
      const librarianUser = { id: 2, email: 'librarian@test.com', role: 'librarian' };
      authService.getCurrentUser.mockReturnValue(librarianUser);
      authService.verifyToken.mockResolvedValue(true);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      expect(screen.getByTestId('has-role-admin')).toHaveTextContent('false');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
      expect(screen.getByTestId('is-librarian')).toHaveTextContent('true');
      expect(screen.getByTestId('is-user')).toHaveTextContent('false');
      expect(screen.getByTestId('is-staff')).toHaveTextContent('true');
    });

    test('debe verificar roles con usuario normal', async () => {
      authService.isAuthenticated.mockReturnValue(true);
      const normalUser = { id: 3, email: 'user@test.com', role: 'user' };
      authService.getCurrentUser.mockReturnValue(normalUser);
      authService.verifyToken.mockResolvedValue(true);
      
      renderWithAuthProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      
      expect(screen.getByTestId('has-role-admin')).toHaveTextContent('false');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
      expect(screen.getByTestId('is-librarian')).toHaveTextContent('false');
      expect(screen.getByTestId('is-user')).toHaveTextContent('true');
      expect(screen.getByTestId('is-staff')).toHaveTextContent('false');
    });
  });

  describe('Error Handling', () => {
    test('debe lanzar error si useAuth se usa fuera del provider', () => {
      // Suprimir console.error para este test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth debe ser usado dentro de un AuthProvider');
      
      consoleSpy.mockRestore();
    });
  });
}); 