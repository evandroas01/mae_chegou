import { api } from './api';
import { User } from '@/types/user';

export const responsavelService = {
  async getByMotorista(): Promise<User[]> {
    return api.get<User[]>('/auth/responsaveis');
  },
};

