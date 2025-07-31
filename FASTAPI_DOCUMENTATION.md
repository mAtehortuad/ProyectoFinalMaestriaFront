# 📚 Documentación de la API - Sistema de Biblioteca

## 🚀 Descripción General

Esta documentación describe la API REST desarrollada con FastAPI para el sistema de gestión de biblioteca. La API proporciona endpoints para gestionar usuarios, libros, préstamos, reportes y configuraciones del sistema.

## 🛠️ Tecnologías Utilizadas

- **FastAPI**: Framework web moderno para Python
- **SQLAlchemy**: ORM para manejo de base de datos
- **Pydantic**: Validación de datos y serialización
- **PostgreSQL**: Base de datos principal
- **JWT**: Autenticación y autorización
- **Redis**: Caché y sesiones
- **Docker**: Containerización

## 📋 Estructura del Proyecto

```
biblioteca-api/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── book.py
│   │   ├── loan.py
│   │   └── settings.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── book.py
│   │   ├── loan.py
│   │   └── settings.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── books.py
│   │   │   ├── loans.py
│   │   │   ├── reports.py
│   │   │   └── settings.py
│   │   └── deps.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── config.py
│   │   └── exceptions.py
│   └── utils/
│       ├── __init__.py
│       ├── email.py
│       └── reports.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Todos los endpoints protegidos requieren un token válido en el header `Authorization: Bearer <token>`.

### Endpoints de Autenticación

#### POST /api/login
**Descripción**: Inicia sesión de usuario

**Request Body**:
```json
{
  "email": "admin@biblioteca.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_example",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@biblioteca.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/logout
**Descripción**: Cierra sesión del usuario

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

## 👥 Gestión de Usuarios

### GET /api/users
**Descripción**: Obtiene lista de usuarios (solo admin)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `search`: Término de búsqueda
- `role`: Filtrar por rol
- `status`: Filtrar por estado

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Administrador",
      "email": "admin@biblioteca.com",
      "role": "admin",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### POST /api/users
**Descripción**: Crea un nuevo usuario (solo admin)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@biblioteca.com",
  "password": "password123",
  "role": "user",
  "status": "active"
}
```

### PUT /api/users/{id}
**Descripción**: Actualiza un usuario existente

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Usuario Actualizado",
  "email": "usuario@biblioteca.com",
  "role": "user",
  "status": "active"
}
```

### DELETE /api/users/{id}
**Descripción**: Elimina un usuario (solo admin)

**Headers**: `Authorization: Bearer <token>`

## 📚 Gestión de Libros

### GET /api/books
**Descripción**: Obtiene lista de libros

**Query Parameters**:
- `page`: Número de página
- `limit`: Elementos por página
- `search`: Búsqueda por título, autor o ISBN
- `status`: Filtrar por estado
- `category`: Filtrar por categoría

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "El Señor de los Anillos",
      "author": "J.R.R. Tolkien",
      "isbn": "978-84-450-7054-9",
      "status": "available",
      "location": "Estante A-1",
      "notes": "Trilogía completa",
      "lastUpdated": "2024-01-15"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### POST /api/books
**Descripción**: Crea un nuevo libro (solo admin/librarian)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "Nuevo Libro",
  "author": "Nuevo Autor",
  "isbn": "978-84-123-4567-8",
  "status": "available",
  "location": "Estante D-1",
  "notes": "Libro recién agregado"
}
```

### PUT /api/books/{id}
**Descripción**: Actualiza un libro existente

**Headers**: `Authorization: Bearer <token>`

### DELETE /api/books/{id}
**Descripción**: Elimina un libro (solo admin)

**Headers**: `Authorization: Bearer <token>`

## 📖 Gestión de Préstamos

### GET /api/loans
**Descripción**: Obtiene lista de préstamos

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Número de página
- `limit`: Elementos por página
- `status`: Filtrar por estado
- `userId`: Filtrar por usuario
- `bookId`: Filtrar por libro

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "userId": 3,
      "userName": "María García",
      "bookId": 2,
      "bookTitle": "Don Quijote de la Mancha",
      "borrowedDate": "2024-01-10",
      "dueDate": "2024-01-24",
      "returnDate": null,
      "status": "active"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### POST /api/loans
**Descripción**: Crea un nuevo préstamo

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "userId": 5,
  "bookId": 1,
  "dueDate": "2024-01-29"
}
```

### PUT /api/loans/{id}/return
**Descripción**: Marca un préstamo como devuelto

**Headers**: `Authorization: Bearer <token>`

### GET /api/loans/user
**Descripción**: Obtiene préstamos del usuario autenticado

**Headers**: `Authorization: Bearer <token>`

## 📊 Reportes

### GET /api/reports
**Descripción**: Obtiene datos para reportes (solo admin)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `timeRange`: Período de tiempo (week, month, quarter, year)

