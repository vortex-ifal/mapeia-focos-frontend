export type OccurrenceFormData = {
  endereco: string;
  tipo_situacao: string;
  descricao: string;
  contato?: string;
  evidencia_nome?: string;
};

export type OccurrenceResponse = {
  id?: string;
  protocolo?: string;
  status?: string;
};