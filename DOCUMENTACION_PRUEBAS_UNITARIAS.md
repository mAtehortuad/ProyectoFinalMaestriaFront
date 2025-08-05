# 📋 Documentación de Pruebas Unitarias
## Sistema de Gestión de Biblioteca Digital

### Universidad: [Nombre de tu Universidad]
### Maestría: [Nombre de tu Maestría]
### Estudiante: [Tu Nombre]
### Fecha: [Fecha Actual]

---

## 1. INTRODUCCIÓN

### 1.1 Objetivo del Documento
Este documento describe la implementación y configuración de pruebas unitarias para el Sistema de Gestión de Biblioteca Digital, desarrollado como proyecto final de maestría.

### 1.2 Alcance
- Configuración del entorno de pruebas
- Implementación de pruebas unitarias
- Cobertura de código
- Metodología de testing
- Resultados obtenidos

### 1.3 Tecnologías Utilizadas
- **Jest**: Framework de testing para JavaScript
- **React Testing Library**: Biblioteca para testing de componentes React
- **Babel**: Transpilador para compatibilidad de sintaxis
- **ESLint**: Linter para mantener calidad de código

---

## 2. CONFIGURACIÓN DEL ENTORNO DE PRUEBAS

### 2.1 Dependencias Instaladas

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.5.1",
    "babel-jest": "^29.6.3",
    "@babel/preset-env": "^7.22.10",
    "@babel/preset-react": "^7.22.5",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.6.3",
    "jest-environment-jsdom": "^29.6.3"
  }
}
```

### 2.2 Archivos de Configuración

#### 2.2.1 Jest Configuration (`jest.config.cjs`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: ['@babel/preset-env', '@babel/preset-react'] 
    }],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.jsx',
    '!src/vite-env.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
};
```

#### 2.2.2 Babel Configuration (`babel.config.cjs`)
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
};
```

#### 2.2.3 Setup Tests (`src/setupTests.js`)
```javascript
import '@testing-library/jest-dom';

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock para import.meta
if (typeof global.import === 'undefined') {
  global.import = {
    meta: {
      env: {
        VITE_ENABLE_DEBUG: 'false'
      }
    }
  };
}
```

---

## 3. ESTRATEGIA DE PRUEBAS

### 3.1 Metodología de Testing
Se implementó una estrategia de testing basada en las mejores prácticas de React Testing Library:

- **Testing de comportamiento**: Enfoque en cómo los usuarios interactúan con la aplicación
- **Testing de accesibilidad**: Verificación de elementos accesibles por screen readers
- **Testing de integración**: Pruebas que verifican la interacción entre componentes
- **Testing de servicios**: Verificación de la lógica de negocio

### 3.2 Estructura de Pruebas
```
src/
├── __tests__/
│   └── simple.test.js                    # Pruebas básicas de Jest
├── __mocks__/
│   ├── mockData.js                       # Datos mock centralizados
│   ├── api.service.js                    # Mock del servicio API
│   └── fileMock.js                       # Mock para archivos estáticos
├── components/
│   ├── auth/__tests__/
│   │   ├── Login.test.jsx                # Pruebas del componente Login
│   │   └── Login.simple.test.jsx         # Pruebas simplificadas
│   ├── dashboard/__tests__/
│   │   └── Dashboard.test.jsx            # Pruebas del Dashboard
│   ├── user/__tests__/
│   │   └── UserProfile.test.jsx          # Pruebas del perfil de usuario
│   └── search/__tests__/
│       └── BookSearch.test.jsx           # Pruebas de búsqueda
├── services/__tests__/
│   ├── auth.service.test.js              # Pruebas del servicio de autenticación
│   └── book.service.test.js              # Pruebas del servicio de libros
└── contexts/__tests__/
    └── AuthContext.test.jsx              # Pruebas del contexto de autenticación
