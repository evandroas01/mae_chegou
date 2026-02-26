import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ApiError } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      const storedToken = await AsyncStorage.getItem('@token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Verificar se o token ainda é válido
        try {
          await api.get('/auth/me');
        } catch (error) {
          // Token inválido, limpar dados
          await logout();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<{ token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      if (response.token && response.user) {
        // Salvar token
        await api.saveToken(response.token);
        
        // Salvar usuário
        const userData: User = {
          id: response.user.id,
          nome: response.user.nome,
          email: response.user.email,
          role: response.user.role,
          telefone: (response.user as any).telefone,
          cpf: (response.user as any).cpf,
          alunosIds: response.user.alunosIds,
          motoristaId: response.user.motoristaId,
          filhosIds: response.user.filhosIds,
          responsavelId: response.user.responsavelId,
        };

        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao fazer login');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('@user');
      await api.clearToken();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = async (userData: User): Promise<void> => {
    try {
      const updatedUser: User = {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
        telefone: userData.telefone,
        cpf: userData.cpf,
        alunosIds: userData.alunosIds,
        motoristaId: userData.motoristaId,
        filhosIds: userData.filhosIds,
        responsavelId: userData.responsavelId,
      };

      setUser(updatedUser);
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

