export type LocationSource = "gps" | "manual";

export type OccurrenceDraft = {
  address: string;
  situationType: string;
  description: string;
  evidenceNames?: string[];

  latitude?: number;
  longitude?: number;

  locationSource?: LocationSource;
  locationContext?: string;
};

export type OccurrenceFormData = OccurrenceDraft;

export type OccurrenceBackendPayload = {
  address: string;
  description: string;
  situationType?: string;
  latitude?: number;
  longitude?: number;
};

export type OccurrenceResponse = {
  id?: string;
  protocol?: string;
  protocolo?: string;
  status?: string;
};

export type OccurrenceStatusKey =
  | "registered"
  | "under_review"
  | "accepted"
  | "forwarded_for_inspection"
  | "resolved"
  | "rejected";

export type OccurrenceStatusResponse = {
  protocol: string;
  statusKey: OccurrenceStatusKey | string;
  statusName?: string;
};

