import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Fab,
  CircularProgress,
  TextareaAutosize,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  CheckCircle as AvailableIcon,
  Warning as BorrowedIcon,
  Error as DamagedIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.service';
import API_CONFIG from '../../config/api.config';

const BookManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    quantity: 1,
    description: '',
    publicationYear: '',
    publisher: '',
  });

  // Verificar acceso de administrador
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksResponse, categoriesResponse] = await Promise.all([
        apiService.get(API_CONFIG.ENDPOINTS.BOOKS.BASE),
        apiService.get(API_CONFIG.ENDPOINTS.CATEGORIES.BASE),
      ]);

      setBooks(booksResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar datos',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        status: book.status,
        quantity: book.quantity,
        description: book.description,
        publicationYear: book.publicationYear,
        publisher: book.publisher,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        status: 'available',
        quantity: 1,
        description: '',
        publicationYear: '',
        publisher: '',
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
      category: '',
      status: 'available',
      quantity: 1,
      description: '',
      publicationYear: '',
      publisher: '',
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
        await apiService.put(`${API_CONFIG.ENDPOINTS.BOOKS.BASE}/${editingBook.id}`, formData);
        setSnackbar({
          open: true,
          message: 'Libro actualizado exitosamente',
          severity: 'success',
        });
      } else {
        // Crear nuevo libro
        await apiService.post(API_CONFIG.ENDPOINTS.BOOKS.BASE, formData);
        setSnackbar({
          open: true,
          message: 'Libro creado exitosamente',
          severity: 'success',
        });
      }
      handleCloseDialog();
      loadData();
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
        await apiService.delete(`${API_CONFIG.ENDPOINTS.BOOKS.BASE}/${bookId}`);
        setSnackbar({
          open: true,
          message: 'Libro eliminado exitosamente',
          severity: 'success',
        });
        loadData();
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



  const getCategoryDisplayName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
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
            Gestión de Libros
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Administra el inventario de libros de la biblioteca
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {books.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de Libros
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                    <BookIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                                         <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'success.main' }}>
                       {books.reduce((total, book) => total + (book.availableQuantity || 0), 0)}
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
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                                         <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'warning.main' }}>
                       {books.reduce((total, book) => total + (book.borrowedQuantity || 0), 0)}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       Prestados
                     </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                    <BorrowedIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                                         <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'error.main' }}>
                       {books.reduce((total, book) => total + (book.maintenanceQuantity || 0) + (book.lostQuantity || 0), 0)}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       En Mantenimiento/Perdidos
                     </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                    <DamagedIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de Libros */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Inventario de Libros
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #8B4513, #D2691E)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #654321, #8B4513)',
                },
              }}
            >
              Agregar Libro
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                                 <TableHead>
                   <TableRow>
                     <TableCell>Libro</TableCell>
                     <TableCell>Autor</TableCell>
                     <TableCell>ISBN</TableCell>
                     <TableCell>Categoría</TableCell>
                     <TableCell>Total</TableCell>
                     <TableCell>Disponibles</TableCell>
                     <TableCell>Prestados</TableCell>
                     <TableCell>Año</TableCell>
                     <TableCell align="center">Acciones</TableCell>
                   </TableRow>
                 </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                            <BookIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {book.publisher}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<CategoryIcon />}
                          label={getCategoryDisplayName(book.category)}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                                             <TableCell>
                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
                           {book.quantity}
                         </Typography>
                       </TableCell>
                       <TableCell>
                         <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                           {book.availableQuantity || 0}
                         </Typography>
                       </TableCell>
                       <TableCell>
                         <Typography variant="body2" sx={{ fontWeight: 500, color: 'warning.main' }}>
                           {book.borrowedQuantity || 0}
                         </Typography>
                       </TableCell>
                       <TableCell>{book.publicationYear}</TableCell>
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
                          <Tooltip title="Editar libro">
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
          )}
        </Paper>

        {/* Dialog para Crear/Editar Libro */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingBook ? 'Editar Libro' : 'Crear Nuevo Libro'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Autor"
                    value={formData.author}
                    onChange={handleInputChange('author')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ISBN"
                    value={formData.isbn}
                    onChange={handleInputChange('isbn')}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Editorial"
                    value={formData.publisher}
                    onChange={handleInputChange('publisher')}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Año de Publicación"
                    value={formData.publicationYear}
                    onChange={handleInputChange('publicationYear')}
                    margin="normal"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cantidad"
                    value={formData.quantity}
                    onChange={handleInputChange('quantity')}
                    margin="normal"
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={handleInputChange('category')}
                      label="Categoría"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                                       <TextField
                       fullWidth
                       label="Descripción"
                       value={formData.description}
                       onChange={handleInputChange('description')}
                       margin="normal"
                       multiline
                       rows={4}
                     />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    margin="normal"
                    multiline
                    rows={4}
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
              {editingBook ? 'Actualizar' : 'Crear'}
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

        {/* FAB para agregar libro */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(45deg, #8B4513, #D2691E)',
            '&:hover': {
              background: 'linear-gradient(45deg, #654321, #8B4513)',
            },
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default BookManagement; 