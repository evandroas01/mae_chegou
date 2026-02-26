export type PeriodoRota = 'M' | 'T' | 'N'; // Manhã, Tarde, Noite
export type StatusOnline = 'online' | 'offline';
export type StatusRota = 'nao_iniciada' | 'em_andamento' | 'finalizada';

export interface PontoRota {
  id: string;
  alunoId?: string; // Se for casa de aluno
  tipo: 'casa' | 'escola' | 'retorno';
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    latitude?: number;
    longitude?: number;
  };
  ordem: number;
  tempoEstimado?: number; // em minutos
}

export interface Rota {
  id: string;
  periodo: PeriodoRota;
  data: string;
  pontos: PontoRota[];
  status: StatusRota;
  motoristaId: string;
  horaInicio?: string;
  horaFim?: string;
  paradas: ParadaRota[];
  createdAt: string;
  updatedAt: string;
}

export interface ParadaRota {
  id: string;
  rotaId: string;
  pontoId: string;
  horaChegada?: string;
  horaSaida?: string;
  notificacaoEnviada: boolean;
}

export interface LocalizacaoVeiculo {
  veiculoId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  velocidade?: number;
  direcao?: number;
}

