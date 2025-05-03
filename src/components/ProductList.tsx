import React, { useState } from 'react';
import { useProductContext } from '../context/ProductContext';
import { SortField } from '../types';
import {
  Box,
  Card,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Fade,
  Chip,
} from '@mui/material';
import {
  Search,
  Trash2,
  PackageSearch,
  ArrowUpDown,
  Calendar,
  Hash,
  ShoppingBag,
  Package,
  Sparkles,
} from 'lucide-react';

const ProductList: React.FC = () => {
  const { state, deleteProduct, searchProducts, sortProducts } = useProductContext();
  const { filteredProducts, searchTerm, sortOption } = state;
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchProducts(e.target.value);
  };

  const handleSort = (field: SortField) => {
    sortProducts(field);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const confirmDelete = (codigo: number, nombre: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar el producto "${nombre}"?`)) {
      deleteProduct(codigo);
    }
  };

  return (
    <Container maxWidth="lg">
      <Card 
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Box sx={{ 
          position: 'absolute',
          top: -20,
          left: { xs: 20, md: 40 },
          p: 2,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #94a3b8, #f0abfc)',
          boxShadow: '0 8px 20px rgba(192,132,252,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <PackageSearch size={24} color="white" />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Inventario
          </Typography>
          <Sparkles size={16} color="white" style={{ marginLeft: 4 }} />
        </Box>

        <Box sx={{ mt: 4, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Buscar productos por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} className="text-slate-400" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
          />
        </Box>

        {filteredProducts.length === 0 ? (
          <Box sx={{
            py: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #faf5ff, #fdf4ff)',
            borderRadius: 4,
            border: '2px dashed rgba(192,132,252,0.2)',
          }}>
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm
                ? 'No se encontraron productos que coincidan con la búsqueda'
                : 'No hay productos registrados'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando tu primer producto'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortOption.field === 'codigo'}
                      direction={sortOption.field === 'codigo' ? sortOption.direction : 'asc'}
                      onClick={() => handleSort('codigo')}
                      IconComponent={ArrowUpDown}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Hash size={16} className="text-slate-400" />
                        Código
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortOption.field === 'nombre'}
                      direction={sortOption.field === 'nombre' ? sortOption.direction : 'asc'}
                      onClick={() => handleSort('nombre')}
                      IconComponent={ArrowUpDown}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingBag size={16} className="text-slate-400" />
                        Nombre
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortOption.field === 'cantidad'}
                      direction={sortOption.field === 'cantidad' ? sortOption.direction : 'asc'}
                      onClick={() => handleSort('cantidad')}
                      IconComponent={ArrowUpDown}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Package size={16} className="text-slate-400" />
                        Cantidad
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortOption.field === 'creacion'}
                      direction={sortOption.field === 'creacion' ? sortOption.direction : 'asc'}
                      onClick={() => handleSort('creacion')}
                      IconComponent={ArrowUpDown}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={16} className="text-slate-400" />
                        Fecha
                      </Box>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.codigo}
                    onMouseEnter={() => setHoveredRow(product.codigo)}
                    onMouseLeave={() => setHoveredRow(null)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(240,171,252,0.05)',
                      },
                      transition: 'background-color 0.2s ease-in-out',
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={`#${product.codigo}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(148,163,184,0.1)',
                          color: 'text.secondary',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{product.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        noWrap 
                        sx={{ 
                          maxWidth: 300,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        {product.descripcion || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.cantidad}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(240,171,252,0.1)',
                          color: '#c084fc',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        {formatDate(product.creacion)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Fade in={hoveredRow === product.codigo}>
                        <IconButton
                          onClick={() => confirmDelete(product.codigo, product.nombre)}
                          size="small"
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.light',
                              color: 'error.dark',
                            },
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Fade>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Container>
  );
};

export default ProductList;