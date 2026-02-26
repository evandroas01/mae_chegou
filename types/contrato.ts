export interface Contrato {
  id: string;
  numero: string;
  responsavelId: string;
  alunoIds: string[]; // Pode ter múltiplos alunos no mesmo contrato
  periodo: 'M' | 'T' | 'N'; // Manhã, Tarde, Noite
  valor: number;
  vencimento: number; // Dia do mês
  statusAssinatura: 'pendente' | 'assinado' | 'cancelado';
  statusPagamento: 'em_dia' | 'atrasado';
  periodoAtraso?: number; // Quantos períodos em atraso
  clausulas?: string; // Texto das cláusulas ou URL do arquivo
  arquivoUrl?: string; // URL do PDF gerado
  dataInicio: string;
  dataFim?: string;
  dataEnvio?: string;
  dataAssinatura?: string;
  logs: ContratoLog[];
  createdAt: string;
  updatedAt: string;
}

export interface ContratoLog {
  id: string;
  contratoId: string;
  acao: 'criado' | 'enviado' | 'assinado' | 'cancelado' | 'reemitido';
  data: string;
  observacoes?: string;
}

