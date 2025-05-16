import { keyframes } from '@mui/material/styles';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const typing = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

export const chatbotTheme = {
  borderRadius: '12px',
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
  },
  colors: {
    primary: '#1976d2',
    secondary: '#f5f5f5',
    text: '#333333',
    lightText: '#666666',
    background: '#ffffff',
    border: '#e0e0e0',
  },
  shadows: {
    light: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    strong: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  transitions: {
    duration: '0.3s',
    timing: 'ease-in-out',
  },
}; 