**Response**:
```json
{
  "data": {
    "bookStats": [
      { "name": "Disponibles", "value": 890, "color": "#4caf50" },
      { "name": "Prestados", "value": 360, "color": "#2196f3" },
      { "name": "En Reparación", "value": 45, "color": "#ff9800" },
      { "name": "Perdidos", "value": 15, "color": "#f44336" }
    ],
    "userStats": [
      { "name": "Ene", "usuarios": 420, "activos": 380 },
      { "name": "Feb", "usuarios": 450, "activos": 410 }
    ],
    "loanStats": [
      { "name": "Lun", "prestamos": 45, "devoluciones": 38 },
      { "name": "Mar", "prestamos": 52, "devoluciones": 42 }
    ],
    "categoryStats": [
      { "name": "Ficción", "value": 35, "color": "#ff6b6b" },
      { "name": "No Ficción", "value": 25, "color": "#4ecdc4" }
    ],
    "monthlyLoans": [
      { "name": "Ene", "prestamos": 1200, "devoluciones": 1150 },
      { "name": "Feb", "prestamos": 1350, "devoluciones": 1280 }
    ],
    "topBooks": [
      { "name": "El Señor de los Anillos", "prestamos": 45 },
      { "name": "Don Quijote", "prestamos": 38 }
    ],
    "userActivity": [
      { "name": "00:00", "usuarios": 5 },
      { "name": "04:00", "usuarios": 2 }
    ]
  }
}
```

### GET /api/reports/export
**Descripción**: Exporta reportes en formato PDF/Excel

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `type`: Tipo de reporte (books, users, loans, statistics)
- `format`: Formato de exportación (pdf, excel)

## ⚙️ Configuraciones

### GET /api/settings
**Descripción**: Obtiene configuraciones del sistema (solo admin)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "data": {
    "emailNotifications": true,
    "loanReminders": true,
    "overdueAlerts": true,
    "maintenanceMode": false,
    "maxLoansPerUser": 5,
    "loanDurationDays": 14,
    "overdueFinePerDay": 1.00
  }
}
```

### PUT /api/settings
**Descripción**: Actualiza configuraciones del sistema (solo admin)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "emailNotifications": true,
  "loanReminders": true,
  "overdueAlerts": true,
  "maintenanceMode": false,
  "maxLoansPerUser": 5,
  "loanDurationDays": 14,
  "overdueFinePerDay": 1.00
}
```

## 🔧 Modelos de Datos

### Usuario (User)
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Libro (Book)
```python
class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    isbn = Column(String, unique=True, index=True, nullable=False)
    status = Column(Enum(BookStatus), default=BookStatus.AVAILABLE)
    location = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Préstamo (Loan)
```python
class Loan(Base):
    __tablename__ = "loans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    borrowed_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime)
    status = Column(Enum(LoanStatus), default=LoanStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Python 3.8+
- PostgreSQL 12+
- Redis 6+

### Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/tu-usuario/biblioteca-api.git
cd biblioteca-api
```

2. **Crear entorno virtual**:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias**:
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

5. **Configurar base de datos**:
```bash
# Crear base de datos PostgreSQL
createdb biblioteca_db

# Ejecutar migraciones
alembic upgrade head
```

6. **Ejecutar la aplicación**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Variables de Entorno

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost/biblioteca_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=tu-clave-secreta-muy-segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-password

# Configuración general
ENVIRONMENT=development
DEBUG=true
```

## 🐳 Docker

### Construir imagen
```bash
docker build -t biblioteca-api .
```

### Ejecutar con Docker Compose
```bash
docker-compose up -d
```

## 📝 Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Error de validación
- `500 Internal Server Error`: Error interno del servidor

## 🔒 Seguridad

### Autenticación
- JWT tokens con expiración configurable
- Refresh tokens para renovación automática
- Hashing de contraseñas con bcrypt

### Autorización
- Roles de usuario: admin, librarian, user
- Middleware de verificación de permisos
- Validación de acceso por endpoint

### Validación
- Validación de datos con Pydantic
- Sanitización de entrada
- Rate limiting para prevenir abuso

## 📈 Monitoreo y Logs

### Logs
- Logs estructurados con JSON
- Niveles: DEBUG, INFO, WARNING, ERROR
- Rotación automática de logs

### Métricas
- Prometheus metrics
- Health checks
- Performance monitoring

## 🧪 Testing

### Ejecutar tests
```bash
# Tests unitarios
pytest tests/unit/

# Tests de integración
pytest tests/integration/

# Tests completos
pytest tests/
```

### Cobertura de código
```bash
pytest --cov=app tests/
```

## 📚 Documentación Interactiva

Una vez ejecutada la aplicación, puedes acceder a:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- Email: soporte@biblioteca.com
- Issues: [GitHub Issues](https://github.com/tu-usuario/biblioteca-api/issues)
- Documentación: [Wiki del proyecto](https://github.com/tu-usuario/biblioteca-api/wiki)

---

**Desarrollado con ❤️ para el Proyecto Final de Maestría** 