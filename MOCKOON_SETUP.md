# Configuración de Mockoon para Biblioteca Digital

## 📋 Instrucciones de Configuración

### 1. Importar la Configuración

1. Abre Mockoon
2. Haz clic en "Import/Export" → "Import"
3. Selecciona el archivo `mockoon-config-organized.json`
4. Haz clic en "Import"

### 2. Verificar la Configuración

Después de importar, deberías ver las siguientes carpetas organizadas:

#### 📁 Autenticación
- `POST /api/login` - Login con múltiples respuestas (Admin, Librarian, User)
- `GET /api/auth/verify` - Verificación de token
- `POST /api/auth/refresh` - Renovación de token
- `POST /api/auth/logout` - Cerrar sesión
- `OPTIONS /api/:path*` - CORS preflight

#### 👥 Gestión de Usuarios
- `GET /api/users` - Lista de usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

#### 📚 Gestión de Libros
- `GET /api/books` - Catálogo de libros (datos generales)
- `GET /api/categories` - Categorías de libros
- `GET /api/book-status` - Estados de libros
- `GET /api/book-inventory` - Inventario individual de libros

#### 📋 Gestión de Préstamos
- `GET /api/loans` - Lista de préstamos
- `POST /api/loans` - Crear préstamo
- `PUT /api/loans/:id/return` - Devolver libro
- `GET /api/users/:userId/loans` - **NUEVO: Préstamos del usuario específico**

#### 📊 Reportes y Configuraciones
- `GET /api/reports/statistics` - Datos para reportes
- `GET /api/settings` - Configuraciones del sistema
- `PUT /api/settings` - Actualizar configuraciones

### 3. Iniciar el Servidor

1. Selecciona la configuración importada
2. Haz clic en "Start Server"
3. El servidor debería iniciarse en `http://localhost:3001`

### 4. Verificar Endpoints

Puedes probar los endpoints directamente en el navegador:

- **Login Admin**: `http://localhost:3001/api/login`
- **Libros**: `http://localhost:3001/api/books`
- **Préstamos de Usuario**: `http://localhost:3001/api/users/3/loans` ⭐ **NUEVO**
- **Reportes**: `http://localhost:3001/api/reports/statistics`

### 5. Configuración de CORS

La configuración incluye headers CORS automáticos:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`
- `Access-Control-Allow-Credentials: true`

### 6. Datos de Prueba

#### Usuarios de Prueba:
- **Admin (ID: 1)**: `admin@biblioteca.com` / `admin123`
- **Bibliotecario (ID: 2)**: `bibliotecario@biblioteca.com` / `librarian123`
- **Usuario (ID: 3)**: `maria@biblioteca.com` / `user123`

#### Préstamos de Usuario (Nuevo Endpoint):
El endpoint `/api/users/:userId/loans` devuelve:
- 1 préstamo activo (El Señor de los Anillos)
- 1 préstamo vencido (Don Quijote)
- 1 préstamo devuelto (Cien años de soledad)

### 7. Solución de Problemas

#### Error 404 en `/api/users/:userId/loans`:
1. **Reinicia Mockoon** después de importar la configuración
2. Verifica que el endpoint esté en la carpeta "📋 Gestión de Préstamos"
3. Asegúrate de que el servidor esté corriendo en el puerto 3001

#### CORS Errors:
- La configuración incluye headers CORS automáticos
- Si persisten, verifica que el endpoint OPTIONS esté activo

#### Datos no se cargan:
- Verifica que el frontend esté configurado para usar `http://localhost:3001`
- Revisa la consola del navegador para errores específicos

### 8. Estructura de Datos

#### Formato de Préstamos de Usuario:
```json
[
  {
    "id": "loan-001",
    "book": {
      "id": "book-001",
      "title": "El Señor de los Anillos",
      "author": "J.R.R. Tolkien",
      "isbn": "978-84-450-7628-2"
    },
    "status": "active",
    "loanDate": "2024-01-15T00:00:00.000Z",
    "dueDate": "2024-02-15T00:00:00.000Z",
    "returnDate": null
  }
]
```

### 9. Actualizaciones Recientes

#### ✅ Nuevo Endpoint Agregado:
- `GET /api/users/:userId/loans` - Para obtener préstamos del usuario específico
- Incluye datos de ejemplo con diferentes estados
- Integrado en la carpeta "📋 Gestión de Préstamos"

#### ✅ Configuración Mejorada:
- Headers CORS automáticos
- Respuestas estructuradas
- Datos de ejemplo realistas

### 10. Próximos Pasos

1. **Reinicia Mockoon** para que reconozca el nuevo endpoint
2. **Prueba el endpoint** `/api/users/3/loans` directamente
3. **Verifica la aplicación** - los usuarios normales deberían poder ver sus préstamos
4. **Reporta cualquier problema** para ajustes adicionales

---

**Nota**: Si el endpoint `/api/users/:userId/loans` sigue dando 404 después de reiniciar Mockoon, el componente MyLoans tiene un fallback que mostrará datos de ejemplo para que puedas probar la funcionalidad. 