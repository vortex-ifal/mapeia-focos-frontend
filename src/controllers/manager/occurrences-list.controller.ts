import type { OperationalPriority } from "@/types/operations";
import type {
  OccurrenceListApiItem,
  OccurrenceListFilters,
  OccurrenceListItem,
} from "@/types/occurrences-list";
import {
  calculateElapsedMinutes,
  getOccurrenceRegion,
  normalizeText,
} from "@/utils/occurrence.utils";

export function getOccurrenceStatusLabel(
  statusKey: string,
  statusName: string,
): string {
  if (statusKey === "registered") {
    return "Nova";
  }

  if (statusKey === "accepted") {
    return "Validada";
  }

  return statusName;
}

export function mapOccurrenceToListItem(
  occurrence: OccurrenceListApiItem,
): OccurrenceListItem {
  return {
    id: occurrence.id,
    protocol: occurrence.protocol,
    displayCode: `#${occurrence.protocol.toUpperCase()}`,
    address: occurrence.address,
    description: occurrence.description,
    situationType: occurrence.situationType,
    region: getOccurrenceRegion(occurrence.address),
    status: occurrence.status,
    statusLabel: getOccurrenceStatusLabel(
      occurrence.status.key,
      occurrence.status.name,
    ),
    priority: occurrence.priority,
    createdAt: occurrence.createdAt,
    updatedAt: occurrence.updatedAt,
    elapsedMinutes: calculateElapsedMinutes(occurrence.updatedAt),
  };
}

export function filterOccurrences(
  occurrences: OccurrenceListItem[],
  filters: OccurrenceListFilters,
): OccurrenceListItem[] {
  const normalizedQuery = normalizeText(filters.query);

  return occurrences.filter((occurrence) => {
    if (normalizedQuery) {
      const searchableValues = [
        occurrence.protocol,
        occurrence.displayCode,
        occurrence.address,
        occurrence.region,
        occurrence.description,
        occurrence.situationType ?? "",
      ]
        .map(normalizeText)
        .join(" ");

      if (!searchableValues.includes(normalizedQuery)) {
        return false;
      }
    }

    if (filters.statusKey && occurrence.status.key !== filters.statusKey) {
      return false;
    }

    if (filters.region && occurrence.region !== filters.region) {
      return false;
    }

    if (filters.priority && occurrence.priority !== filters.priority) {
      return false;
    }

    return true;
  });
}

export function getOccurrenceRegions(
  occurrences: OccurrenceListItem[],
): string[] {
  return Array.from(
    new Set(
      occurrences
        .map((occurrence) => occurrence.region)
        .filter((region) => region !== "Região não informada"),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function getOccurrenceDetailsPath(occurrenceId: string): string {
  return `/central-operacional/ocorrencias/${encodeURIComponent(occurrenceId)}`;
}

export const priorityLabels: Record<OperationalPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};