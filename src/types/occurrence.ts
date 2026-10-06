export type OccurrenceDraft = {
  endereco: string;
  tipo_situacao: string;
  descricao: string;
  nome?: string;
  email?: string;
  telefone?: string;
  evidencia_nome?: string;
};

export type OccurrenceFormData = OccurrenceDraft;

export type OccurrenceBackendPayload = {
  address: string;
  description: string;
  situation_type?: string;
  contact?: string;
};

export type OccurrenceResponse = {
  id?: string;
  protocolo?: string;
  status?: string;
};