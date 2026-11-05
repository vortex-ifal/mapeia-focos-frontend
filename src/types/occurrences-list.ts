import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type OccurrenceListApiItem = {
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
};

export type OccurrencesListApiResponse = {
  data: OccurrenceListApiItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type OccurrenceListItem = {
  id: string;
  protocol: string;
  displayCode: string;
  address: string;
  description: string;
  situationType: string | null;
  region: string;
  status: OperationalStatus;
  statusLabel: string;
  priority: OperationalPriority | null;
  createdAt: string;
  updatedAt: string;
  elapsedMinutes: number;
};

export type OccurrenceListFilters = {
  query: string;
  statusKey: string | null;
  region: string | null;
  priority: OperationalPriority | null;
};