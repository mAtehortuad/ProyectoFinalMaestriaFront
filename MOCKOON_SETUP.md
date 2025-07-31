# Configuración de Mockoon para Biblioteca API

## Instalación y Configuración

### 1. Instalar Mockoon
- Descargar Mockoon desde: https://mockoon.com/
- Instalar la aplicación

### 2. Importar la Configuración
1. Abrir Mockoon
2. Hacer clic en "Import/Export" → "Import"
3. Seleccionar el archivo `mockoon-config-organized.json`
4. La configuración se importará automáticamente

### 3. Organización de Endpoints

La configuración está organizada en carpetas (folders) reales de Mockoon:

#### 🔐 Autenticación
- `POST /api/login` - Login de usuario (con múltiples respuestas por tipo de usuario)
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout de usuario
- `POST /api/auth/refresh` - Refrescar token

**Nota**: El endpoint de login tiene múltiples respuestas configuradas:
- **Login Admin** (`admin@biblioteca.com`): Retorna usuario con rol "admin"
- **Login Bibliotecario** (`bibliotecario@biblioteca.com`): Retorna usuario con rol "librarian"
- **Login Usuario** (`maria@biblioteca.com`): Retorna usuario con rol "user"



#### 👥 Gestión de Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

#### 📚 Gestión de Libros
- `GET /api/books` - Listar libros
- `POST /api/books` - Crear libro
- `PUT /api/books/:id` - Actualizar libro
- `DELETE /api/books/:id` - Eliminar libro

#### 📋 Gestión de Préstamos
- `GET /api/loans` - Listar préstamos
- `POST /api/loans` - Crear préstamo
- `PUT /api/loans/:id/return` - Devolver libro

#### 📊 Reportes y Configuraciones
- `GET /api/reports` - Datos de reportes
- `GET /api/settings` - Configuración del sistema
- `PUT /api/settings` - Actualizar configuración

### 4. Iniciar el Servidor
1. Hacer clic en el botón "Start" en Mockoon
2. El servidor se iniciará en `http://localhost:3001`
3. Verificar que el estado sea "Running"

### 5. Verificar la Configuración
- Abrir el navegador y visitar: `http://localhost:3001/api/books`
- Deberías ver una respuesta JSON con la lista de libros

## Solución de Problemas

### Error: "useAuth debe ser usado dentro de un AuthProvider"
Este error ocurre cuando:
1. Mockoon no está ejecutándose
2. Los endpoints de autenticación no están configurados correctamente
3. El token no se está generando correctamente

**Solución:**
1. Verificar que Mockoon esté ejecutándose en el puerto 3001
2. Verificar que todos los endpoints de autenticación estén configurados
3. Limpiar el localStorage del navegador y hacer login nuevamente

### Error: "Network Error"
Este error ocurre cuando:
1. Mockoon no está ejecutándose
2. El puerto está ocupado por otra aplicación

**Solución:**
1. Verificar que Mockoon esté ejecutándose
2. Cambiar el puerto en Mockoon si es necesario
3. Actualizar la configuración de la API en `src/config/api.config.js`

### Error: "CORS Error"
Este error ocurre cuando:
1. El navegador bloquea las peticiones por CORS

**Solución:**
1. Verificar que Mockoon tenga habilitado CORS
2. Usar una extensión de navegador para deshabilitar CORS temporalmente

## Datos de Prueba

### Usuario Administrador
- Email: `admin@biblioteca.com`
- Contraseña: `admin123`
- Rol: `admin`

### Usuario Bibliotecario
- Email: `bibliotecario@biblioteca.com`
- Contraseña: `librarian123`
- Rol: `librarian`

### Usuario Normal
- Email: `maria@biblioteca.com`
- Contraseña: `user123`
- Rol: `user`

## Notas Importantes

1. **Tokens JWT**: Los tokens en Mockoon son simulados y no son válidos para verificación real
2. **Persistencia**: Los datos no se persisten entre reinicios de Mockoon
3. **Latencia**: Se puede configurar latencia artificial en Mockoon para simular condiciones reales
4. **Variables**: Se pueden usar variables en Mockoon para hacer las respuestas más dinámicas

## Configuración Avanzada

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```
VITE_API_BASE_URL=http://localhost:3001
```

### Configuración de CORS en Mockoon
1. Ir a Settings en Mockoon
2. Habilitar "CORS"
3. Agregar los orígenes permitidos: `http://localhost:5173`

### Configuración de Latencia
1. En cada endpoint, configurar "Latency" en milisegundos
2. Recomendado: 100-500ms para simular condiciones reales

## Recursos Adicionales

- [Documentación oficial de Mockoon](https://mockoon.com/docs/)
- [Guía de configuración de CORS](https://mockoon.com/docs/latest/cors/)
- [Variables y templating](https://mockoon.com/docs/latest/templating/) 