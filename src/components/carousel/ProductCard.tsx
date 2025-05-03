import React, { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { ShoppingCart, Sparkles, ImageOff, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdded: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAdded }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 6,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
        backdropFilter: 'blur(10px)',
        border: '3px solid rgba(148,163,184,0.25)',
        boxShadow: '0 8px 32px rgba(148,163,184,0.15)',
        transition: 'all 0.3s ease',
        transform: isAdded ? 'scale(1.05)' : 'scale(1)',
        position: 'relative',
        overflow: 'hidden',
        p: 5,
        '&:hover': {
          border: '3px solid rgba(240,171,252,0.5)',
          boxShadow: '0 12px 40px rgba(240,171,252,0.25)',
          transform: 'translateY(-6px)',
        },
      }}
    >
      {isAdded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.95)',
            zIndex: 1,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Sparkles size={24} />
            ¡Agregado!
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          height: '200px',
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          border: '2px solid rgba(148,163,184,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
          flexShrink: 0,
        }}
      >
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.style.display = 'flex';
                fallback.style.alignItems = 'center';
                fallback.style.justifyContent = 'center';
                fallback.style.width = '100%';
                fallback.style.height = '100%';
                const icon = document.createElement('div');
                parent.appendChild(fallback);
                fallback.appendChild(icon);
                const lucideIcon = new ImageOff({
                  color: '#94a3b8',
                  size: 48,
                });
                icon.appendChild(lucideIcon);
              }
            }}
          />
        ) : (
          <ImageOff size={48} color="#94a3b8" />
        )}
      </Box>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          fontSize: '1.25rem',
          flexShrink: 0,
        }}
      >
        {product.nombre}
      </Typography>

      <Box 
        sx={{ 
          flex: 1,
          position: 'relative',
          mb: 4,
          height: '120px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: expanded ? '100%' : '3rem',
            overflow: 'auto',
            transition: 'height 0.3s ease',
            maskImage: !expanded ? 'linear-gradient(to bottom, black 60%, transparent 100%)' : 'none',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(148,163,184,0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(240,171,252,0.3)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(240,171,252,0.5)',
              },
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              pr: 1,
              whiteSpace: 'pre-line',
            }}
          >
            {product.descripcion}
          </Typography>
        </Box>
        {product.descripcion.length > 100 && (
          <IconButton
            onClick={toggleExpanded}
            size="small"
            sx={{
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              border: '2px solid rgba(240,171,252,0.3)',
              boxShadow: '0 2px 8px rgba(240,171,252,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(240,171,252,0.1)',
              },
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </IconButton>
        )}
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 3,
            backgroundColor: 'rgba(240,171,252,0.15)',
            border: '2px solid rgba(240,171,252,0.3)',
            color: 'secondary.main',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          Stock: {product.cantidad}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={() => onAddToCart(product)}
        startIcon={<ShoppingCart size={20} />}
        sx={{
          background: 'linear-gradient(135deg, #94a3b8, #f0abfc)',
          color: 'white',
          py: 2,
          fontSize: '0.95rem',
          fontWeight: 600,
          border: '2px solid rgba(240,171,252,0.3)',
          borderRadius: 3,
          flexShrink: 0,
          '&:hover': {
            background: 'linear-gradient(135deg, #64748b, #e879f9)',
            border: '2px solid rgba(240,171,252,0.5)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(240,171,252,0.25)',
          },
        }}
      >
        Agregar al Carrito
      </Button>
    </Box>
  );
};

export default ProductCard;