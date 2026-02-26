/**
 * Cores extraídas do logo
 * Ajuste estas cores conforme as cores reais do seu logo
 */

export const LogoTheme = {
  // Cores principais do logo
  primary: '#3D8361',      // Verde Localização - Ações e Foco
  secondary: '#68B3E9',    // Azul Confirmação - Destaque e Confirmação
  
  // Cores de fundo
  background: '#FFFFFF',   // Branco Puro - Fundo de telas
  backgroundLight: '#F8F9FA',
  
  // Cores de texto
  text: '#404E5A',         // Cinza Escuro - Texto Principal
  textLight: '#A9A9A9',    // Cinza Claro - Texto Secundário
  
  // Cores funcionais
  success: '#68B3E9',       // Usa azul confirmação para sucesso
  info: '#68B3E9',          // Usa azul confirmação para info
  warning: '#ffc107',
  danger: '#dc3545',
  
  // Cores para componentes
  sidebar: {
    bg: '#404E5A',         // Usa cor de texto principal (cinza escuro)
    hover: '#2C3E50',
    active: '#3D8361',     // Usa cor primária (verde)
    text: '#A9A9A9',       // Usa texto secundário
    textActive: '#ffffff',
  },
  header: {
    bg: '#3D8361',         // Usa cor primária (verde localização)
    text: '#ffffff',
  },
};

/**
 * INSTRUÇÕES PARA EXTRAIR CORES DO LOGO:
 * 
 * 1. Abra o logo/logotipo.jpg em um editor de imagens
 * 2. Use uma ferramenta de seleção de cor (eyedropper/pipeta)
 * 3. Identifique as cores principais:
 *    - Cor mais usada = primary
 *    - Segunda cor mais usada = secondary
 *    - Cor de destaque = accent
 * 4. Substitua os valores hex (#FF6B35, etc.) pelas cores reais
 * 5. Ajuste as cores de sidebar e header conforme necessário
 */

