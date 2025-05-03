import React, { useState } from 'react';
import { useProductContext } from '../context/ProductContext';
import { 
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Grid,
  Alert,
  InputAdornment,
  Fade,
  Container,
} from '@mui/material';
import { 
  PackagePlus, 
  Hash, 
  ShoppingBag, 
  FileText, 
  Package,
  Sparkles,
  Upload,
} from 'lucide-react';

const ProductForm: React.FC = () => {
  const { addProduct } = useProductContext();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    cantidad: '',
    imagen: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('La imagen no debe superar los 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Por favor, seleccione un archivo de imagen válido');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData(prev => ({ ...prev, imagen: base64String }));
        setPreviewImage(base64String);
        setError('');
      };
      reader.onerror = () => {
        setError('Error al procesar la imagen');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.codigo || !formData.nombre || !formData.cantidad) {
      setError('Por favor, complete todos los campos requeridos');
      return false;
    }

    const codigo = parseInt(formData.codigo);
    if (isNaN(codigo) || codigo <= 0) {
      setError('El código debe ser un número positivo');
      return false;
    }

    const cantidad = parseInt(formData.cantidad);
    if (isNaN(cantidad) || cantidad < 0) {
      setError('La cantidad debe ser un número no negativo');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    addProduct({
      codigo: parseInt(formData.codigo),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      cantidad: parseInt(formData.cantidad),
      imagen: formData.imagen || undefined,
    });

    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      cantidad: '',
      imagen: '',
    });
    setPreviewImage(null);
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
          background: 'linear-gradient(135deg, #f0abfc, #c084fc)',
          boxShadow: '0 8px 20px rgba(240,171,252,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <PackagePlus size={24} color="white" />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Nuevo Producto
          </Typography>
          <Sparkles size={16} color="white" style={{ marginLeft: 4 }} />
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código del Producto"
                name="codigo"
                type="number"
                value={formData.codigo}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Hash size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                helperText="Identificador único del producto"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingBag size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                helperText="Nombre descriptivo del producto"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed rgba(240,171,252,0.4)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'rgba(240,171,252,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    backgroundColor: 'rgba(240,171,252,0.1)',
                  },
                }}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {previewImage ? (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        display: 'block',
                        color: 'text.secondary',
                      }}
                    >
                      Haz clic para cambiar la imagen
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ py: 4 }}>
                    <Upload
                      size={32}
                      className="mx-auto mb-2"
                      style={{ color: '#c084fc' }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      Haz clic para subir una imagen
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      PNG, JPG, GIF (max. 5MB)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FileText size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                helperText="Descripción detallada del producto"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cantidad"
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Package size={20} className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                helperText="Cantidad disponible en inventario"
              />
            </Grid>
          </Grid>

          <Fade in={!!error}>
            <Box sx={{ mt: 3 }}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 3,
                    backgroundColor: 'error.light',
                    color: 'error.dark',
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<PackagePlus size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #94a3b8, #f0abfc)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #64748b, #e879f9)',
                },
              }}
            >
              Agregar Producto
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default ProductForm;