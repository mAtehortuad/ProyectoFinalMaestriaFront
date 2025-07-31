import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  CheckCircle as AvailableIcon,
  Warning as BorrowedIcon,
  Error as DamagedIcon,
  ArrowBack as ArrowBackIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';
import Pagination from '../common/Pagination';

const BookSearch = () => {
  const { isAdmin, isLibrarian, isUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookStatuses, setBookStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Obtener parámetros de la URL
  const getSearchParams = () => ({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    author: searchParams.get('author') || '',
    isbn: searchParams.get('isbn') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 12,
  });

  // Cargar categorías y estados al montar el componente
  useEffect(() => {
    loadCategoriesAndStatuses();
  }, []);

  // Búsqueda automática cuando cambian los parámetros de URL
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = getSearchParams();
      if (params.query || params.category || params.status || params.author || params.isbn) {
        searchBooks();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  // Cargar datos iniciales si hay parámetros
  useEffect(() => {
    const params = getSearchParams();
    if (params.query || params.category || params.status || params.author || params.isbn) {
      searchBooks();
    }
  }, []);

  const loadCategoriesAndStatuses = async () => {
    try {
      const [categoriesResponse, statusesResponse] = await Promise.all([
        apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.BASE),
        apiService.get(API_CONFIG.ENDPOINTS.BOOK_STATUS.BASE),
      ]);

      setCategories(categoriesResponse.data || []);
      setBookStatuses(statusesResponse.data || []);
    } catch (error) {
      console.error('Error loading categories and statuses:', error);
    }
  };

  const searchBooks = async () => {
    try {
      setLoading(true);
      const params = getSearchParams();
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.author) queryParams.append('author', params.author);
      if (params.isbn) queryParams.append('isbn', params.isbn);
      queryParams.append('page', params.page);
      queryParams.append('limit', params.limit);

      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.BOOKS.SEARCH}?${queryParams}`);
      setBooks(response.data || []);
      setPagination({
        currentPage: params.page,
        totalPages: Math.ceil((response.total || 0) / params.limit),
        totalItems: response.total || 0,
        itemsPerPage: params.limit,
      });
    } catch (error) {
      console.error('Error searching books:', error);
      setSnackbar({
        open: true,
        message: 'Error al buscar libros',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (field) => (event) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (event.target.value) {
      newParams.set(field, event.target.value);
    } else {
      newParams.delete(field);
    }
    newParams.set('page', '1'); // Reset a página 1
    
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (event, page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const handleItemsPerPageChange = (event) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('limit', event.target.value.toString());
    newParams.set('page', '1'); // Reset a página 1
    setSearchParams(newParams);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <AvailableIcon />;
      case 'borrowed':
        return <BorrowedIcon />;
      case 'damaged':
        return <DamagedIcon />;
      default:
        return <BookIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'borrowed':
        return 'warning';
      case 'reserved':
        return 'info';
      case 'maintenance':
        return 'secondary';
      case 'lost':
      case 'damaged':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusDisplayName = (status) => {
    const statusObj = bookStatuses.find(s => s.name === status);
    return statusObj ? statusObj.displayName : status;
  };

  const getCategoryDisplayName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleBookAction = (book, action) => {
    if (action === 'view') {
      // Ver detalles del libro
      navigate(`/books/${book.id}`);
    } else if (action === 'edit' && (isAdmin() || isLibrarian())) {
      // Editar libro (solo admin y bibliotecario)
      navigate(`/admin/books/edit/${book.id}`);
    } else if (action === 'borrow' && isUser()) {
      // Solicitar préstamo (solo usuarios)
      navigate(`/user/request-loan/${book.id}`);
    }
  };

  const BookCard = ({ book }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
            <BookIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              por {book.author}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>ISBN:</strong> {book.isbn}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Editorial:</strong> {book.publisher}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Año:</strong> {book.publicationYear}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<CategoryIcon />}
            label={getCategoryDisplayName(book.category)}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={getStatusIcon(book.status)}
            label={getStatusDisplayName(book.status)}
            color={getStatusColor(book.status)}
            variant="filled"
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

        <Typography variant="body2" color="text.secondary">
          <strong>Cantidad disponible:</strong> {book.quantity}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleBookAction(book, 'view')}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          
          {(isAdmin() || isLibrarian()) && (
            <Tooltip title="Editar libro">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => handleBookAction(book, 'edit')}
              >
                <BookIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {isUser() && book.status === 'available' && (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleBookAction(book, 'borrow')}
            sx={{
              background: 'linear-gradient(45deg, #8B4513, #D2691E)',
              '&:hover': {
                background: 'linear-gradient(45deg, #654321, #8B4513)',
              },
            }}
          >
            Solicitar Préstamo
          </Button>
        )}
      </CardActions>
    </Card>
  );

  const BookListItem = ({ book }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
              <BookIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                por {book.author}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Typography variant="body2" color="text.secondary">
            <strong>ISBN:</strong> {book.isbn}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Editorial:</strong> {book.publisher}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<CategoryIcon />}
              label={getCategoryDisplayName(book.category)}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Chip
            icon={getStatusIcon(book.status)}
            label={getStatusDisplayName(book.status)}
            color={getStatusColor(book.status)}
            variant="filled"
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} md={1}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Ver detalles">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleBookAction(book, 'view')}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            {(isAdmin() || isLibrarian()) && (
              <Tooltip title="Editar libro">
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => handleBookAction(book, 'edit')}
                >
                  <BookIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

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
              sx={{
                mr: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                  color: 'primary.dark',
                },
              }}
            >
              Volver al Dashboard
            </Button>
          </Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {isAdmin() ? 'Gestión de Libros' : 'Catálogo de Libros'}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {isAdmin() 
              ? 'Administra el inventario de libros de la biblioteca'
              : 'Encuentra los libros que necesitas en nuestra biblioteca'
            }
          </Typography>
        </Box>

        {/* Filtros de búsqueda */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Filtros de Búsqueda
            </Typography>
            {isAdmin() && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/books')}
                sx={{
                  ml: 'auto',
                  background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #654321, #8B4513)',
                  },
                }}
              >
                Agregar Libro
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar por título, autor o descripción"
                value={getSearchParams().query}
                onChange={handleSearchChange('q')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Autor específico"
                value={getSearchParams().author}
                onChange={handleSearchChange('author')}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="ISBN"
                value={getSearchParams().isbn}
                onChange={handleSearchChange('isbn')}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={getSearchParams().category}
                  onChange={handleSearchChange('category')}
                  label="Categoría"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={getSearchParams().status}
                  onChange={handleSearchChange('status')}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {bookStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.name}>
                      {status.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Limpiar Filtros
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              startIcon={<ViewListIcon />}
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              Lista
            </Button>
            <Button
              variant="outlined"
              startIcon={<GridViewIcon />}
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              Cuadrícula
            </Button>
          </Box>
        </Paper>

        {/* Resultados */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Resultados ({pagination.totalItems} libros encontrados)
            </Typography>
            {loading && <CircularProgress size={24} />}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : books.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <BookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron libros
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar los filtros de búsqueda
              </Typography>
            </Paper>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                      <BookCard book={book} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box>
                  {books.map((book) => (
                    <BookListItem key={book.id} book={book} />
                  ))}
                </Box>
              )}

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
                  {/* Selector de elementos por página */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Elementos por página:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                        value={pagination.itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        displayEmpty
                      >
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={48}>48</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* Paginación */}
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                  
                  {/* Información de página */}
                  <Typography variant="body2" color="text.secondary">
                    Página {pagination.currentPage} de {pagination.totalPages} 
                    ({pagination.totalItems} elementos totales)
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>

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

export default BookSearch; 