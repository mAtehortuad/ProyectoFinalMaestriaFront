import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  Pagination,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Book as BookIcon,
  CheckCircle as AvailableIcon,
  Block as UnavailableIcon,
  Build as RepairIcon,
  Warning as LostIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const BookStatus = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    status: 'available',
    location: '',
    notes: '',
  });

  // Verificar acceso de administrador
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Cargar libros
  useEffect(() => {
    loadBooks();
  }, []);

  // Filtrar libros
  useEffect(() => {
    let filtered = books;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        book.bookTitle.toLowerCase().includes(term) ||
        book.id.toLowerCase().includes(term) ||
        book.isbn.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(book => book.status === statusFilter);
    }

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [books, searchTerm, statusFilter]);

  // Calcular libros para la página actual
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(API_CONFIG.ENDPOINTS.BOOK_INVENTORY.BASE);
      setBooks(response.data || []);
      setFilteredBooks(response.data || []);
    } catch (error) {
      console.error('Error loading books:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar libros',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockBooks = () => {
    return [
      {
        id: 1,
        title: 'El Señor de los Anillos',
        author: 'J.R.R. Tolkien',
        isbn: '978-84-450-7054-9',
        status: 'available',
        location: 'Estante A-1',
        notes: 'Trilogía completa',
        lastUpdated: '2024-01-15',
      },
      {
        id: 2,
        title: 'Don Quijote de la Mancha',
        author: 'Miguel de Cervantes',
        isbn: '978-84-376-0494-7',
        status: 'borrowed',
        location: 'Estante B-3',
        notes: 'Edición conmemorativa',
        lastUpdated: '2024-01-10',
      },
      {
        id: 3,
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        isbn: '978-84-397-2077-7',
        status: 'repair',
        location: 'Taller de reparación',
        notes: 'Páginas sueltas',
        lastUpdated: '2024-01-12',
      },
      {
        id: 4,
        title: '1984',
        author: 'George Orwell',
        isbn: '978-84-206-5160-7',
        status: 'lost',
        location: 'N/A',
        notes: 'Reportado como perdido',
        lastUpdated: '2024-01-08',
      },
      {
        id: 5,
        title: 'El Principito',
        author: 'Antoine de Saint-Exupéry',
        isbn: '978-84-206-5160-8',
        status: 'available',
        location: 'Estante C-2',
        notes: 'Edición ilustrada',
        lastUpdated: '2024-01-14',
      },
    ];
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        status: book.status,
        location: book.location,
        notes: book.notes,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        status: 'available',
        location: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      status: 'available',
      location: '',
      notes: '',
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        // Actualizar libro existente
        const updatedBook = { ...editingBook, ...formData, lastUpdated: new Date().toISOString().split('T')[0] };
        const updatedBooks = books.map(book => book.id === editingBook.id ? updatedBook : book);
        setBooks(updatedBooks);
        setSnackbar({
          open: true,
          message: 'Estado del libro actualizado exitosamente',
          severity: 'success',
        });
      } else {
        // Crear nuevo libro
        const newBook = {
          id: books.length + 1,
          ...formData,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        setBooks([...books, newBook]);
        setSnackbar({
          open: true,
          message: 'Libro agregado exitosamente',
          severity: 'success',
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving book:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar libro',
        severity: 'error',
      });
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      try {
        const updatedBooks = books.filter(book => book.id !== bookId);
        setBooks(updatedBooks);
        setSnackbar({
          open: true,
          message: 'Libro eliminado exitosamente',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error deleting book:', error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar libro',
          severity: 'error',
        });
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <AvailableIcon />;
      case 'borrowed':
        return <UnavailableIcon />;
      case 'repair':
        return <RepairIcon />;
      case 'lost':
        return <LostIcon />;
      default:
        return <BookIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'borrowed':
        return 'info';
      case 'repair':
        return 'warning';
      case 'lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'borrowed':
        return 'Prestado';
      case 'repair':
        return 'En Reparación';
      case 'lost':
        return 'Perdido';
      default:
        return 'Desconocido';
    }
  };

  const getStatusCount = (status) => {
    return books.filter(book => book.status === status).length;
  };

  if (!isAdmin()) {
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
            Inventario Individual de Libros
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestiona cada ejemplar individual con su identificador único y estado específico
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {getStatusCount('available')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Disponibles
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                    <AvailableIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'info.main' }}>
                      {getStatusCount('borrowed')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prestados
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                    <UnavailableIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {getStatusCount('repair')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En Reparación
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                    <RepairIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {getStatusCount('lost')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Perdidos
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                    <LostIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Barra de búsqueda y filtros */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar por ID ejemplar, título o ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por estado</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Filtrar por estado"
                >
                  <MenuItem value="all">Todos los estados</MenuItem>
                  <MenuItem value="available">Disponible</MenuItem>
                  <MenuItem value="borrowed">Prestado</MenuItem>
                  <MenuItem value="repair">En Reparación</MenuItem>
                  <MenuItem value="lost">Perdido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                fullWidth
                sx={{
                  background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #654321, #8B4513)',
                  },
                }}
              >
                Agregar Libro
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de libros */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Inventario Individual de Libros ({filteredBooks.length} ejemplares)
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Ejemplar</TableCell>
                      <TableCell>Libro</TableCell>
                      <TableCell>ISBN</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>Condición</TableCell>
                      <TableCell>Fecha Adquisición</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentBooks.map((book) => (
                      <TableRow key={book.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                            {book.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {book.bookTitle}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(book.status)}
                            label={getStatusDisplayName(book.status)}
                            color={getStatusColor(book.status)}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>{book.location}</TableCell>
                        <TableCell>
                          <Chip
                            label={book.condition}
                            color={book.condition === 'excellent' ? 'success' : book.condition === 'good' ? 'primary' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{book.acquisitionDate}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleOpenDialog(book)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar estado">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(book)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar libro">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteBook(book.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginación */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Dialog para Crear/Editar Libro */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingBook ? 'Editar Estado del Libro' : 'Agregar Nuevo Libro'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Autor"
                    value={formData.author}
                    onChange={handleInputChange('author')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ISBN"
                    value={formData.isbn}
                    onChange={handleInputChange('isbn')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleInputChange('status')}
                      label="Estado"
                    >
                      <MenuItem value="available">Disponible</MenuItem>
                      <MenuItem value="borrowed">Prestado</MenuItem>
                      <MenuItem value="repair">En Reparación</MenuItem>
                      <MenuItem value="lost">Perdido</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Ubicación"
                    value={formData.location}
                    onChange={handleInputChange('location')}
                    margin="normal"
                    placeholder="Ej: Estante A-1, Taller de reparación, etc."
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Notas"
                    value={formData.notes}
                    onChange={handleInputChange('notes')}
                    margin="normal"
                    multiline
                    rows={3}
                    placeholder="Información adicional sobre el libro..."
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #654321, #8B4513)',
                },
              }}
            >
              {editingBook ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </Dialog>

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

export default BookStatus; 