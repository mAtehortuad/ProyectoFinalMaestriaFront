// Configuración de la API para el sistema de gestión de biblioteca
// Proyecto Final de Maestría

const API_CONFIG = {
  // URL base de la API (Mockoon por defecto)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  // Timeout para las peticiones (30 segundos)
  TIMEOUT: 30000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints de la API
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/api/login',
      LOGOUT: '/api/logout',
      REFRESH: '/api/refresh',
      VERIFY: '/api/verify',
    },
    
    // Usuarios
    USERS: {
      BASE: '/api/users',
      PROFILE: '/api/users/profile',
      UPDATE_PROFILE: '/api/users/profile/update',
    },
    
    // Libros
    BOOKS: {
      BASE: '/api/libros',
      SEARCH: '/api/libros',
      BY_CATEGORY: '/api/libros/category',
      BY_STATUS: '/api/libros/status',
    },
    
    // Préstamos
    LOANS: {
      BASE: '/api/loans',
      USER_LOANS: '/api/loans/user',
      RETURN: '/api/loans/return',
      EXTEND: '/api/loans/extend',
    },
    
    // Categorías
    CATEGORIES: {
      BASE: '/api/categories',
    },
    
    // Estados de libros
    BOOK_STATUS: {
      BASE: '/api/book-status',
    },
  },
  
  // Configuración de seguridad
  SECURITY: {
    // Clave para encriptar datos sensibles en localStorage
    ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || 'biblioteca-maestria-2024',
    
    // Tiempo de expiración del token (24 horas)
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000,
    
    // Tiempo de expiración del refresh token (7 días)
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // Configuración de caché
  CACHE: {
    // Tiempo de caché para datos estáticos (5 minutos)
    STATIC_DATA: 5 * 60 * 1000,
    
    // Tiempo de caché para datos dinámicos (1 minuto)
    DYNAMIC_DATA: 60 * 1000,
  },
};

// Configuración de roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  LIBRARIAN: 'librarian',
};

// Configuración de estados de libros
export const BOOK_STATUS = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
  LOST: 'lost',
  DAMAGED: 'damaged',
};

// Configuración de estados de préstamos
export const LOAN_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
  EXTENDED: 'extended',
};

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener headers con token de autenticación
export const getAuthHeaders = (token) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`,
  };
};

export default API_CONFIG; 