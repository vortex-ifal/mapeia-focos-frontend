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
  protocol: string;
  displayCode: string;
  address: string;
  neighborhood: string | null;
  locationContext: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  waitingMinutes: number;
  nextAction: string | null;
  priority: OperationalPriority | null;
  status: OperationalStatus;
  mapPosition: OperationalMapPosition | null;
  evidence: OperationalEvidence[];
};

export type TriageQueueItemResponse = {
  id: string;
  protocol: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  waitingMinutes: number;
  status: OperationalStatus;
};

export type TriageQueueResponse = {
  data: TriageQueueItemResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};