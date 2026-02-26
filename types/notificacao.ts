export type NotificacaoTipo = 'local' | 'todos' | 'especifico';
export type NotificacaoStatus = 'agendada' | 'enviada' | 'lida' | 'cancelada';

export interface Notificacao {
  id: string;
  tipo: NotificacaoTipo;
  destinatarioIds?: string[]; // Para tipo 'especifico'
  titulo: string;
  mensagem: string;
  anexos?: string[];
  programacao: {
    enviarAgora: boolean;
    dataHora?: string; // Para agendamento
  };
  templateId?: string; // Se foi usado um template
  status: NotificacaoStatus;
  gatilho?: {
    tipo: 'faturamento' | 'rota_inicio' | 'rota_fim' | 'contrato_pendente' | 'manutencao_vencimento';
    parametros?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TemplateNotificacao {
  id: string;
  nome: string;
  titulo: string;
  mensagem: string;
  variaveis?: string[]; // Ex: ['{nome}', '{valor}', '{data}']
  tipoGatilho?: Notificacao['gatilho'] extends { tipo: infer T } ? T : undefined;
  createdAt: string;
  updatedAt: string;
}

