// Datos mock para usuarios
export const mockUsers = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@biblioteca.com',
    role: 'admin',
    phone: '123-456-7890',
    address: 'Calle Principal 123',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@biblioteca.com',
    role: 'librarian',
    phone: '098-765-4321',
    address: 'Avenida Central 456',
    createdAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@biblioteca.com',
    role: 'user',
    phone: '555-123-4567',
    address: 'Plaza Mayor 789',
    createdAt: '2024-02-01T09:15:00Z'
  }
];

// Datos mock para libros
export const mockBooks = [
  {
    id: 1,
    title: 'El Quijote',
    author: 'Miguel de Cervantes',
    isbn: '978-84-376-0494-7',
    category: 'Literatura Clásica',
    available: true,
    publicationYear: 1605,
    description: 'Obra maestra de la literatura española',
    pages: 863,
    language: 'Español'
  },
  {
    id: 2,
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    isbn: '978-84-397-2077-7',
    category: 'Literatura Latinoamericana',
    available: false,
    publicationYear: 1967,
    description: 'Novela del realismo mágico',
    pages: 471,
    language: 'Español'
  },
  {
    id: 3,
    title: 'Don Juan Tenorio',
    author: 'José Zorrilla',
    isbn: '978-84-376-0495-4',
    category: 'Teatro',
    available: true,
    publicationYear: 1844,
    description: 'Drama romántico español',
    pages: 156,
    language: 'Español'
  },
  {
    id: 4,
    title: 'La casa de los espíritus',
    author: 'Isabel Allende',
    isbn: '978-84-397-2078-4',
    category: 'Literatura Latinoamericana',
    available: true,
    publicationYear: 1982,
    description: 'Novela familiar y mágica',
    pages: 432,
    language: 'Español'
  }
];

// Datos mock para préstamos
export const mockLoans = [
  {
    id: 1,
    userId: 3,
    bookId: 2,
    bookTitle: 'Cien años de soledad',
    userName: 'Carlos López',
    loanDate: '2024-03-01T10:00:00Z',
    dueDate: '2024-03-15T10:00:00Z',
    returnDate: null,
    status: 'active'
  },
  {
    id: 2,
    userId: 1,
    bookId: 1,
    bookTitle: 'El Quijote',
    userName: 'Juan Pérez',
    loanDate: '2024-02-15T14:30:00Z',
    dueDate: '2024-03-01T14:30:00Z',
    returnDate: '2024-02-28T16:00:00Z',
    status: 'returned'
  },
  {
    id: 3,
    userId: 2,
    bookId: 4,
    bookTitle: 'La casa de los espíritus',
    userName: 'María García',
    loanDate: '2024-03-05T09:15:00Z',
    dueDate: '2024-03-19T09:15:00Z',
    returnDate: null,
    status: 'active'
  }
];

// Datos mock para categorías
export const mockCategories = [
  {
    id: 1,
    name: 'Literatura Clásica',
    description: 'Obras clásicas de la literatura universal',
    bookCount: 15
  },
  {
    id: 2,
    name: 'Literatura Latinoamericana',
    description: 'Literatura contemporánea de América Latina',
    bookCount: 23
  },
  {
    id: 3,
    name: 'Teatro',
    description: 'Obras de teatro y dramaturgia',
    bookCount: 8
  },
  {
    id: 4,
    name: 'Ciencia Ficción',
    description: 'Novelas de ciencia ficción y fantasía',
    bookCount: 12
  }
];

// Datos mock para estadísticas
export const mockStats = {
  totalBooks: 156,
  totalUsers: 89,
  activeLoans: 23,
  overdueLoans: 3,
  popularCategories: [
    { name: 'Literatura Latinoamericana', count: 23 },
    { name: 'Literatura Clásica', count: 15 },
    { name: 'Ciencia Ficción', count: 12 }
  ],
  recentActivity: [
    { type: 'loan', book: 'Cien años de soledad', user: 'Carlos López', date: '2024-03-01' },
    { type: 'return', book: 'El Quijote', user: 'Juan Pérez', date: '2024-02-28' },
    { type: 'loan', book: 'La casa de los espíritus', user: 'María García', date: '2024-03-05' }
  ]
};

// Datos mock para notificaciones
export const mockNotifications = [
  {
    id: 1,
    userId: 3,
    type: 'overdue',
    message: 'Tu préstamo de "Cien años de soledad" está vencido',
    read: false,
    createdAt: '2024-03-16T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    type: 'reminder',
    message: 'Tu préstamo de "El Quijote" vence en 2 días',
    read: true,
    createdAt: '2024-02-27T14:30:00Z'
  },
  {
    id: 3,
    userId: 2,
    type: 'new_book',
    message: 'Nuevo libro disponible: "La casa de los espíritus"',
    read: false,
    createdAt: '2024-03-05T09:15:00Z'
  }
];

// Datos mock para configuraciones
export const mockSettings = {
  libraryName: 'Biblioteca Digital Universitaria',
  maxLoanDays: 14,
  maxBooksPerUser: 5,
  finePerDay: 0.50,
  maintenanceMode: false,
  contactEmail: 'biblioteca@universidad.edu',
  contactPhone: '123-456-7890'
};

// Función helper para crear mocks dinámicos
export const createMockUser = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  name: 'Usuario Mock',
  email: 'usuario@mock.com',
  role: 'user',
  phone: '123-456-7890',
  address: 'Dirección Mock',
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createMockBook = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  title: 'Libro Mock',
  author: 'Autor Mock',
  isbn: '978-123-456-7890',
  category: 'Categoría Mock',
  available: true,
  publicationYear: 2024,
  description: 'Descripción del libro mock',
  pages: 300,
  language: 'Español',
  ...overrides
});

export const createMockLoan = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  userId: 1,
  bookId: 1,
  bookTitle: 'Libro Mock',
  userName: 'Usuario Mock',
  loanDate: new Date().toISOString(),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  returnDate: null,
  status: 'active',
  ...overrides
}); 