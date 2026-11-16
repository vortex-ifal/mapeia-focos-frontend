import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type AssignmentOccurrenceResponse = {
  id: string;
  protocol: string;
  address: string;
  status: OperationalStatus;
  priority: OperationalPriority | null;
};

export type AssignmentAgentResponse = {
  agentId: string;
  name: string;
  sectorRegion: string | null;
  totalActiveTasks: number;
};

export type AssignmentOccurrence = {
  id: string;
  protocol: string;
  displayCode: string;
  address: string;
  region: string;
  priority: OperationalPriority | null;
  priorityLabel: string;
  status: OperationalStatus;
};

export type AssignmentAgent = {
  id: string;
  name: string;
  region: string;
  activeTasks: number;
};

export type AssignmentSuccess = {
  agent: AssignmentAgent;
  assignedAt: number;
};