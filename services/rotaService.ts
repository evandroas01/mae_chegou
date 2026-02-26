import { api } from './api';
import { Rota, LocalizacaoVeiculo } from '@/types/rota';

export interface RotaFilters {
  periodo?: 'M' | 'T' | 'N';
  status?: 'nao_iniciada' | 'em_andamento' | 'finalizada';
  data?: string;
}

export const rotaService = {
  async getAll(filters?: RotaFilters): Promise<Rota[]> {
    const params = new URLSearchParams();
    if (filters?.periodo) params.append('periodo', filters.periodo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.data) params.append('data', filters.data);
    
    const query = params.toString();
    return api.get<Rota[]>(`/rotas${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Rota> {
    return api.get<Rota>(`/rotas/${id}`);
  },

  async create(rotaData: any): Promise<Rota> {
    return api.post<Rota>('/rotas', rotaData);
  },

  async update(id: string, rotaData: Partial<Rota>): Promise<Rota> {
    return api.put<Rota>(`/rotas/${id}`, rotaData);
  },

  async iniciar(id: string): Promise<Rota> {
    return api.post<Rota>(`/rotas/${id}/iniciar`, {});
  },

  async finalizar(id: string): Promise<Rota> {
    return api.post<Rota>(`/rotas/${id}/finalizar`, {});
  },

  async getLocalizacao(veiculoId: string): Promise<LocalizacaoVeiculo> {
    return api.get<LocalizacaoVeiculo>(`/rotas/localizacao/${veiculoId}`);
  },
};

