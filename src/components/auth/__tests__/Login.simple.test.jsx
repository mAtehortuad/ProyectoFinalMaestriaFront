import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../Login';

// Mock simple del contexto de autenticación
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    error: null,
    clearError: jest.fn(),
  }),
}));

// Mock simple de react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('Login Component - Simple Test', () => {
  test('debe renderizar el título de la biblioteca', () => {
    render(<Login />);
    
    // Verificar que el título esté presente
    expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument();
  });

  test('debe renderizar el formulario de login', () => {
    render(<Login />);
    
    // Verificar elementos básicos del formulario
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByText('Ingresa tus credenciales para acceder al sistema')).toBeInTheDocument();
  });
}); 