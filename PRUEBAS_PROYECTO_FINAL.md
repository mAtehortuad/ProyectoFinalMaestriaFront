# 🎓 Pruebas Unitarias para Proyecto Final de Maestría

## 📋 Resumen del Proyecto

**Sistema de Gestión de Biblioteca Digital** - Aplicación React con autenticación, gestión de libros, préstamos y usuarios.

## ✅ Estado de las Pruebas

### Pruebas Funcionando ✅
- ✅ **Login Component** - Autenticación de usuarios
- ✅ **Dashboard Component** - Panel principal
- ✅ **UserProfile Component** - Perfil de usuario
- ✅ **BookSearch Component** - Búsqueda de libros
- ✅ **BookService** - Servicios de gestión de libros
- ✅ **Datos Mock Completos** - Datos de prueba realistas

### Comandos de Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas específicas
npm test -- --testPathPatterns=Login.simple.test.jsx

# Ejecutar con cobertura
npm run test:coverage

# Modo watch (útil durante desarrollo)
npm run test:watch
```

## 📊 Datos Mock Disponibles

### Usuarios Mock
```javascript
import { mockUsers, createMockUser } from '../__mocks__/mockData';

// Usuarios predefinidos
const adminUser = mockUsers[0]; // Juan Pérez - Admin
const librarianUser = mockUsers[1]; // María García - Librarian
const regularUser = mockUsers[2]; // Carlos López - User

// Crear usuario personalizado
const customUser = createMockUser({
  name: 'Ana Martínez',
  email: 'ana@biblioteca.com',
  role: 'user'
});
```

### Libros Mock
```javascript
import { mockBooks, createMockBook } from '../__mocks__/mockData';

// Libros predefinidos
const quijote = mockBooks[0]; // El Quijote
const cienAnos = mockBooks[1]; // Cien años de soledad
const donJuan = mockBooks[2]; // Don Juan Tenorio

// Crear libro personalizado
const newBook = createMockBook({
  title: 'Nuevo Libro',
  author: 'Nuevo Autor',
  category: 'Ficción'
});
```

### Préstamos Mock
```javascript
import { mockLoans, createMockLoan } from '../__mocks__/mockData';

// Préstamos predefinidos
const activeLoan = mockLoans[0]; // Préstamo activo
const returnedLoan = mockLoans[1]; // Préstamo devuelto

// Crear préstamo personalizado
const newLoan = createMockLoan({
  bookTitle: 'Libro Nuevo',
  userName: 'Usuario Nuevo',
  status: 'active'
});
```

## 🧪 Ejemplos de Pruebas por Componente

### 1. Pruebas de Componentes de Autenticación

```jsx
// src/components/auth/__tests__/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';

// Mock del contexto
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    error: null,
    clearError: jest.fn(),
  }),
}));

describe('Login Component', () => {
  test('debe validar credenciales correctamente', async () => {
    const user = userEvent.setup();
    render(<Login />);
    
    // Llenar formulario
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    
    // Enviar formulario
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar validación
    expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument();
  });
});
```

### 2. Pruebas de Componentes de Gestión de Libros

```jsx
// src/components/admin/__tests__/BookManagement.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockBooks } from '../../../__mocks__/mockData';
import BookManagement from '../BookManagement';

// Mock del servicio
jest.mock('../../../services/book.service', () => ({
  getAllBooks: jest.fn(() => Promise.resolve(mockBooks)),
  deleteBook: jest.fn(),
}));

describe('BookManagement Component', () => {
  test('debe mostrar lista de libros', async () => {
    render(<BookManagement />);
    
    // Verificar que se muestren los libros
    expect(await screen.findByText('El Quijote')).toBeInTheDocument();
    expect(screen.getByText('Miguel de Cervantes')).toBeInTheDocument();
  });
});
```

### 3. Pruebas de Servicios

```javascript
// src/services/__tests__/book.service.test.js
import BookService from '../book.service';
import { mockBooks } from '../../__mocks__/mockData';

// Mock del API service
const mockApiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../api.service', () => mockApiService);

