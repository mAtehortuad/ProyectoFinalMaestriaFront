import apiService from './api.service';
import API_CONFIG from '../config/api.config';
import { jwtDecode } from 'jwt-decode';

class AuthService {
  constructor() {
    this.api = apiService;
  }

  // Login de usuario
  async login(credentials) {
    try {
      const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.token) {
        this.setTokens(response.token, response.refreshToken);
        this.setUser(response.user);
        return response;
      }
      
      throw new Error('Token no recibido en la respuesta');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout de usuario
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await this.api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Token decode error:', error);
      this.clearSession();
      return false;
    }
  }

  // Obtener información del usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  // Verificar si el usuario es administrador
  isAdmin() {
    return this.hasRole('admin');
  }

  // Verificar si el usuario es bibliotecario
  isLibrarian() {
    return this.hasRole('librarian');
  }

  // Obtener token de acceso
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Obtener refresh token
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  // Establecer tokens en localStorage
  setTokens(token, refreshToken) {
    localStorage.setItem('authToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Establecer información del usuario
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Limpiar sesión
  clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Refrescar token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      if (response.token) {
        this.setTokens(response.token, response.refreshToken);
        return response.token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearSession();
      throw error;
    }
  }

  // Verificar token con el servidor
  async verifyToken() {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.AUTH.VERIFY);
      return response.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  // Obtener información decodificada del token
  getTokenInfo() {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  // Verificar si el token está próximo a expirar
  isTokenExpiringSoon(minutes = 5) {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return false;

    const currentTime = Date.now() / 1000;
    const expirationTime = tokenInfo.exp;
    const timeUntilExpiration = expirationTime - currentTime;
    const minutesUntilExpiration = timeUntilExpiration / 60;

    return minutesUntilExpiration <= minutes;
  }

  // Actualizar perfil de usuario
  async updateProfile(profileData) {
    try {
      const response = await this.api.put(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      
      if (response.user) {
        this.setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Obtener perfil de usuario
  async getProfile() {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.USERS.PROFILE);
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
}

// Instancia global del servicio de autenticación
const authService = new AuthService();

export default authService; 