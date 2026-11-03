import type { OperationalPriority } from "@/types/operations";
import type {
  PriorityOccurrence,
  PriorityOccurrenceResponse,
} from "@/types/priority";

const priorityLabels: Record<OperationalPriority, string> = {
  low: "Prioridade baixa",
  medium: "Prioridade média",
  high: "Prioridade alta",
};

export function mapOccurrenceToPriority(
  occurrence: PriorityOccurrenceResponse,
): PriorityOccurrence {
  return {
    id: occurrence.id,
    protocol: occurrence.protocol,
    displayCode: `#${occurrence.protocol.toUpperCase()}`,
    address: occurrence.address,
    status: occurrence.status,
    priority: occurrence.priority,
  };
}

export function getPriorityLabel(priority: OperationalPriority): string {
  return priorityLabels[priority];
}

export function canDefineOccurrencePriority(
  occurrence: PriorityOccurrence,
): boolean {
  return occurrence.status.key === "accepted";
}

export function getPriorityStatusLabel(occurrence: PriorityOccurrence): string {
  if (occurrence.status.key === "accepted") {
    return "Validada";
  }

  return occurrence.status.name;
}