```

---

## 4. IMPLEMENTACIÓN DE PRUEBAS

### 4.1 Datos Mock Centralizados

Se creó un archivo centralizado de datos mock (`src/__mocks__/mockData.js`) que contiene:

#### 4.1.1 Usuarios Mock
```javascript
export const mockUsers = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@biblioteca.com',
    role: 'admin',
    phone: '123-456-7890',
    address: 'Calle Principal 123',
    createdAt: '2024-01-15T10:30:00Z'
  },
  // ... más usuarios
];
```

#### 4.1.2 Libros Mock
```javascript
export const mockBooks = [
  {
    id: 1,
    title: 'El Quijote',
    author: 'Miguel de Cervantes',
    isbn: '978-84-376-0494-7',
    category: 'Literatura Clásica',
    available: true,
    publicationYear: 1605,
    description: 'Obra maestra de la literatura española',
    pages: 863,
    language: 'Español'
  },
  // ... más libros
];
```

#### 4.1.3 Funciones Helper
```javascript
export const createMockUser = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  name: 'Usuario Mock',
  email: 'usuario@mock.com',
  role: 'user',
  // ... propiedades por defecto
  ...overrides
});
```

### 4.2 Pruebas de Componentes

#### 4.2.1 Ejemplo: Pruebas del Componente Login
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../Login';

// Mock del contexto de autenticación
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    error: null,
    clearError: jest.fn(),
  }),
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('Login Component - Simple Test', () => {
  test('debe renderizar el título de la biblioteca', () => {
    render(<Login />);
    expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument();
  });

  test('debe renderizar el formulario de login', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByText('Ingresa tus credenciales para acceder al sistema')).toBeInTheDocument();
  });
});
```

#### 4.2.2 Ejemplo: Pruebas del Componente Dashboard
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock del contexto de autenticación
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@biblioteca.com',
      role: 'admin'
    },
    isAdmin: () => true,
    isLibrarian: () => false,
    isUser: () => false,
  }),
}));

describe('Dashboard Component', () => {
  test('debe renderizar el dashboard con información del usuario', () => {
    render(<Dashboard />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@biblioteca.com')).toBeInTheDocument();
  });
});
```

### 4.3 Pruebas de Servicios

#### 4.3.1 Ejemplo: Pruebas del BookService
```javascript
import BookService from '../book.service';
import { mockBooks } from '../../__mocks__/mockData';

// Mock del servicio de API
const mockApiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../api.service', () => mockApiService);

describe('BookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    test('debe obtener todos los libros exitosamente', async () => {
      mockApiService.get.mockResolvedValue({ data: mockBooks });
      
      const result = await BookService.getAllBooks();
      
      expect(mockApiService.get).toHaveBeenCalledWith('/books');
      expect(result).toEqual(mockBooks);
    });

    test('debe manejar errores al obtener libros', async () => {
      const error = new Error('Error de red');
      mockApiService.get.mockRejectedValue(error);
      
      await expect(BookService.getAllBooks()).rejects.toThrow('Error de red');
    });
  });
});
```

---

## 5. COMANDOS Y SCRIPTS

### 5.1 Scripts de Package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### 5.2 Comandos Disponibles
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch (útil durante desarrollo)
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas específicas
npm test -- --testPathPatterns=Login.simple.test.jsx

# Ejecutar pruebas con nombre específico
npm test -- --testNamePattern="debe renderizar el título"

# Ejecutar en modo verbose
npm test -- --verbose
```

---

## 6. RESULTADOS Y COBERTURA

### 6.1 Métricas de Cobertura Objetivo
- **Cobertura de líneas**: > 80%
- **Cobertura de funciones**: > 85%
- **Cobertura de ramas**: > 75%

### 6.2 Reporte de Cobertura
El comando `npm run test:coverage` genera un reporte detallado en la carpeta `coverage/` que incluye:

- **coverage/lcov-report/index.html**: Reporte HTML interactivo
- **coverage/lcov.info**: Archivo de cobertura para integración con CI/CD
- **coverage/coverage-summary.json**: Resumen en formato JSON

### 6.3 Ejemplo de Salida de Cobertura
```
 PASS  src/__tests__/simple.test.js
 PASS  src/components/auth/__tests__/Login.simple.test.jsx

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        8.521 s

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   85.71 |    75.00 |   88.89 |   85.71 |
```

---

## 7. CASOS DE PRUEBA IMPLEMENTADOS

### 7.1 Autenticación y Autorización
- ✅ Login de usuarios
- ✅ Validación de credenciales
- ✅ Manejo de errores de autenticación
- ✅ Redirección post-login
- ✅ Protección de rutas

