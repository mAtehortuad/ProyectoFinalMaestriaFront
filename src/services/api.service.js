import axios from 'axios';
import API_CONFIG, { getApiUrl } from '../config/api.config';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('authToken', token);

          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (error) {
        // Si falla el refresh, limpiar tokens y redirigir al login
        console.error('Token refresh failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Clase base para servicios de API
class ApiService {
  constructor() {
    this.client = apiClient;
  }

  // Método genérico para peticiones GET
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Método genérico para peticiones POST
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Método genérico para peticiones PUT
  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Método genérico para peticiones DELETE
  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Método genérico para peticiones PATCH
  async patch(endpoint, data = {}) {
    try {
      const response = await this.client.patch(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Manejo centralizado de errores
  handleError(error) {
    console.error('API Error:', error);

    // Log del error para auditoría
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.group('API Error Details');
      console.log('URL:', error.config?.url);
      console.log('Method:', error.config?.method);
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.groupEnd();
    }

    // Aquí se podría implementar un sistema de notificaciones
    // o logging para auditoría
  }
}

// Instancia global del servicio de API
const apiService = new ApiService();

export default apiService; 