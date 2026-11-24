export const INSPECTION_OUTCOMES = [
  { value: "focus_eliminated", label: "Foco eliminado", group: "completed", icon: "check" },
  { value: "larvicide_applied", label: "Larvicida aplicado", group: "completed", icon: "check" },
  { value: "property_closed", label: "Imóvel fechado", group: "pending", icon: "alert" },
  { value: "resident_refused", label: "Acesso recusado", group: "pending", icon: "alert" },
  { value: "abandoned_property", label: "Imóvel abandonado", group: "pending", icon: "alert" },
] as const;

export type InspectionOutcome = (typeof INSPECTION_OUTCOMES)[number]["value"];
export type InspectionDraft = {
  outcome: InspectionOutcome | null;
  notes: string;
  condition: string;
  actionsTaken: string;
  media?: { id: string; url: string }[];
};

export function isInspectionOutcome(value: unknown): value is InspectionOutcome {
  return INSPECTION_OUTCOMES.some((item) => item.value === value);
}

export function getInspectionOutcomeLabel(value: InspectionOutcome): string {
  return INSPECTION_OUTCOMES.find((item) => item.value === value)?.label ?? "Não informado";
}

export function inspectionDraftKey(occurrenceId: string, agentId: string): string {
  return `mapeia-t060-inspection:${agentId}:${occurrenceId}`;
}
