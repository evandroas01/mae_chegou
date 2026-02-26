export interface Aluno {
  id: string;
  nome: string;
  dataNascimento: string;
  serie: string;
  turma: string;
  periodo: 'M' | 'T' | 'N'; // Manhã, Tarde, Noite
  status: 'ativo' | 'inativo';
  escola: {
    nome: string;
    endereco: string;
  };
  responsavel: {
    nome: string;
    cpf: string;
    telefone: string;
    email?: string;
  };
  enderecoContratante: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  enderecoSaida?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  valorMensal: number;
  formaPagamento: 'debito' | 'credito' | 'pix' | 'boleto';
  diasSemana: string[]; // ['segunda', 'terca', etc]
  datasVencimento: number[]; // Dias do mês [5, 10, 15]
  pagamento: {
    status: 'em_dia' | 'atrasado';
    ultimoPagamento?: string;
  };
  contratoId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagamento {
  id: string;
  alunoId: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pago' | 'pendente' | 'atrasado';
  formaPagamento: string;
  observacoes?: string;
}

export interface Contrato {
  id: string;
  alunoId: string;
  numero: string;
  dataInicio: string;
  dataFim?: string;
  valorMensal: number;
  status: 'ativo' | 'cancelado' | 'encerrado';
  arquivoUrl?: string;
}

