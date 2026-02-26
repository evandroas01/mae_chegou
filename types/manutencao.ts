export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
  quilometragemAtual: number;
  documentos: {
    licenciamento: {
      numero: string;
      validade: string;
      arquivoUrl?: string;
    };
    seguro: {
      numero: string;
      validade: string;
      arquivoUrl?: string;
    };
    vistoriaEscolar: {
      numero: string;
      validade: string;
      arquivoUrl?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export type ManutencaoTipo = 'preventiva' | 'corretiva';
export type ManutencaoStatus = 'agendada' | 'realizada' | 'atrasada';

export interface Manutencao {
  id: string;
  veiculoId: string;
  dataAgendada?: string;
  dataRealizada?: string;
  tipo: ManutencaoTipo;
  descricao: string;
  custo: number;
  quilometragem: number;
  status: ManutencaoStatus;
  repetir?: {
    tipo: 'km' | 'meses';
    intervalo: number; // Ex: 10000 km ou 6 meses
  };
  anexos?: string[]; // URLs de fotos/comprovantes
  createdAt: string;
  updatedAt: string;
}

