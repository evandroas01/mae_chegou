import { api } from './api';
import { Veiculo } from '@/types/manutencao';

export const veiculoService = {
  async getByMotorista(): Promise<Veiculo[]> {
    return api.get<Veiculo[]>('/manutencoes/veiculos');
  },
};

