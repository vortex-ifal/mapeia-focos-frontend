export type InspectionDraft = {
  condition: string;
  actionsTaken: string;
  notes: string;
};

export type InspectionStep = "register" | "outcome_placeholder";

export type InspectionApiResponse = {
  id: string;
  occurrenceId: string;
  agentId: string;
  status: "draft" | "completed";
  condition: string | null;
  actionsTaken: string | null;
  notes: string | null;
  result: string | null;
  inspectedAt: string;
};
