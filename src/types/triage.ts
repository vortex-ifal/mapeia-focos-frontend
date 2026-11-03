import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type TriagePhase = "review" | "confirm-validation" | "validated";

export type ModerationStatusKey = "accepted" | "rejected";

export type TriageEvidence = {
  id: string;
  alt: string;
  url: string;
};

export type TriageMediaResponse = {
  id: string;
  mimeType: string;
  fileSizeBytes: number;
  type: string;
  uploadedAt: string;
};

export type OccurrenceListItemResponse = {
  id: string;
  protocol: string;
  address: string;
  description: string;
  situationType: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  status: OperationalStatus;
  priority: OperationalPriority | null;
  media: TriageMediaResponse[];
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