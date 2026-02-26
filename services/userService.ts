import { api } from './api';
import { User } from '@/types/user';

export const userService = {
  async getMe(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  async update(updates: Partial<User>): Promise<User> {
    return api.put<User>('/auth/me', updates);
  },
};

