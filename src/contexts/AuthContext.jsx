import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

// Crear contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar estado de autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay un token válido
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          
          // Verificar token con el servidor
          const isValid = await authService.verifyToken();
          if (!isValid) {
            await authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error.message);
        await authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      setUser(response.user);
      
      return response;
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error en el login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Limpiar estado local aunque falle el logout en el servidor
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(profileData);
      setUser(response.user);
      
      return response;
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error al actualizar perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar usuario (usada en Settings)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Verificar si es administrador
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Verificar si es bibliotecario
  const isLibrarian = () => {
    return hasRole('librarian');
  };

  // Verificar si es usuario normal
  const isUser = () => {
    return hasRole('user');
  };

  // Verificar si tiene permisos de administrador o bibliotecario
  const isStaff = () => {
    return isAdmin() || isLibrarian();
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    updateUser,
    clearError,
    hasRole,
    isAdmin,
    isLibrarian,
    isUser,
    isStaff,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 