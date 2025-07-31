# Sistema de Gestión de Biblioteca Digital

## 📚 Proyecto Final de Maestría

Sistema completo de gestión de préstamos e inventario de libros desarrollado con React y Material-UI, diseñado para administradores, bibliotecarios y usuarios finales.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Login seguro con JWT
- Roles de usuario (Administrador, Bibliotecario, Usuario)
- Protección de rutas por rol
- Refresh tokens automático

### 📊 Dashboard Inteligente
- **Administrador**: Gestión completa del sistema
- **Bibliotecario**: Gestión de préstamos e inventario
- **Usuario**: Consulta de libros y préstamos personales

### 🎨 Diseño Moderno
- Paleta de colores café elegante
- Interfaz responsive y accesible
- Animaciones suaves y transiciones
- Material-UI con tema personalizado

### 🔧 Funcionalidades por Rol

#### 👑 Administrador
- Gestión de usuarios
- Administración de libros
- Reportes del sistema
- Configuración general
- Gestión de estados de libros
- Categorías de libros

#### 📖 Bibliotecario
- Procesar préstamos y devoluciones
- Búsqueda de libros
- Agregar nuevos libros
- Gestión de usuarios
- Reportes de actividad
- Actualizar estados de libros

#### 👤 Usuario
- Ver préstamos personales
- Buscar libros disponibles
- Solicitar préstamos
- Ver perfil personal
- Historial de préstamos
- Notificaciones

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 19.1.0
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router DOM
- **Formularios**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Autenticación**: JWT
- **Build Tool**: Vite
- **Linting**: ESLint

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd ProyectoFinalMaestriaFront
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENCRYPTION_KEY=tu-clave-secreta-aqui
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_BASE_URL` | URL base de la API | `http://localhost:3001` |
| `VITE_ENCRYPTION_KEY` | Clave de encriptación | `biblioteca-maestria-2024-secure-key` |
| `VITE_APP_NAME` | Nombre de la aplicación | `Sistema de Gestión de Biblioteca` |
| `VITE_ENABLE_DEBUG` | Habilitar logs de debug | `true` |

### Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Componentes de autenticación
│   └── dashboard/      # Componentes del dashboard
├── contexts/           # Contextos de React
├── services/           # Servicios de API
├── config/             # Configuraciones
├── theme/              # Tema de Material-UI
└── assets/             # Recursos estáticos
```

## 🎨 Paleta de Colores

### Colores Principales
- **Café Principal**: `#8B4513` (Saddle Brown)
- **Café Secundario**: `#D2691E` (Chocolate)
- **Café Claro**: `#DEB887` (Burly Wood)

### Colores de Fondo
- **Fondo Principal**: `#FDF5E6` (Old Lace)
- **Fondo Secundario**: `#FAF0E6` (Linen)

### Colores de Texto
- **Texto Principal**: `#2F1B14` (Café muy oscuro)
- **Texto Secundario**: `#5D4037` (Café medio)

## 🔐 Credenciales de Demostración

### Administrador
- **Email**: admin@biblioteca.com
- **Contraseña**: admin123

### Bibliotecario
- **Email**: bibliotecario@biblioteca.com
- **Contraseña**: lib123

### Usuario
- **Email**: usuario@biblioteca.com
- **Contraseña**: user123

## 📋 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Refrescar token
- `GET /auth/verify` - Verificar token

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users/profile` - Obtener perfil
- `PUT /users/profile/update` - Actualizar perfil

### Libros
- `GET /books` - Listar libros
- `POST /books` - Crear libro
- `PUT /books/:id` - Actualizar libro
- `DELETE /books/:id` - Eliminar libro
- `GET /books/search` - Buscar libros
- `GET /books/category/:id` - Libros por categoría
- `GET /books/status/:status` - Libros por estado

### Préstamos
- `GET /loans` - Listar préstamos
- `POST /loans` - Crear préstamo
- `PUT /loans/:id/return` - Devolver libro
- `PUT /loans/:id/extend` - Extender préstamo
- `GET /loans/user` - Préstamos del usuario

## 🛡️ Seguridad

### Implementaciones de Seguridad
- Autenticación JWT con refresh tokens
- Encriptación de datos sensibles en localStorage
- Validación de formularios con Yup
- Protección de rutas por rol
- Interceptores de Axios para manejo de errores
- Timeout automático de sesiones

### Buenas Prácticas
- Separación de responsabilidades
- Componentes reutilizables
- Manejo centralizado de estado
- Validación de entrada
- Logging para auditoría
- Código limpio y documentado

## 📱 Responsive Design

El sistema está completamente optimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔍 Funcionalidades Futuras

- [ ] Modo oscuro
- [ ] Notificaciones push
- [ ] Exportación de reportes a PDF
- [ ] Búsqueda avanzada con filtros
- [ ] Sistema de reservas
- [ ] Integración con códigos QR
- [ ] Dashboard con gráficos interactivos
- [ ] Sistema de multas automático

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, asegúrate de que tu backend esté configurado correctamente para aceptar peticiones desde `http://localhost:5173`.

### Error de Autenticación
Verifica que las credenciales de demostración sean correctas y que el backend esté funcionando.

### Problemas de Estilo
Si los estilos no se cargan correctamente, ejecuta:
```bash
npm run build
npm run preview
```

## 📄 Licencia

Este proyecto es parte del trabajo final de maestría y está destinado únicamente para fines educativos y de demostración.

## 👨‍💻 Autor

Desarrollado como proyecto final de maestría en desarrollo de software.

---

**Nota**: Este sistema está diseñado para trabajar con un backend compatible. Para pruebas, se recomienda usar Mockoon o un servidor de desarrollo similar.
