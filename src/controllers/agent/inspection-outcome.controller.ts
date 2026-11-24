export const INSPECTION_OUTCOMES = [
  { value: "confirmed", label: "Foco confirmado", group: "completed", icon: "check" },
  { value: "not_confirmed", label: "Foco não confirmado", group: "completed", icon: "info" },
  { value: "closed", label: "Imóvel fechado", group: "pending", icon: "alert" },
  { value: "refused", label: "Acesso recusado", group: "pending", icon: "alert" },
  { value: "return_required", label: "Retorno necessário", group: "pending", icon: "alert" },
] as const;

export type InspectionOutcome = (typeof INSPECTION_OUTCOMES)[number]["value"];
export type InspectionDraft = {
  outcome: InspectionOutcome | null;
  notes: string;
  // Dados registrados na T058 devem ser entregues ao fluxo na integração futura.
  condition?: string;
  actions?: string[];
  media?: { id: string; url: string }[];
};

export function isInspectionOutcome(value: unknown): value is InspectionOutcome {
  return INSPECTION_OUTCOMES.some((item) => item.value === value);
}

export function getInspectionOutcomeLabel(value: InspectionOutcome): string {
  return INSPECTION_OUTCOMES.find((item) => item.value === value)?.label ?? "Não informado";
}

export function inspectionDraftKey(occurrenceId: string): string {
  return `mapeia-t060-inspection:${occurrenceId}`;
}
