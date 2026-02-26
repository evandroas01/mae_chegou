import { api } from './api';
import { Contrato } from '@/types/contrato';

export const contratoService = {
  async getAll(): Promise<Contrato[]> {
    return api.get<Contrato[]>('/contratos');
  },

  async getById(id: string): Promise<Contrato> {
    return api.get<Contrato>(`/contratos/${id}`);
  },

  async create(contratoData: any): Promise<Contrato> {
    return api.post<Contrato>('/contratos', contratoData);
  },

  async update(id: string, contratoData: Partial<Contrato>): Promise<Contrato> {
    return api.put<Contrato>(`/contratos/${id}`, contratoData);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/contratos/${id}`);
  },

  async assinar(id: string): Promise<Contrato> {
    return api.post<Contrato>(`/contratos/${id}/assinar`, {});
  },

  async cancelar(id: string, motivo?: string): Promise<Contrato> {
    return api.post<Contrato>(`/contratos/${id}/cancelar`, { motivo });
  },
};

