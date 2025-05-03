import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, ImageOff } from 'lucide-react';
import { Product } from '../types';

interface ProductCarouselProps {
  products: Product[];
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  onAddToCart?: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  autoPlay = true,
  autoPlaySpeed = 5000,
  onAddToCart,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));

  const getVisibleItems = () => {
    if (isXs) return 1;
    if (isSm) return 2;
    if (isMd) return 3;
    return 4;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const visibleItems = getVisibleItems();
  const maxIndex = Math.max(0, products.length - visibleItems);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && products.length > visibleItems) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlaySpeed);
    }
    return () => clearInterval(timer);
  }, [autoPlay, autoPlaySpeed, products.length, visibleItems, maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart?.(product);
    setAddedToCart(product.codigo);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        py: 6,
        px: 2,
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de productos"
    >
      <Box
        ref={carouselRef}
        sx={{
          display: 'flex',
          transition: !isDragging ? 'transform 0.5s ease' : 'none',
          transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          gap: 4,
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {products.map((product) => (
          <Box
            key={product.codigo}
            sx={{
              flex: `0 0 calc(${100 / visibleItems}% - ${(32 * (visibleItems - 1)) / visibleItems}px)`,
              p: 5,
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(148,163,184,0.25)',
              boxShadow: '0 8px 32px rgba(148,163,184,0.15)',
              transition: 'all 0.3s ease',
              transform: addedToCart === product.codigo ? 'scale(1.05)' : 'scale(1)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                border: '3px solid rgba(240,171,252,0.5)',
                boxShadow: '0 12px 40px rgba(240,171,252,0.25)',
                transform: 'translateY(-6px)',
              },
            }}
          >
            {addedToCart === product.codigo && (
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
                height: 200,
                mb: 4,
                borderRadius: 4,
                overflow: 'hidden',
                border: '2px solid rgba(148,163,184,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
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

            <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, fontSize: '1.25rem' }}>
              {product.nombre}
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              {product.descripcion}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
              onClick={() => handleAddToCart(product)}
              startIcon={<ShoppingCart size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #94a3b8, #f0abfc)',
                color: 'white',
                py: 2,
                fontSize: '0.95rem',
                fontWeight: 600,
                border: '2px solid rgba(240,171,252,0.3)',
                borderRadius: 3,
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
        ))}
      </Box>

      {currentIndex > 0 && (
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'white',
            border: '3px solid rgba(148,163,184,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            p: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '3px solid rgba(240,171,252,0.5)',
              transform: 'translateY(-50%) scale(1.1)',
            },
          }}
          aria-label="Anterior producto"
        >
          <ChevronLeft size={24} />
        </IconButton>
      )}

      {currentIndex < maxIndex && (
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'white',
            border: '3px solid rgba(148,163,184,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            p: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '3px solid rgba(240,171,252,0.5)',
              transform: 'translateY(-50%) scale(1.1)',
            },
          }}
          aria-label="Siguiente producto"
        >
          <ChevronRight size={24} />
        </IconButton>
      )}
    </Box>
  );
};

export default ProductCarousel;