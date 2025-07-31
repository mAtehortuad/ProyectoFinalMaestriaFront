import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme/theme';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import UserManagement from './components/admin/UserManagement';
import BookManagement from './components/admin/BookManagement';
import Reports from './components/admin/Reports';
import Settings from './components/admin/Settings';
import BookStatus from './components/admin/BookStatus';
import BookSearch from './components/search/BookSearch';
import UserSearch from './components/search/UserSearch';
import MyLoans from './components/user/MyLoans';
import UserBooks from './components/user/UserBooks';
import UserProfile from './components/user/UserProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Ruta por defecto - redirigir al login o dashboard */}
              <Route 
                path="/" 
                element={<Navigate to="/login" replace />} 
              />
              
              {/* Ruta de login */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas de administrador */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/books"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <BookManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/book-status"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <BookStatus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Rutas de libros */}
              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <BookSearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/books"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <BookManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search/users"
                element={
                  <ProtectedRoute requiredRole={['admin', 'librarian']}>
                    <UserSearch />
                  </ProtectedRoute>
                }
              />

              {/* Rutas de usuario */}
              <Route
                path="/user/my-loans"
                element={
                  <ProtectedRoute requiredRole="user">
                    <MyLoans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/books"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserBooks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas de bibliotecario */}
              <Route
                path="/librarian/*"
                element={
                  <ProtectedRoute requiredRole="librarian">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Rutas de usuario */}
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute requiredRole="user">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Ruta para páginas no encontradas */}
              <Route 
                path="*" 
                element={<Navigate to="/login" replace />} 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
