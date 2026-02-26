/**
 * Tema inspirado no AdminLTE com cores do logo
 */

import { LogoTheme } from './logo-theme';

export const AdminLTETheme = {
  colors: {
    primary: LogoTheme.primary,           // Verde Localização #3D8361
    secondary: LogoTheme.secondary,       // Azul Confirmação #68B3E9
    success: LogoTheme.success,           // Azul Confirmação #68B3E9
    info: LogoTheme.info,                 // Azul Confirmação #68B3E9
    warning: LogoTheme.warning,
    danger: LogoTheme.danger,
    dark: LogoTheme.text,                 // Cinza Escuro #404E5A
    light: LogoTheme.backgroundLight,
    white: LogoTheme.background,           // Branco Puro #FFFFFF
    sidebar: {
      bg: LogoTheme.sidebar.bg,
      hover: LogoTheme.sidebar.hover,
      active: LogoTheme.sidebar.active,
      text: LogoTheme.sidebar.text,
      textActive: LogoTheme.sidebar.textActive,
    },
    header: {
      bg: LogoTheme.header.bg,
      text: LogoTheme.header.text,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

