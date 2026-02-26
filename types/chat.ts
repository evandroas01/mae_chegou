export type TipoConversa = 'individual' | 'geral';

export interface Conversa {
  id: string;
  tipo: TipoConversa;
  participanteIds: string[]; // Para individual: [motoristaId, responsavelId]
  ultimaMensagem?: Mensagem;
  naoLidas: number;
  fixada: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Mensagem {
  id: string;
  conversaId: string;
  remetenteId: string;
  texto: string;
  anexos?: AnexoMensagem[];
  importante: boolean;
  lida: boolean;
  dataLeitura?: string;
  createdAt: string;
}

export interface AnexoMensagem {
  id: string;
  tipo: 'imagem' | 'pdf' | 'documento';
  url: string;
  nome: string;
  tamanho: number;
}

export interface RespostaRapida {
  id: string;
  texto: string;
  categoria?: string;
  createdAt: string;
}

