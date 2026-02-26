import { api } from './api';
import { Notificacao } from '@/types/notificacao';

export const notificacaoService = {
  async getAll(): Promise<Notificacao[]> {
    return api.get<Notificacao[]>('/notificacoes');
  },

  async create(notificacaoData: {
    tipo: 'todos' | 'especifico';
    titulo: string;
    mensagem: string;
    enviarAgora: boolean;
    dataHoraAgendamento?: string;
    destinatarioIds?: string[];
  }): Promise<Notificacao> {
    return api.post<Notificacao>('/notificacoes', notificacaoData);
  },

  async marcarComoLida(id: string): Promise<void> {
    return api.post<void>(`/notificacoes/${id}/marcar-lida`, {});
  },

  async getResponsaveisDisponiveis(): Promise<Array<{
    id: string;
    nome: string;
    cpf: string;
    telefone: string;
    email?: string;
  }>> {
    return api.get('/notificacoes/responsaveis/disponiveis');
  },
};

