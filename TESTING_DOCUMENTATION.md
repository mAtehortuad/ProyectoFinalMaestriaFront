# Documentación de Pruebas Unitarias

## Configuración de Jest

Este proyecto utiliza Jest como framework de pruebas unitarias junto con React Testing Library para probar componentes de React.

### Dependencias Instaladas

```json
{
  "jest": "^29.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@testing-library/user-event": "^14.0.0",
  "jest-environment-jsdom": "^29.0.0",
  "@babel/preset-env": "^7.0.0",
  "@babel/preset-react": "^7.0.0",
  "babel-jest": "^29.0.0",
  "identity-obj-proxy": "^3.0.0"
}
```

### Archivos de Configuración

#### `jest.config.js`
Configuración principal de Jest con soporte para:
- Entorno jsdom para simular el DOM del navegador
- Transformación de archivos JSX con Babel
- Mapeo de módulos para archivos estáticos
- Configuración de cobertura de código
- Patrones de archivos de prueba

#### `babel.config.js`
Configuración de Babel para transformar código moderno de JavaScript y JSX.

#### `src/setupTests.js`
Configuración inicial para todos los tests, incluyendo:
- Importación de matchers personalizados de jest-dom
- Mocks para APIs del navegador (matchMedia, IntersectionObserver)

#### `.eslintrc.test.js`
Configuración específica de ESLint para archivos de prueba que permite:
- Variables globales de Jest (describe, test, expect, etc.)
- Sintaxis JSX
- Reglas específicas para testing

## Scripts de Pruebas

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage --watchAll=false"
}
```

### Comandos Disponibles

- `npm test`: Ejecuta todas las pruebas una vez
- `npm run test:watch`: Ejecuta pruebas en modo watch (útil durante desarrollo)
- `npm run test:coverage`: Ejecuta pruebas y genera reporte de cobertura
- `npm run test:ci`: Ejecuta pruebas en modo CI/CD

## Estructura de Pruebas

### Convenciones de Nomenclatura

- Archivos de prueba: `*.test.jsx` o `*.spec.jsx`
- Directorios de prueba: `__tests__/`
- Ubicación: Junto al archivo que se está probando o en subdirectorio `__tests__`

### Ejemplo de Estructura

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── __tests__/
│   │       └── Login.test.jsx
│   └── dashboard/
│       ├── Dashboard.jsx
│       └── __tests__/
│           └── Dashboard.test.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── __tests__/
│       └── AuthContext.test.jsx
└── services/
    ├── auth.service.js
    └── __tests__/
        └── auth.service.test.js
```

## Pruebas de Componentes

### Ejemplo: Login Component

```jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

// Wrapper para renderizar con providers necesarios
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={createTheme()}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar el formulario de login correctamente', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });
});
```

### Mejores Prácticas para Componentes

1. **Usar data-testid para elementos difíciles de seleccionar**
2. **Mockear dependencias externas (contextos, servicios, etc.)**
3. **Probar comportamiento, no implementación**
4. **Usar userEvent para simular interacciones del usuario**
5. **Probar estados de carga y error**
6. **Verificar accesibilidad básica**

## Pruebas de Contextos

### Ejemplo: AuthContext

```jsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import authService from '../../services/auth.service';

jest.mock('../../services/auth.service');

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { user, loading, error, login } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'null'}</div>
      <button data-testid="login-btn" onClick={() => login({ email: 'test@test.com', password: 'password' })}>
        Login
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  test('debe inicializar con estado de carga', () => {
    authService.isAuthenticated.mockReturnValue(false);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });
});
```

## Pruebas de Servicios

### Ejemplo: AuthService

```jsx
import AuthService from '../auth.service';
import apiService from '../api.service';

jest.mock('../api.service');

describe('AuthService', () => {
  let authService;
  let mockLocalStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    authService = new AuthService();
  });

  test('debe hacer login exitosamente', async () => {
    const credentials = { email: 'test@test.com', password: 'password123' };
    const mockResponse = {
      token: 'mock-jwt-token',
      user: { id: 1, email: 'test@test.com', role: 'admin' },
    };

    apiService.post.mockResolvedValue(mockResponse);

    const result = await authService.login(credentials);

    expect(apiService.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual(mockResponse);
  });
});
```

## Mocks y Stubs

### Mocking de Dependencias

```jsx
// Mock de un servicio
jest.mock('../services/auth.service');

// Mock de un contexto
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    error: null,
    clearError: jest.fn(),
  }),
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
```

### Mocking de APIs del Navegador

```jsx
// Mock de localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});
```

## Cobertura de Código

### Configuración de Cobertura

Jest genera reportes de cobertura que incluyen:
- **Statements**: Porcentaje de declaraciones ejecutadas
- **Branches**: Porcentaje de ramas de código ejecutadas
- **Functions**: Porcentaje de funciones ejecutadas
- **Lines**: Porcentaje de líneas ejecutadas

### Excluir Archivos de Cobertura

```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.d.ts',
  '!src/main.jsx',
  '!src/**/__tests__/**',
  '!src/**/*.test.{js,jsx,ts,tsx}',
  '!src/**/*.spec.{js,jsx,ts,tsx}'
]
```

## Matchers Personalizados

### jest-dom

Incluye matchers adicionales para DOM:

```jsx
expect(element).toBeInTheDocument();
expect(element).toHaveClass('my-class');
expect(element).toHaveAttribute('data-testid', 'my-element');
expect(element).toBeVisible();
expect(element).toBeDisabled();
```

## Debugging de Pruebas

### Comandos Útiles

```bash
# Ejecutar una prueba específica
npm test -- --testNamePattern="Login Component"

# Ejecutar pruebas de un archivo específico
npm test -- Login.test.jsx

# Ejecutar en modo verbose
npm test -- --verbose

# Ejecutar con coverage y mostrar reporte
npm run test:coverage
```

### Debugging Visual

```jsx
// Usar screen.debug() para ver el DOM renderizado
screen.debug();

// Usar screen.debug(element) para ver un elemento específico
screen.debug(screen.getByRole('button'));
```

## Integración con CI/CD

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v1
        with:
          file: ./coverage/lcov.info
```

## Mejores Prácticas Generales

1. **Arrange-Act-Assert**: Estructurar pruebas en tres secciones claras
2. **Nombres descriptivos**: Usar nombres que describan el comportamiento esperado
3. **Pruebas aisladas**: Cada prueba debe ser independiente
4. **Mocks apropiados**: Mockear solo lo necesario
5. **Cobertura significativa**: Enfocarse en lógica de negocio crítica
6. **Mantenibilidad**: Escribir pruebas que sean fáciles de mantener

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom) 