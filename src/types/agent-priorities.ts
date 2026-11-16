import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type AgentPrioritiesView = "list" | "map";

export type AgentPrioritiesSort = "default" | "area" | "status";

export type AgentWorkOccurrenceApiItem = {
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

export type AgentPriorityItem = {
  id: string;
  protocol: string;
  displayCode: string;
  address: string;
  region: string;

  status: OperationalStatus;
  statusLabel: string;
  actionLabel: string;

  priority: OperationalPriority | null;
  priorityLabel: string;

  createdAt: string;

  latitude: number | null;
  longitude: number | null;
};

export type AgentPriorityMapPoint = {
  id: string;
  x: number;
  y: number;
  selected: boolean;
};