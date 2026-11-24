import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";
import { getOccurrenceRegion } from "@/utils/occurrence.utils";

const priorityLabels: Record<OperationalPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const statusLabels: Record<string, string> = {
  registered: "Nova",
  under_review: "Em análise",
  rejected: "Reprovada",
  accepted: "Validada",
  forwarded_for_inspection: "Encaminhada para vistoria",
  resolved: "Resolvida",
};

export function getOccurrenceStatusLabel(status: OperationalStatus): string {
  return statusLabels[status.key] ?? status.name;
}

export function getOccurrencePriorityLabel(
  priority: OperationalPriority | null,
): string {
  if (!priority) {
    return "Não definida";
  }

  return priorityLabels[priority];
}

export function getLocationContext(
  address: string,
  latitude: number | null,
  longitude: number | null,
): string {
  const region = getOccurrenceRegion(address);

  if (latitude !== null && longitude !== null) {
    return `${region} · localização disponível`;
  }

  return region;
}

export function isOccurrenceClosed(status: OperationalStatus): boolean {
  return status.key === "resolved" || status.key === "rejected";
}

export function canManageOccurrencePriority(
  status: OperationalStatus,
): boolean {
  return status.key === "accepted";
}

export function canAssignOccurrenceAgent(
  status: OperationalStatus,
  priority: OperationalPriority | null,
): boolean {
  return status.key === "accepted" && priority !== null;
}

export function needsOccurrenceTriage(status: OperationalStatus): boolean {
  return status.key === "registered" || status.key === "under_review";
}

export function getOccurrencePriorityPath(occurrenceId: string): string {
  return `/central-operacional/prioridade?occurrenceId=${encodeURIComponent(
    occurrenceId,
  )}`;
}

export function getOccurrenceAssignmentPath(occurrenceId: string): string {
  return `/central-operacional/atribuicao?occurrenceId=${encodeURIComponent(
    occurrenceId,
  )}`;
}

export function getOccurrenceTriagePath(occurrenceId: string): string {
  return `/central-operacional/triagem?occurrenceId=${encodeURIComponent(
    occurrenceId,
  )}`;
}