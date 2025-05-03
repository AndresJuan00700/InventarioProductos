import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useCarousel } from '../../hooks/useCarousel';
import ProductCard from './ProductCard';

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
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const {
    currentIndex,
    visibleItems,
    maxIndex,
    isDragging,
    carouselRef,
    handleNext,
    handlePrev,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
  } = useCarousel({
    itemsCount: products.length,
    autoPlay,
    autoPlaySpeed,
  });

  const handleAddToCart = (product: Product) => {
    onAddToCart?.(product);
    setAddedToCart(product.codigo);
    setTimeout(() => setAddedToCart(null), 1500);
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
            }}
          >
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              isAdded={addedToCart === product.codigo}
            />
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