import BookService from '../book.service';

// Mock del servicio de API
const mockApiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../api.service', () => mockApiService);

// Mock de datos de libros
const mockBooks = [
  {
    id: 1,
    title: 'El Quijote',
    author: 'Miguel de Cervantes',
    isbn: '978-84-376-0494-7',
    category: 'Literatura Clásica',
    available: true,
    publicationYear: 1605
  },
  {
    id: 2,
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    isbn: '978-84-397-2077-7',
    category: 'Literatura Latinoamericana',
    available: false,
    publicationYear: 1967
  }
];

describe('BookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    test('debe obtener todos los libros exitosamente', async () => {
      mockApiService.get.mockResolvedValue({ data: mockBooks });

      const result = await BookService.getAllBooks();

      expect(mockApiService.get).toHaveBeenCalledWith('/books');
      expect(result).toEqual(mockBooks);
    });

    test('debe manejar errores al obtener libros', async () => {
      const error = new Error('Error de red');
      mockApiService.get.mockRejectedValue(error);

      await expect(BookService.getAllBooks()).rejects.toThrow('Error de red');
    });
  });

  describe('getBookById', () => {
    test('debe obtener un libro por ID exitosamente', async () => {
      const bookId = 1;
      const mockBook = mockBooks[0];
      mockApiService.get.mockResolvedValue({ data: mockBook });

      const result = await BookService.getBookById(bookId);

      expect(mockApiService.get).toHaveBeenCalledWith(`/books/${bookId}`);
      expect(result).toEqual(mockBook);
    });
  });

  describe('searchBooks', () => {
    test('debe buscar libros por término exitosamente', async () => {
      const searchTerm = 'Quijote';
      const filteredBooks = [mockBooks[0]];
      mockApiService.get.mockResolvedValue({ data: filteredBooks });

      const result = await BookService.searchBooks(searchTerm);

      expect(mockApiService.get).toHaveBeenCalledWith(`/books/search?q=${searchTerm}`);
      expect(result).toEqual(filteredBooks);
    });
  });

  describe('createBook', () => {
    test('debe crear un nuevo libro exitosamente', async () => {
      const newBook = {
        title: 'Nuevo Libro',
        author: 'Nuevo Autor',
        isbn: '978-123-456-7890',
        category: 'Ficción'
      };
      const createdBook = { id: 3, ...newBook, available: true };
      mockApiService.post.mockResolvedValue({ data: createdBook });

      const result = await BookService.createBook(newBook);

      expect(mockApiService.post).toHaveBeenCalledWith('/books', newBook);
      expect(result).toEqual(createdBook);
    });
  });

  describe('updateBook', () => {
    test('debe actualizar un libro exitosamente', async () => {
      const bookId = 1;
      const updateData = { title: 'El Quijote Actualizado' };
      const updatedBook = { ...mockBooks[0], ...updateData };
      mockApiService.put.mockResolvedValue({ data: updatedBook });

      const result = await BookService.updateBook(bookId, updateData);

      expect(mockApiService.put).toHaveBeenCalledWith(`/books/${bookId}`, updateData);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('deleteBook', () => {
    test('debe eliminar un libro exitosamente', async () => {
      const bookId = 1;
      mockApiService.delete.mockResolvedValue({ data: { message: 'Libro eliminado' } });

      const result = await BookService.deleteBook(bookId);

      expect(mockApiService.delete).toHaveBeenCalledWith(`/books/${bookId}`);
      expect(result).toEqual({ message: 'Libro eliminado' });
    });
  });

  describe('getBooksByCategory', () => {
    test('debe obtener libros por categoría exitosamente', async () => {
      const category = 'Literatura Clásica';
      const filteredBooks = [mockBooks[0]];
      mockApiService.get.mockResolvedValue({ data: filteredBooks });

      const result = await BookService.getBooksByCategory(category);

      expect(mockApiService.get).toHaveBeenCalledWith(`/books/category/${category}`);
      expect(result).toEqual(filteredBooks);
    });
  });

  describe('getAvailableBooks', () => {
    test('debe obtener solo libros disponibles exitosamente', async () => {
      const availableBooks = [mockBooks[0]];
      mockApiService.get.mockResolvedValue({ data: availableBooks });

      const result = await BookService.getAvailableBooks();

      expect(mockApiService.get).toHaveBeenCalledWith('/books/available');
      expect(result).toEqual(availableBooks);
    });
  });
}); 