import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { PackageSearch, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <Box 
      component="header" 
      sx={{
        py: 6,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(240,171,252,0.2)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          position: 'relative',
        }}>
          <Box sx={{ 
            position: 'relative',
            p: 2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f0abfc, #c084fc)',
            boxShadow: '0 8px 20px rgba(240,171,252,0.3)',
          }}>
            <PackageSearch size={32} color="white" />
            <Sparkles 
              size={20} 
              color="#f0abfc"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          </Box>
          
          <Box>
            <Typography 
              variant="h1" 
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                background: 'linear-gradient(135deg, #94a3b8, #f0abfc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Gestión de Productos
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', md: '1rem' },
                maxWidth: '600px',
              }}
            >
              Sistema inteligente para administrar tu inventario de manera eficiente y elegante
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;