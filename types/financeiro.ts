export type LancamentoTipo = 'receita' | 'despesa';
export type LancamentoCategoria = 
  | 'receita_recorrente' 
  | 'receita_extra' 
  | 'despesa_fixa' 
  | 'despesa_variavel';
export type LancamentoStatus = 'pago' | 'pendente' | 'atrasado';

export interface Lancamento {
  id: string;
  tipo: LancamentoTipo;
  categoria: LancamentoCategoria;
  valor: number;
  data: string;
  dataVencimento?: string;
  dataPagamento?: string;
  descricao: string;
  status: LancamentoStatus;
  vinculadoAlunoId?: string;
  vinculadoContratoId?: string;
  recorrencia?: {
    tipo: 'mensal' | 'trimestral' | 'semestral' | 'anual';
    meses?: number; // Para recorrência personalizada
    dataFim?: string;
  };
  anexos?: string[]; // URLs dos comprovantes
  createdAt: string;
  updatedAt: string;
}

export interface ResumoFinanceiro {
  saldoAtual: number;
  totalReceitasMes: number;
  totalDespesasMes: number;
  saldoMes: number;
  inadimplencia: {
    valor: number;
    percentual: number;
    quantidade: number;
  };
}

