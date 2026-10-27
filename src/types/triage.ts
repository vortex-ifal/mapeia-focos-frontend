import type { OperationalStatus } from "@/types/operations";

export type TriagePhase = "review" | "confirm-validation" | "validated";

export type ModerationStatusKey = "accepted" | "rejected";

export type TriageEvidence = {
  id: string;
  alt: string;
  url: string;
};

export type OccurrenceListItemResponse = {
  id: string;
  protocol: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  waitingMinutes: number;
  status: OperationalStatus;
};

export type OccurrenceListResponse = {
  data: OccurrenceListItemResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type NearbyOccurrenceResponse = {
  id: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  status: OperationalStatus;
  createdAt: string;
};

export type TerritorialContextResponse = {
  radiusMeters: number;
  total: number;
  items: NearbyOccurrenceResponse[];
};

export type TriageOccurrence = {
  id: string;
  protocol: string;
  displayCode: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  waitingMinutes: number;
  status: OperationalStatus;
  description: string | null;
  evidence: TriageEvidence[];
};

export type TriageMapPoint = {
  id: string;
  x: number;
  y: number;
  selected: boolean;
  distanceMeters: number | null;
};