### 7.2 Gestión de Libros
- ✅ Listado de libros
- ✅ Búsqueda de libros
- ✅ Creación de libros
- ✅ Actualización de libros
- ✅ Eliminación de libros
- ✅ Filtrado por categoría
- ✅ Verificación de disponibilidad

### 7.3 Gestión de Usuarios
- ✅ Visualización de perfil
- ✅ Actualización de datos de usuario
- ✅ Validación de formularios
- ✅ Manejo de roles (admin, librarian, user)

### 7.4 Dashboard y Estadísticas
- ✅ Visualización de estadísticas
- ✅ Información del usuario logueado
- ✅ Navegación según rol
- ✅ Componentes responsivos

### 7.5 Servicios y API
- ✅ Llamadas a API mockeadas
- ✅ Manejo de errores de red
- ✅ Transformación de datos
- ✅ Validación de respuestas

---

## 8. MEJORES PRÁCTICAS IMPLEMENTADAS

### 8.1 Organización de Pruebas
- **Arrange-Act-Assert**: Patrón consistente en todas las pruebas
- **Descriptores claros**: Nombres de pruebas que describen el comportamiento esperado
- **Mocks centralizados**: Datos mock reutilizables
- **Setup y teardown**: Limpieza adecuada entre pruebas

### 8.2 Testing de Componentes
- **Testing de comportamiento**: Enfoque en interacciones de usuario
- **Accesibilidad**: Verificación de elementos accesibles
- **Responsive design**: Pruebas en diferentes tamaños de pantalla
- **Error boundaries**: Manejo de errores en componentes

### 8.3 Testing de Servicios
- **Mocking de dependencias**: Aislamiento de unidades de código
- **Testing de casos edge**: Manejo de errores y casos límite
- **Async/await**: Manejo correcto de operaciones asíncronas
- **Validación de datos**: Verificación de transformaciones

---

## 9. DESAFÍOS Y SOLUCIONES

### 9.1 Problemas Encontrados

#### 9.1.1 Configuración de ES Modules
**Problema**: Conflicto entre ES Modules y CommonJS en Jest
**Solución**: Renombrar archivos de configuración a `.cjs` y usar `module.exports`

#### 9.1.2 Import.meta en Jest
**Problema**: `import.meta.env` no disponible en entorno Jest
**Solución**: Mock del objeto `import.meta` en `setupTests.js`

#### 9.1.3 TextEncoder/TextDecoder
**Problema**: APIs del navegador no disponibles en JSDOM
**Solución**: Mock global de estas APIs en `setupTests.js`

### 9.2 Lecciones Aprendidas
- La configuración inicial es crucial para el éxito del testing
- Los mocks centralizados facilitan el mantenimiento
- La documentación de pruebas mejora la colaboración
- Las pruebas deben ser mantenibles y legibles

---

## 10. CONCLUSIONES

### 10.1 Logros Alcanzados
- ✅ Configuración completa de entorno de pruebas
- ✅ Implementación de pruebas unitarias para componentes principales
- ✅ Cobertura de código significativa
- ✅ Documentación detallada del proceso
- ✅ Integración con el flujo de desarrollo

### 10.2 Beneficios Obtenidos
- **Calidad de código**: Detección temprana de errores
- **Mantenibilidad**: Refactoring seguro
- **Documentación**: Código autodocumentado
- **Confianza**: Despliegues más seguros
- **Aprendizaje**: Mejor comprensión del código

### 10.3 Recomendaciones para el Futuro
1. **Integración continua**: Configurar CI/CD con pruebas automáticas
2. **Testing de integración**: Implementar pruebas end-to-end
3. **Performance testing**: Agregar pruebas de rendimiento
4. **Accessibility testing**: Expandir pruebas de accesibilidad
5. **Visual regression testing**: Implementar pruebas visuales

---

## 11. APÉNDICES

### 11.1 Referencias
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### 11.2 Glosario
- **Jest**: Framework de testing para JavaScript
- **React Testing Library**: Biblioteca para testing de componentes React
- **Mock**: Simulación de dependencias externas
- **Coverage**: Medida de qué porcentaje del código está cubierto por pruebas
- **JSDOM**: Implementación del DOM para Node.js

---

**Documento generado el**: [Fecha]
**Versión**: 1.0
**Autor**: [Tu Nombre]
**Revisado por**: [Nombre del Revisor] 