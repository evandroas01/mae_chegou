import { api } from './api';
import { Manutencao } from '@/types/manutencao';

export interface ManutencaoFilters {
  status?: 'agendada' | 'realizada' | 'atrasada';
  veiculoId?: string;
}

export const manutencaoService = {
  async getAll(filters?: ManutencaoFilters): Promise<Manutencao[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.veiculoId) params.append('veiculoId', filters.veiculoId);
    
    const query = params.toString();
    return api.get<Manutencao[]>(`/manutencoes${query ? `?${query}` : ''}`);
  },

  async create(manutencaoData: {
    veiculoId: string;
    dataAgendada?: string;
    tipo: 'preventiva' | 'corretiva';
    descricao: string;
    quilometragem: number;
    custo?: number;
    repetirTipo?: 'km' | 'meses';
    repetirIntervalo?: number;
  }): Promise<Manutencao> {
    return api.post<Manutencao>('/manutencoes', manutencaoData);
  },

  async update(id: string, manutencaoData: Partial<Manutencao>): Promise<Manutencao> {
    return api.put<Manutencao>(`/manutencoes/${id}`, manutencaoData);
  },
};

