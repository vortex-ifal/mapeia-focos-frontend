import type { OperationalPriority } from "@/types/operations";

export type FieldDayStats = {
  assignedActivitiesCount: number;
  highPriorityCount: number;
  indicatedInspectionsCount: number;
};

export type FieldDayNextPriority = {
  id: string;
  protocol: string;
  displayCode: string;
  statusName: string;
  neighborhood: string;
  waitingMinutes: number;
  nextAction: string;
  priority: OperationalPriority | null;
};

export type FieldDayData = {
  stats: FieldDayStats;
  nextPriority: FieldDayNextPriority | null;
};

export type AgentDashboardNextPriorityResponse = {
  id: string;
  protocol: string;
  displayCode?: string;
  address?: string;
  neighborhood?: string | null;
  createdAt?: string;
  waitingMinutes?: number;
  nextAction?: string | null;
  status?: { key: string; name: string } | string;
  statusName?: string;
  priority?: OperationalPriority | null;
};

export type AgentDashboardApiResponse = {
  totalAssigned: number;
  totalHighPriority: number;
  totalInspections: number;
  nextPriority: AgentDashboardNextPriorityResponse | null;
};
