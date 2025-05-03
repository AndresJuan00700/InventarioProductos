import React, { Suspense } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import ProductCarousel from './components/carousel/ProductCarousel';
import { useProductContext } from './context/ProductContext';

const ProductForm = React.lazy(() => import('./components/ProductForm'));
const ProductList = React.lazy(() => import('./components/ProductList'));

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#94a3b8',
      light: '#cbd5e1',
      dark: '#64748b',
    },
    secondary: {
      main: '#f0abfc',
      light: '#f5d0fe',
      dark: '#e879f9',
    },
    background: {
      default: '#E5D9F2', 
      paper: '#FFFFFF',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
    },
    success: {
      main: '#86efac',
      light: '#bbf7d0',
    },
    warning: {
      main: '#fcd34d',
      light: '#fde68a',
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Inter", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fafafa',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(240,171,252,0.2)',
            },
          },
        },
      },
    },
  },
});

const CarouselSection: React.FC = () => {
  const { state } = useProductContext();

  const handleAddToCart = (product: any) => {
    console.log('Producto agregado al carrito:', product);
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-slate-800">
          Productos Destacados
        </h2>
        <ProductCarousel
          products={state.products}
          autoPlay={true}
          autoPlaySpeed={5000}
          onAddToCart={handleAddToCart}
        />
      </div>
    </section>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProductProvider>
        {/* Fondo plano cambiado aquí */}
        <div className="min-h-screen bg-slate-100">
          <Header />

          <main className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto space-y-12">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center min-h-[200px]">
                    <CircularProgress sx={{ color: 'secondary.main' }} />
                  </div>
                }
              >
                <ProductForm />
              </Suspense>

              <CarouselSection />

              <Suspense
                fallback={
                  <div className="flex justify-center items-center min-h-[200px]">
                    <CircularProgress sx={{ color: 'secondary.main' }} />
                  </div>
                }
              >
                <ProductList />
              </Suspense>
            </div>
          </main>

          <footer className="py-8 px-4 mt-12 bg-white/50 backdrop-blur-sm border-t border-purple-100">
            <div className="container mx-auto text-center">
              <p className="text-sm font-medium text-slate-600">
                &copy; {new Date().getFullYear()} Sistema de Gestión de Productos Andres Benitez
              </p>
            </div>
          </footer>
        </div>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;
