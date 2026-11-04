import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type PriorityOccurrenceResponse = {
  id: string;
  protocol: string;
  address: string;
  status: OperationalStatus;
  priority: OperationalPriority | null;
};

export type PriorityOccurrence = {
  id: string;
  protocol: string;
  displayCode: string;
  address: string;
  status: OperationalStatus;
  priority: OperationalPriority | null;
};

export type UpdateOccurrencePriorityRequest = {
  priority: OperationalPriority;
};