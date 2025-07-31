# 📚 Configuración de Mockoon Organizada - Biblioteca API

## 🎯 Descripción

Esta configuración de Mockoon está organizada en carpetas para una mejor gestión y navegación de los endpoints. Los endpoints están agrupados por funcionalidad, lo que facilita el desarrollo y las pruebas.

## 📁 Estructura de Carpetas

### 🔐 **Autenticación**
- **POST** `/api/login` - Login con diferentes roles (admin, librarian, user)
- **POST** `/api/logout` - Logout del sistema

### 📚 **Gestión de Libros**
- **GET** `/api/libros` - Listar todos los libros (con paginación)
- **POST** `/api/libros` - Crear nuevo libro
- **PUT** `/api/libros/:id` - Actualizar libro existente
- **DELETE** `/api/libros/:id` - Eliminar libro
- **GET** `/api/libros` - Buscar libros con parámetros (q, category, status, author, isbn, page, limit)

### 👥 **Gestión de Usuarios**
- **GET** `/api/users` - Listar todos los usuarios (con paginación)
- **POST** `/api/users` - Crear nuevo usuario
- **GET** `/api/users` - Buscar usuarios con parámetros (q, role, status, email, page, limit)

### 📖 **Gestión de Préstamos**
- **GET** `/api/loans/user` - Obtener préstamos del usuario actual
- **GET** `/api/loans/extend/:id` - Extender un préstamo

## 🚀 Cómo Importar

### Opción 1: Importar desde Mockoon Desktop
1. Abre Mockoon Desktop
2. Haz clic en "Import/Export" → "Import"
3. Selecciona el archivo `mockoon-config-organized.json`
4. La configuración se importará con las carpetas organizadas

### Opción 2: Arrastrar y Soltar
1. Abre Mockoon Desktop
2. Arrastra el archivo `mockoon-config-organized.json` a la ventana de Mockoon
3. La configuración se importará automáticamente

## 🎨 Ventajas de la Organización

### ✅ **Navegación Mejorada**
- Endpoints agrupados por funcionalidad
- Fácil localización de endpoints específicos
- Interfaz más limpia y organizada

### ✅ **Desarrollo Eficiente**
- Agrupación lógica por módulos
- Fácil identificación de endpoints relacionados
- Mejor gestión de pruebas por funcionalidad

### ✅ **Mantenimiento Simplificado**
- Estructura clara y escalable
- Fácil agregar nuevos endpoints en las carpetas correspondientes
- Documentación integrada en la estructura

## 🔧 Configuración de Pruebas

### Credenciales de Prueba

#### 👨‍💼 **Administrador**
```
Email: admin@biblioteca.com
Password: (cualquier contraseña funciona con Mockoon)
```

#### 📚 **Bibliotecario**
```
Email: bibliotecario@biblioteca.com
Password: (cualquier contraseña funciona con Mockoon)
```

#### 👤 **Usuario Normal**
```
Email: usuario@biblioteca.com
Password: (cualquier contraseña funciona con Mockoon)
```

## 📋 Parámetros de Búsqueda

### Libros (`/api/libros`)
- `q` - Búsqueda por título, autor o descripción
- `category` - Filtrar por categoría
- `status` - Filtrar por estado (available, borrowed, etc.)
- `author` - Filtrar por autor específico
- `isbn` - Filtrar por ISBN
- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 12)

### Usuarios (`/api/users`)
- `q` - Búsqueda por nombre
- `role` - Filtrar por rol (admin, librarian, user)
- `status` - Filtrar por estado (active, inactive)
- `email` - Filtrar por email específico
- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 12)

## 🔄 Migración desde la Configuración Anterior

Si ya tienes la configuración anterior:

1. **Respaldar**: Guarda tu configuración actual
2. **Importar**: Importa la nueva configuración organizada
3. **Verificar**: Confirma que todos los endpoints funcionan correctamente
4. **Eliminar**: Puedes eliminar la configuración anterior

## 🛠️ Personalización

### Agregar Nuevos Endpoints
1. Crea el endpoint en Mockoon
2. Identifica la carpeta correspondiente
3. Arrastra el endpoint a la carpeta correcta
4. Actualiza la documentación si es necesario

### Modificar Respuestas
1. Selecciona el endpoint
2. Modifica la respuesta en la pestaña "Response"
3. Guarda los cambios
4. Prueba el endpoint actualizado

## 📞 Soporte

Si tienes problemas con la configuración:

1. Verifica que Mockoon esté actualizado
2. Revisa que el puerto 3001 esté disponible
3. Confirma que los CORS headers estén configurados
4. Prueba los endpoints individualmente

## 🎯 Próximos Pasos

- [ ] Agregar más endpoints de préstamos
- [ ] Implementar endpoints de categorías
- [ ] Agregar endpoints de reportes
- [ ] Configurar respuestas dinámicas con variables

---

**Nota**: Esta configuración está optimizada para el desarrollo del frontend de la Biblioteca. Todos los endpoints incluyen CORS headers y están configurados para funcionar con React. 