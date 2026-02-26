import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';

export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('[ApiService] Inicializado com baseURL:', this.baseURL);
  }

  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@token');
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('@token', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@token');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log('[ApiService] Fazendo requisição para:', fullUrl);
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Se não tiver conteúdo, retornar vazio
      const contentType = response.headers.get('content-type');
      const hasJson = contentType?.includes('application/json');
      
      let data: any;
      if (hasJson) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Se for erro 401, remover token e redirecionar para login
        if (response.status === 401) {
          await this.removeToken();
          throw {
            error: 'Não autorizado',
            message: 'Sua sessão expirou. Por favor, faça login novamente.',
            status: 401,
          } as ApiError;
        }

        throw {
          error: data.error || 'Erro na requisição',
          message: data.message || data.error,
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          error: 'Timeout',
          message: 'A requisição demorou muito para responder',
          status: 408,
        } as ApiError;
      }

      if (error.status) {
        throw error;
      }

      throw {
        error: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = await this.getToken();

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT * 2); // Upload pode demorar mais

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await this.removeToken();
          throw {
            error: 'Não autorizado',
            message: 'Sua sessão expirou. Por favor, faça login novamente.',
            status: 401,
          } as ApiError;
        }

        throw {
          error: data.error || 'Erro no upload',
          message: data.message || data.error,
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.status) {
        throw error;
      }

      throw {
        error: 'Erro de conexão',
        message: 'Não foi possível fazer o upload. Verifique sua conexão.',
        status: 0,
      } as ApiError;
    }
  }

  // Métodos para gerenciar token
  async saveToken(token: string): Promise<void> {
    await this.setToken(token);
  }

  async clearToken(): Promise<void> {
    await this.removeToken();
  }
}

export const api = new ApiService();

