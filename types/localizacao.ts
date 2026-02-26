/**
 * Interface da localização do veículo
 */
export interface LocalizacaoVeiculo {
  id: string;
  veiculoId: string;
  latitude: number;
  longitude: number;
  velocidade?: number;
  direcao?: number;
  timestamp: string;
  createdAt: string;
}


