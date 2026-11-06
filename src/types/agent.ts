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

