import AuthService from '../auth.service';
import apiService from '../api.service';
import API_CONFIG from '../../config/api.config';
import { jwtDecode } from 'jwt-decode';

// Mock de las dependencias
jest.mock('../api.service');
jest.mock('../../config/api.config', () => ({
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      VERIFY: '/auth/verify',
      PROFILE: '/auth/profile',
    },
  },
}));
jest.mock('jwt-decode');

describe('AuthService', () => {
  let authService;
  let mockLocalStorage;

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Mock de localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    authService = new AuthService();
  });

  describe('Login', () => {
    test('debe hacer login exitosamente', async () => {
      const credentials = { email: 'test@test.com', password: 'password123' };
      const mockResponse = {
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: { id: 1, email: 'test@test.com', role: 'admin' },
      };

      apiService.post.mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(apiService.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-jwt-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
      expect(result).toEqual(mockResponse);
    });

    test('debe lanzar error si no se recibe token', async () => {
      const credentials = { email: 'test@test.com', password: 'password123' };
      const mockResponse = {
        user: { id: 1, email: 'test@test.com' },
        // Sin token
      };

      apiService.post.mockResolvedValue(mockResponse);

      await expect(authService.login(credentials)).rejects.toThrow('Token no recibido en la respuesta');
    });

    test('debe manejar errores de la API', async () => {
      const credentials = { email: 'test@test.com', password: 'password123' };
      const apiError = new Error('Credenciales inválidas');
      apiService.post.mockRejectedValue(apiError);

      await expect(authService.login(credentials)).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('Logout', () => {
    test('debe hacer logout exitosamente con token', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');
      apiService.post.mockResolvedValue({});

      await authService.logout();

      expect(apiService.post).toHaveBeenCalledWith('/auth/logout', { token: 'mock-token' });
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });

    test('debe limpiar sesión aunque no haya token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await authService.logout();

      expect(apiService.post).not.toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });

    test('debe limpiar sesión aunque falle la API', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');
      apiService.post.mockRejectedValue(new Error('Error de red'));

      await authService.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('isAuthenticated', () => {
    test('debe retornar false si no hay token', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      expect(authService.isAuthenticated()).toBe(false);
    });

    test('debe retornar true si el token es válido', () => {
      const mockToken = 'valid-jwt-token';
      const mockDecoded = { exp: Date.now() / 1000 + 3600 }; // Token válido por 1 hora

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      jwtDecode.mockReturnValue(mockDecoded);

      expect(authService.isAuthenticated()).toBe(true);
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    test('debe retornar false si el token ha expirado', () => {
      const mockToken = 'expired-jwt-token';
      const mockDecoded = { exp: Date.now() / 1000 - 3600 }; // Token expirado hace 1 hora

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      jwtDecode.mockReturnValue(mockDecoded);

      expect(authService.isAuthenticated()).toBe(false);
    });

    test('debe limpiar sesión y retornar false si hay error al decodificar', () => {
      const mockToken = 'invalid-jwt-token';

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      jwtDecode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(authService.isAuthenticated()).toBe(false);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getCurrentUser', () => {
    test('debe retornar usuario si existe en localStorage', () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'admin' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      expect(authService.getCurrentUser()).toEqual(mockUser);
    });

    test('debe retornar null si no hay usuario en localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      expect(authService.getCurrentUser()).toBeNull();
    });

    test('debe retornar null si hay error al parsear JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      expect(authService.getCurrentUser()).toBeNull();
    });
  });

  describe('Role checking', () => {
    test('hasRole debe retornar true si el usuario tiene el rol', () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'admin' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      expect(authService.hasRole('admin')).toBe(true);
    });

    test('hasRole debe retornar false si el usuario no tiene el rol', () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'user' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      expect(authService.hasRole('admin')).toBe(false);
    });

    test('hasRole debe retornar false si no hay usuario', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      expect(authService.hasRole('admin')).toBe(false);
    });

    test('isAdmin debe retornar true para usuarios admin', () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'admin' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      expect(authService.isAdmin()).toBe(true);
    });

    test('isLibrarian debe retornar true para usuarios librarian', () => {
      const mockUser = { id: 1, email: 'test@test.com', role: 'librarian' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      expect(authService.isLibrarian()).toBe(true);
    });
  });

  describe('Token management', () => {
    test('getToken debe retornar el token del localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');

      expect(authService.getToken()).toBe('mock-token');
    });

    test('getRefreshToken debe retornar el refresh token del localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('mock-refresh-token');

      expect(authService.getRefreshToken()).toBe('mock-refresh-token');
    });

    test('setTokens debe guardar tokens en localStorage', () => {
      authService.setTokens('new-token', 'new-refresh-token');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
    });

    test('setUser debe guardar usuario en localStorage', () => {
      const user = { id: 1, email: 'test@test.com' };
      authService.setUser(user);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
    });

    test('clearSession debe limpiar todos los datos de sesión', () => {
      authService.clearSession();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('Refresh Token', () => {
    test('debe refrescar token exitosamente', async () => {
      const mockResponse = {
        token: 'new-jwt-token',
        refreshToken: 'new-refresh-token',
      };

      mockLocalStorage.getItem.mockReturnValue('old-refresh-token');
      apiService.post.mockResolvedValue(mockResponse);

      const result = await authService.refreshToken();

      expect(apiService.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'new-jwt-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
      expect(result).toEqual(mockResponse);
    });

    test('debe manejar errores al refrescar token', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-refresh-token');
      apiService.post.mockRejectedValue(new Error('Invalid refresh token'));

      await expect(authService.refreshToken()).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('Verify Token', () => {
    test('debe verificar token exitosamente', async () => {
      const mockResponse = { valid: true };
      mockLocalStorage.getItem.mockReturnValue('mock-token');
      apiService.post.mockResolvedValue(mockResponse);

      const result = await authService.verifyToken();

      expect(apiService.post).toHaveBeenCalledWith('/auth/verify', { token: 'mock-token' });
      expect(result).toBe(true);
    });

    test('debe retornar false si el token no es válido', async () => {
      const mockResponse = { valid: false };
      mockLocalStorage.getItem.mockReturnValue('invalid-token');
      apiService.post.mockResolvedValue(mockResponse);

      const result = await authService.verifyToken();

      expect(result).toBe(false);
    });
  });

  describe('Token Info', () => {
    test('debe obtener información del token', () => {
      const mockToken = 'valid-jwt-token';
      const mockDecoded = { 
        sub: 'user123', 
        exp: Date.now() / 1000 + 3600,
        iat: Date.now() / 1000,
        role: 'admin'
      };

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      jwtDecode.mockReturnValue(mockDecoded);

      const result = authService.getTokenInfo();

      expect(result).toEqual(mockDecoded);
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    test('debe retornar null si no hay token', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      expect(authService.getTokenInfo()).toBeNull();
    });
  });

  describe('Token Expiration', () => {
    test('debe detectar token que expira pronto', () => {
      const mockToken = 'expiring-token';
      const mockDecoded = { 
        exp: Date.now() / 1000 + 180 // Expira en 3 minutos
      };

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      jwtDecode.mockReturnValue(mockDecoded);

      expect(authService.isTokenExpiringSoon(5)).toBe(true);
    });

    test('debe detectar token que no expira pronto', () => {
      const mockToken = 'valid-token';
      const mockDecoded = { 
        exp: Date.now() / 1000 + 3600 // Expira en 1 hora
      };

      mockLocalStorage.getItem.mockReturnValue(mockToken);
      jwtDecode.mockReturnValue(mockDecoded);

      expect(authService.isTokenExpiringSoon(5)).toBe(false);
    });
  });

  describe('Profile Management', () => {
    test('debe actualizar perfil exitosamente', async () => {
      const profileData = { name: 'New Name', email: 'new@test.com' };
      const mockResponse = {
        user: { id: 1, name: 'New Name', email: 'new@test.com' },
      };

      apiService.put.mockResolvedValue(mockResponse);

      const result = await authService.updateProfile(profileData);

      expect(apiService.put).toHaveBeenCalledWith('/auth/profile', profileData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
      expect(result).toEqual(mockResponse);
    });

    test('debe obtener perfil exitosamente', async () => {
      const mockResponse = {
        user: { id: 1, name: 'Test User', email: 'test@test.com' },
      };

      apiService.get.mockResolvedValue(mockResponse);

      const result = await authService.getProfile();

      expect(apiService.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual(mockResponse);
    });
  });
}); 