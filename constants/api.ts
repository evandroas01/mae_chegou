import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Função para obter o IP da máquina na rede local
const getLocalIP = (): string => {
  // Tenta obter o IP do Expo (quando disponível)
  if (Constants.expoConfig?.hostUri) {
    const hostUri = Constants.expoConfig.hostUri;
    const match = hostUri.match(/(\d+\.\d+\.\d+\.\d+)/);
    if (match) {
      console.log('[API] IP detectado automaticamente:', match[1]);
      return match[1];
    }
  }
  
  // IP padrão baseado no que o Expo detectou (192.168.15.3)
  // Você pode alterar este IP se necessário
  // Para descobrir seu IP: no Windows use `ipconfig`, no Mac/Linux use `ifconfig`
  const defaultIP = '192.168.15.3';
  console.log('[API] Usando IP padrão:', defaultIP);
  return defaultIP;
};

// Configuração da API
// Em desenvolvimento, usa localhost para web/emuladores
// e IP da rede local para dispositivos físicos
const getApiBaseUrl = (): string => {
  if (!__DEV__) {
    return 'https://api.chegueimae.com/api'; // Produção
  }

  // Para web, sempre usa localhost
  if (Platform.OS === 'web') {
    const url = 'http://localhost:3000/api';
    console.log('[API] Web detectado, usando:', url);
    return url;
  }

  // Para dispositivos móveis (iOS/Android), sempre usa IP da rede local
  // Isso funciona tanto para dispositivos físicos quanto emuladores conectados na mesma rede
  const localIP = getLocalIP();
  const url = `http://${localIP}:3000/api`;
  console.log('[API] Dispositivo móvel detectado, usando:', url);
  console.log('[API] Platform.OS:', Platform.OS);
  console.log('[API] Constants.expoConfig?.hostUri:', Constants.expoConfig?.hostUri);
  return url;
};

export const API_BASE_URL = getApiBaseUrl();
export const API_TIMEOUT = 30000; // 30 segundos

// Log da URL final para debug
console.log('[API] API_BASE_URL configurado como:', API_BASE_URL);

