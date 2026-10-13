export type LocationSource = "gps" | "manual";

export type OccurrenceDraft = {
  endereco: string;
  tipo_situacao: string;
  descricao: string;
  nome?: string;
  email?: string;
  telefone?: string;
  evidencia_nomes?: string[];

  latitude?: number;
  longitude?: number;

  localizacao_origem?: LocationSource;
  localizacao_contexto?: string;
};

export type OccurrenceFormData = OccurrenceDraft;

export type OccurrenceBackendPayload = {
  address: string;
  description: string;
  situation_type?: string;
  contact?: string;
  latitude?: number;
  longitude?: number;
};

export type OccurrenceResponse = {
  id?: string;
  protocolo?: string;
  status?: string;
};