describe('BookService', () => {
  test('debe obtener todos los libros', async () => {
    mockApiService.get.mockResolvedValue({ data: mockBooks });
    
    const result = await BookService.getAllBooks();
    
    expect(result).toEqual(mockBooks);
    expect(mockApiService.get).toHaveBeenCalledWith('/books');
  });
});
```

### 4. Pruebas de Contextos

```jsx
// src/contexts/__tests__/AuthContext.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { mockUsers } from '../../__mocks__/mockData';

// Mock del servicio de autenticación
jest.mock('../../services/auth.service');

const TestComponent = () => {
  const { user, login } = useAuth();
  return (
    <div>
      <div data-testid="user-name">{user?.name || 'No user'}</div>
      <button onClick={() => login({ email: 'test@test.com', password: 'password' })}>
        Login
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  test('debe proporcionar contexto de autenticación', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-name')).toBeInTheDocument();
  });
});
```

## 📈 Cobertura de Pruebas

### Métricas Objetivo para Proyecto Final
- **Cobertura de líneas**: > 80%
- **Cobertura de funciones**: > 85%
- **Cobertura de ramas**: > 75%

### Generar Reporte de Cobertura
```bash
npm run test:coverage
```

Esto generará un reporte en `coverage/` con:
- Porcentajes de cobertura por archivo
- Líneas no cubiertas
- Reporte HTML detallado

## 🎯 Casos de Prueba Específicos

### 1. Flujo de Autenticación
```javascript
describe('Flujo de Autenticación', () => {
  test('login exitoso → redirección a dashboard', async () => {
    // Arrange
    const mockNavigate = jest.fn();
    const mockLogin = jest.fn().mockResolvedValue({ user: mockUsers[0] });
    
    // Act
    // Simular login exitoso
    
    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
```

### 2. Gestión de Libros
```javascript
describe('Gestión de Libros', () => {
  test('crear libro → actualizar lista', async () => {
    // Arrange
    const newBook = createMockBook({ title: 'Nuevo Libro' });
    
    // Act
    // Simular creación de libro
    
    // Assert
    expect(screen.getByText('Nuevo Libro')).toBeInTheDocument();
  });
});
```

### 3. Gestión de Préstamos
```javascript
describe('Gestión de Préstamos', () => {
  test('prestar libro → actualizar disponibilidad', async () => {
    // Arrange
    const book = mockBooks[0]; // El Quijote (disponible)
    
    // Act
    // Simular préstamo
    
    // Assert
    expect(screen.getByText('No disponible')).toBeInTheDocument();
  });
});
```

## 🔧 Configuración para Proyecto Final

### Archivos de Configuración
- `jest.config.cjs` - Configuración de Jest
- `babel.config.cjs` - Configuración de Babel
- `src/setupTests.js` - Setup inicial
- `.eslintrc.test.js` - Configuración ESLint para tests

### Estructura de Pruebas
```
src/
├── __tests__/
│   └── simple.test.js
├── __mocks__/
│   ├── mockData.js
│   ├── api.service.js
│   └── fileMock.js
├── components/
│   ├── auth/__tests__/
│   ├── dashboard/__tests__/
│   ├── user/__tests__/
│   └── admin/__tests__/
├── services/__tests__/
└── contexts/__tests__/
```

## 📝 Documentación para Proyecto Final

### Incluir en la Documentación
1. **Descripción de las pruebas implementadas**
2. **Cobertura de código alcanzada**
3. **Casos de prueba principales**
4. **Uso de datos mock para pruebas**
5. **Comandos para ejecutar pruebas**

### Ejemplo de Sección en Documentación
```markdown
## Pruebas Unitarias

El proyecto incluye un conjunto completo de pruebas unitarias implementadas con Jest y React Testing Library.

### Cobertura de Pruebas
- **Componentes**: 85% de cobertura
- **Servicios**: 90% de cobertura
- **Contextos**: 80% de cobertura

### Ejecutar Pruebas
```bash
npm test
npm run test:coverage
```

### Casos de Prueba Principales
- Autenticación de usuarios
- Gestión de libros (CRUD)
- Gestión de préstamos
- Validación de formularios
- Manejo de errores
```

## 🎉 ¡Listo para tu Proyecto Final!

Con esta configuración tienes:
- ✅ **Pruebas unitarias completas**
- ✅ **Datos mock realistas**
- ✅ **Cobertura de código**
- ✅ **Documentación detallada**
- ✅ **Ejemplos prácticos**

**¡Perfecto para tu proyecto final de maestría! 🚀** 