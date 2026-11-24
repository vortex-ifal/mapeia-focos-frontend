import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type OccurrenceDetailMedia = {
  id: string;
  url: string;
  type: string;
};

export type OccurrenceDetailAssignedAgent = {
  id: string;
  name: string;
};

export type OccurrenceHistoryAuthor = {
  id: string;
  name: string;
};

export type OccurrenceHistoryItem = {
  id: string;
  eventKey: string;
  eventDescription: string;
  author: OccurrenceHistoryAuthor | null;
  createdAt: string;
};

export type OccurrenceDetail = {
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
  assignedAgent: OccurrenceDetailAssignedAgent | null;
  media: OccurrenceDetailMedia[];
};
