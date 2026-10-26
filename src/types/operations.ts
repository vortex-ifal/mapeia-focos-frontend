export type OperationalPriority = "low" | "medium" | "high";

export type OperationalStatus = {
  key: string;
  name: string;
};

export type OperationalMapPosition = {
  x: number;
  y: number;
};

export type OperationalEvidence = {
  id: string;
  alt: string;
};

export type OperationalOccurrence = {
  id: string;
  displayCode: string;
  address: string;
  neighborhood: string;
  locationContext: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  waitingMinutes: number;
  nextAction: string;
  priority: OperationalPriority;
  status: OperationalStatus;
  mapPosition: OperationalMapPosition;
  evidence: OperationalEvidence[];
};

export type TriageQueueItemResponse = {
  id: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  waitingMinutes: number;
  status: OperationalStatus;
};

export type TriageQueueResponse = {
  items: TriageQueueItemResponse[];
  total: number;
  limit: number;
  offset: number;
};