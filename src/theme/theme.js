import { createTheme } from '@mui/material/styles';

// Paleta de colores café moderna y elegante
const colors = {
  // Colores principales café
  primary: {
    main: '#8B4513', // Saddle Brown - café oscuro principal
    light: '#A0522D', // Sienna - café medio
    dark: '#654321', // Dark Brown - café muy oscuro
    contrastText: '#FFFFFF',
  },
  
  // Colores secundarios
  secondary: {
    main: '#D2691E', // Chocolate - café dorado
    light: '#DEB887', // Burly Wood - café claro
    dark: '#CD853F', // Peru - café medio dorado
    contrastText: '#FFFFFF',
  },
  
  // Colores de acento
  accent: {
    main: '#F4A460', // Sandy Brown - café arena
    light: '#F5DEB3', // Wheat - trigo claro
    dark: '#DAA520', // Goldenrod - dorado
  },
  
  // Colores de fondo
  background: {
    default: '#FDF5E6', // Old Lace - crema muy claro
    paper: '#FFFFFF',
    secondary: '#FAF0E6', // Linen - lino claro
  },
  
  // Colores de texto
  text: {
    primary: '#2F1B14', // Café muy oscuro para texto principal
    secondary: '#5D4037', // Café medio para texto secundario
    disabled: '#8D6E63', // Café claro para texto deshabilitado
  },
  
  // Colores de estado
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
};

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: colors.text.primary,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.text.primary,
      marginBottom: '0.75rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: colors.text.primary,
      marginBottom: '0.5rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: colors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: colors.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.text.secondary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  spacing: 8,
  
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100% !important',
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(139, 69, 19, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(139, 69, 19, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.1)',
          border: `1px solid ${colors.accent.light}`,
          '&:hover': {
            boxShadow: '0 8px 24px rgba(139, 69, 19, 0.15)',
          },
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.light,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.main,
          boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
        },
      },
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.paper,
          borderRight: `1px solid ${colors.accent.light}`,
        },
      },
    },
    
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: colors.accent.light,
          },
          '&.Mui-selected': {
            backgroundColor: colors.primary.light,
            color: colors.primary.contrastText,
            '&:hover': {
              backgroundColor: colors.primary.main,
            },
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
        },
        colorSecondary: {
          backgroundColor: colors.secondary.main,
          color: colors.secondary.contrastText,
        },
      },
    },
    
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme; 