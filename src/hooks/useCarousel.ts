import { useState, useRef, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

interface UseCarouselProps {
  itemsCount: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
}

export const useCarousel = ({ itemsCount, autoPlay = true, autoPlaySpeed = 5000 }: UseCarouselProps) => {
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

  const visibleItems = getVisibleItems();
  const maxIndex = Math.max(0, itemsCount - visibleItems);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && itemsCount > visibleItems) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlaySpeed);
    }
    return () => clearInterval(timer);
  }, [autoPlay, autoPlaySpeed, itemsCount, visibleItems, maxIndex]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  return {
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
  };
};