# Instrucciones para Configurar Mockoon

## 📋 Configuración del Servidor Mock

### 1. **Importar Configuración**
1. Abrir Mockoon
2. Hacer clic en "Import/Export" → "Import"
3. Seleccionar el archivo `mockoon-config.json`
4. La configuración se importará automáticamente

### 2. **Iniciar el Servidor**
1. Hacer clic en el botón "Start" (▶️) en Mockoon
2. El servidor se iniciará en `http://localhost:3001`

### 3. **Verificar Endpoints**
Los siguientes endpoints estarán disponibles:

#### 🔐 **Autenticación**
- `POST /api/login` - Login con 3 respuestas diferentes:
  - **Login Admin**: admin@biblioteca.com (cualquier contraseña)
  - **Login Bibliotecario**: bibliotecario@biblioteca.com (cualquier contraseña)
  - **Login Usuario**: usuario@biblioteca.com (cualquier contraseña)

#### 📚 **Libros**
- `GET /api/libros` - Listar todos los libros
- `POST /api/libros` - Crear nuevo libro

#### 👥 **Usuarios**
- `GET /api/users` - Listar usuarios

#### 📖 **Préstamos**
- `GET /api/loans` - Listar préstamos

#### 🏷️ **Categorías**
- `GET /api/categories` - Listar categorías

#### 📊 **Estados**
- `GET /api/book-status` - Listar estados de libros

## 🧪 **Pruebas de Login**

### **Para Probar Diferentes Roles:**

1. **Administrador**:
   - Email: `admin@biblioteca.com`
   - Contraseña: `cualquier contraseña`
   - Resultado: Acceso completo al sistema

2. **Bibliotecario**:
   - Email: `bibliotecario@biblioteca.com`
   - Contraseña: `cualquier contraseña`
   - Resultado: Acceso a gestión de préstamos e inventario

3. **Usuario**:
   - Email: `usuario@biblioteca.com`
   - Contraseña: `cualquier contraseña`
   - Resultado: Acceso limitado a consultas personales

## 🔧 **Configuración del Frontend**

### **Variables de Entorno**
Asegúrate de que tu archivo `.env` tenga:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### **Ejecutar Frontend**
```bash
npm run dev
```

## 📝 **Notas Importantes**

- **CORS**: Configurado para permitir peticiones desde `http://localhost:5173`
- **Headers**: Incluye `Content-Type` y `Authorization`
- **Respuestas**: Todas las respuestas incluyen el formato estándar con `success`, `message`, `data`
- **Tokens**: Los tokens JWT son simulados para pruebas

## 🐛 **Solución de Problemas**

### **Error de CORS**
Si encuentras errores de CORS:
1. Verificar que Mockoon esté ejecutándose en puerto 3001
2. Verificar que el frontend esté en puerto 5173
3. Reiniciar Mockoon si es necesario

### **Error de Conexión**
Si no se conecta:
1. Verificar que Mockoon esté iniciado
2. Verificar la URL en las variables de entorno
3. Probar los endpoints directamente en el navegador

### **Login No Funciona**
Si el login no funciona:
1. Verificar que el endpoint sea `POST /api/login`
2. Verificar que las credenciales sean exactas
3. Revisar la consola del navegador para errores

## 🎯 **Próximos Pasos**

Una vez que tengas Mockoon configurado:
1. Probar el login con los tres roles
2. Verificar que el dashboard muestre contenido diferente según el rol
3. Probar los endpoints de libros y otros recursos
4. Integrar con tu backend real cuando esté listo 