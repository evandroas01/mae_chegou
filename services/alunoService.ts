import { api } from './api';
import { Aluno } from '@/types/aluno';

export const alunoService = {
  async getAll(): Promise<Aluno[]> {
    return api.get<Aluno[]>('/alunos');
  },

  async getById(id: string): Promise<Aluno> {
    return api.get<Aluno>(`/alunos/${id}`);
  },

  async create(alunoData: any): Promise<Aluno> {
    return api.post<Aluno>('/alunos', alunoData);
  },

  async update(id: string, alunoData: Partial<Aluno>): Promise<Aluno> {
    return api.put<Aluno>(`/alunos/${id}`, alunoData);
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/alunos/${id}`);
  },
};

