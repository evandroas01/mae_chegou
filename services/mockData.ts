import { Aluno } from '@/types/aluno';
import { Contrato } from '@/types/contrato';
import { Lancamento } from '@/types/financeiro';
import { Manutencao, Veiculo } from '@/types/manutencao';
import { Rota } from '@/types/rota';

// Mock de alunos
export const mockAlunos: Aluno[] = [
  {
    id: '1',
    nome: 'João Silva',
    dataNascimento: '2010-05-15',
    serie: '5º Ano',
    turma: 'A',
    periodo: 'M',
    status: 'ativo',
    escola: { nome: 'Escola Municipal São Paulo', endereco: 'Rua A, 123' },
    responsavel: { nome: 'Maria Silva', cpf: '123.456.789-00', telefone: '(11) 98765-4321', email: 'maria@email.com' },
    enderecoContratante: { rua: 'Rua B', numero: '456', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP', cep: '01000-000' },
    valorMensal: 250,
    formaPagamento: 'pix',
    diasSemana: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
    datasVencimento: [5],
    pagamento: { status: 'em_dia' },
    contratoId: '1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    nome: 'Ana Costa',
    dataNascimento: '2011-08-20',
    serie: '4º Ano',
    turma: 'B',
    periodo: 'T',
    status: 'ativo',
    escola: { nome: 'Escola Estadual Central', endereco: 'Rua C, 789' },
    responsavel: { nome: 'Pedro Costa', cpf: '987.654.321-00', telefone: '(11) 91234-5678', email: 'pedro@email.com' },
    enderecoContratante: { rua: 'Rua D', numero: '789', bairro: 'Jardim', cidade: 'São Paulo', estado: 'SP', cep: '02000-000' },
    valorMensal: 280,
    formaPagamento: 'boleto',
    diasSemana: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
    datasVencimento: [10],
    pagamento: { status: 'atrasado' },
    contratoId: '2',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

// Mock de contratos
export const mockContratos: Contrato[] = [
  {
    id: '1',
    numero: 'CT-2024-001',
    responsavelId: '3',
    alunoIds: ['1'],
    periodo: 'M',
    valor: 250,
    vencimento: 5,
    statusAssinatura: 'assinado',
    statusPagamento: 'em_dia',
    dataInicio: '2024-01-01',
    logs: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    numero: 'CT-2024-002',
    responsavelId: '4',
    alunoIds: ['2'],
    periodo: 'T',
    valor: 280,
    vencimento: 10,
    statusAssinatura: 'assinado',
    statusPagamento: 'atrasado',
    periodoAtraso: 1,
    dataInicio: '2024-01-15',
    logs: [],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

// Mock de lançamentos financeiros
export const mockLancamentos: Lancamento[] = [
  {
    id: '1',
    tipo: 'receita',
    categoria: 'receita_recorrente',
    valor: 250,
    data: '2024-01-05',
    dataPagamento: '2024-01-05',
    descricao: 'Mensalidade João Silva',
    status: 'pago',
    vinculadoAlunoId: '1',
    vinculadoContratoId: '1',
    recorrencia: { tipo: 'mensal' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-05',
  },
  {
    id: '2',
    tipo: 'receita',
    categoria: 'receita_recorrente',
    valor: 280,
    data: '2024-01-10',
    dataVencimento: '2024-01-10',
    descricao: 'Mensalidade Ana Costa',
    status: 'atrasado',
    vinculadoAlunoId: '2',
    vinculadoContratoId: '2',
    recorrencia: { tipo: 'mensal' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    tipo: 'despesa',
    categoria: 'despesa_fixa',
    valor: 150,
    data: '2024-01-15',
    dataPagamento: '2024-01-15',
    descricao: 'Combustível',
    status: 'pago',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

// Mock de veículo
export const mockVeiculo: Veiculo = {
  id: '1',
  placa: 'ABC-1234',
  modelo: 'Van Escolar',
  ano: 2020,
  quilometragemAtual: 45000,
  documentos: {
    licenciamento: {
      numero: 'LIC-2024-001',
      validade: '2024-12-31',
    },
    seguro: {
      numero: 'SEG-2024-001',
      validade: '2024-06-30',
    },
    vistoriaEscolar: {
      numero: 'VIS-2024-001',
      validade: '2024-03-31',
    },
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

// Mock de manutenções
export const mockManutencoes: Manutencao[] = [
  {
    id: '1',
    veiculoId: '1',
    dataAgendada: '2024-02-15',
    tipo: 'preventiva',
    descricao: 'Troca de óleo e filtros',
    custo: 0,
    quilometragem: 50000,
    status: 'agendada',
    repetir: { tipo: 'km', intervalo: 10000 },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

// Capacidade da van
export const CAPACIDADE_VAN = 15;

