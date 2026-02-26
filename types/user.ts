/**
 * Tipos de usuário do sistema
 */
export type UserRole = 'admin' | 'motorista' | 'responsavel' | 'aluno';

/**
 * Interface do usuário
 */
export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  telefone?: string;
  cpf?: string;
  // Para motorista: lista de IDs dos alunos que ele atende
  alunosIds?: string[];
  // Para responsável: ID do motorista que atende seu(s) filho(s)
  motoristaId?: string;
  // Para responsável: lista de IDs dos alunos (filhos)
  filhosIds?: string[];
  // Para aluno: ID do responsável
  responsavelId?: string;
}

/**
 * Permissões por tipo de usuário
 */
export const Permissions = {
  admin: {
    canViewMap: true,
    canViewAllAlunos: true,
    canCreateAluno: true,
    canEditAluno: true,
    canViewFinanceiro: true,
    canViewRelatorios: true,
    canManageMotoristas: true,
    canManageResponsaveis: true,
  },
  motorista: {
    canViewMap: false, // Motorista não pode ver o mapa (usa rota)
    canViewAllAlunos: false,
    canViewMyAlunos: true, // Só vê seus próprios alunos
    canCreateAluno: true, // Pode criar alunos
    canEditAluno: true, // Pode editar alunos
    canViewFinanceiro: true, // Pode ver financeiro
    canViewRelatorios: true, // Pode ver relatórios
    canManageMotoristas: false,
    canManageResponsaveis: false,
  },
  responsavel: {
    canViewMap: true, // Responsável pode ver rastreio no mapa
    canViewAllAlunos: false,
    canViewMyFilhos: true, // Só vê seus próprios filhos
    canViewMyMotorista: true, // Vê informações do motorista
    canViewRastreio: true, // Pode rastrear filhos no mapa
    canCreateAluno: false,
    canEditAluno: false,
    canViewFinanceiro: true, // Pode ver pagamentos dos filhos
    canViewRelatorios: false,
    canManageMotoristas: false,
    canManageResponsaveis: false,
  },
  aluno: {
    canViewMap: false,
    canViewAllAlunos: false,
    canViewMyData: true, // Só vê seus próprios dados
    canShareLocation: true, // Pode compartilhar localização
    canCreateAluno: false,
    canEditAluno: false,
    canViewFinanceiro: false,
    canViewRelatorios: false,
    canManageMotoristas: false,
    canManageResponsaveis: false,
  },
};

