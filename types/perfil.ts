export interface PerfilMotorista {
  id: string;
  userId: string;
  dadosPessoais: {
    nome: string;
    email: string;
    telefone: string;
    fotoPerfil?: string;
  };
  cnh: {
    numero: string;
    validade: string;
    arquivoUrl?: string;
  };
  documentos: {
    tipo: string;
    numero: string;
    validade?: string;
    arquivoUrl: string;
  }[];
  escolas: {
    id: string;
    nome: string;
    endereco: string;
  }[];
  vagasPorPeriodo: {
    manha: number;
    tarde: number;
    noite: number;
  };
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
    pix?: string;
  };
  preferencias: {
    receberNotificacoes: boolean;
    privacidadeRota: boolean; // Se permite visualização da rota
    idioma: 'pt-BR' | 'en-US' | 'es-ES';
  };
  statusVerificacao: {
    documentosValidados: boolean;
    validadoEm?: string;
    validadoPor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

