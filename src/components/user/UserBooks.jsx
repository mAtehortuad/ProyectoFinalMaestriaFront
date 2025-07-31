import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const UserBooks = () => {
  const { isUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Verificar acceso de usuario
  useEffect(() => {
    if (!isUser()) {
      navigate('/dashboard');
    }
  }, [isUser, navigate]);

  // Cargar datos
  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  // Filtrar libros cuando cambian los filtros aplicados
  useEffect(() => {
    let filtered = books;

    // Filtrar por búsqueda
    if (appliedSearch) {
      filtered = filtered.filter(book => {
        const searchValue = appliedSearch.toLowerCase();
        switch (appliedFilter) {
          case 'title':
            return book.title.toLowerCase().includes(searchValue);
          case 'author':
            return book.author.toLowerCase().includes(searchValue);
          case 'isbn':
            return book.isbn.toLowerCase().includes(searchValue);
          default:
            return book.title.toLowerCase().includes(searchValue);
        }
      });
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, appliedSearch, appliedFilter, selectedCategory]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_CONFIG.ENDPOINTS.BOOKS.BASE);
      setBooks(response.data || []);
    } catch (error) {
      console.error('Error loading books:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los libros',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.BASE);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedFilter(searchFilter);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setAppliedSearch('');
    setSelectedCategory('all');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'borrowed':
        return 'warning';
      case 'maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'borrowed':
        return 'Prestado';
      case 'maintenance':
        return 'En Mantenimiento';
      default:
        return status;
    }
  };

  if (!isUser()) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth={false} sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Volver al Dashboard
            </Button>
          </Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Catálogo de Libros
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explora nuestra colección de libros disponibles
          </Typography>
        </Box>

        {/* Filtros de búsqueda */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Buscar libros"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingresa tu búsqueda..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Buscar por</InputLabel>
                <Select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  label="Buscar por"
                >
                  <MenuItem value="title">Título</MenuItem>
                  <MenuItem value="author">Autor</MenuItem>
                  <MenuItem value="isbn">ISBN</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="all">Todas las categorías</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #654321, #8B4513)',
                    },
                  }}
                >
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
                >
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Resultados */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="text.secondary">
                {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {filteredBooks.map((book) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
                          <BookIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3" noWrap>
                            {book.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {book.author}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>ISBN:</strong> {book.isbn}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Año:</strong> {book.publicationYear}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Categoría:</strong> {book.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Editorial:</strong> {book.publisher}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={getStatusText(book.status)}
                          color={getStatusColor(book.status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`${book.availableQuantity} disponibles`}
                          color="info"
                          size="small"
                        />
                      </Box>

                      {book.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {book.description.length > 100
                            ? `${book.description.substring(0, 100)}...`
                            : book.description}
                        </Typography>
                      )}

                    
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredBooks.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No se encontraron libros con los filtros aplicados
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
                  sx={{ mt: 2 }}
                >
                  Limpiar filtros
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserBooks; 