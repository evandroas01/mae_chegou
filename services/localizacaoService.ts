import { api } from './api';
import { LocalizacaoVeiculo } from '@/types/localizacao';

export interface LocalizacaoPayload {
  veiculoId: string;
  latitude: number;
  longitude: number;
  velocidade?: number;
  direcao?: number;
}

export const localizacaoService = {
  async saveLocalizacao(data: LocalizacaoPayload): Promise<void> {
    await api.post('/rotas/localizacao', {
      veiculoId: data.veiculoId,
      latitude: data.latitude,
      longitude: data.longitude,
      velocidade: data.velocidade,
      direcao: data.direcao,
      timestamp: new Date().toISOString(),
    });
  },

  async getLocalizacao(veiculoId: string): Promise<LocalizacaoVeiculo | null> {
    try {
      return await api.get<LocalizacaoVeiculo>(`/rotas/localizacao/${veiculoId}`);
    } catch (error) {
      return null;
    }
  },

  async getLocalizacaoMotorista(): Promise<LocalizacaoVeiculo | null> {
    try {
      return await api.get<LocalizacaoVeiculo>('/rotas/localizacao-motorista');
    } catch (error) {
      return null;
    }
  },
};

