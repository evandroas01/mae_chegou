import { api } from './api';
import { Lancamento, ResumoFinanceiro } from '@/types/financeiro';

export interface LancamentoFilters {
  tipo?: 'receita' | 'despesa';
  status?: 'pago' | 'pendente' | 'atrasado';
  dataInicio?: string;
  dataFim?: string;
}

export const financeiroService = {
  async getAll(filters?: LancamentoFilters): Promise<Lancamento[]> {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters?.dataFim) params.append('dataFim', filters.dataFim);
    
    const query = params.toString();
    return api.get<Lancamento[]>(`/financeiro/lancamentos${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Lancamento> {
    return api.get<Lancamento>(`/financeiro/lancamentos/${id}`);
  },

  async create(lancamentoData: any): Promise<Lancamento> {
    return api.post<Lancamento>('/financeiro/lancamentos', lancamentoData);
  },

  async update(id: string, lancamentoData: Partial<Lancamento>): Promise<Lancamento> {
    return api.put<Lancamento>(`/financeiro/lancamentos/${id}`, lancamentoData);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/financeiro/lancamentos/${id}`);
  },

  async getResumo(): Promise<ResumoFinanceiro> {
    return api.get<ResumoFinanceiro>('/financeiro/resumo');
  },
};

