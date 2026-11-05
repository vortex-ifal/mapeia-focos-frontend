import type { OperationalPriority } from "@/types/operations";
import type {
  OccurrenceListApiItem,
  OccurrenceListFilters,
  OccurrenceListItem,
} from "@/types/occurrences-list";

const STREET_PREFIXES = [
  "rua ",
  "avenida ",
  "av. ",
  "travessa ",
  "estrada ",
  "rodovia ",
  "alameda ",
  "praça ",
  "praca ",
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function looksLikeStreet(value: string): boolean {
  const normalizedValue = normalizeText(value);

  return STREET_PREFIXES.some((prefix) => normalizedValue.startsWith(prefix));
}

export function getOccurrenceRegion(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const explicitNeighborhood = parts.find((part) => /^bairro\s+/i.test(part));

  if (explicitNeighborhood) {
    return explicitNeighborhood.replace(/^bairro\s+/i, "");
  }

  if (parts.length === 0) {
    return "Região não informada";
  }

  if (parts.length >= 2 && looksLikeStreet(parts[0])) {
    const possibleRegion = parts.find(
      (part, index) =>
        index > 0 &&
        !/^\d+$/.test(part) &&
        !/^alagoas$/i.test(part) &&
        !/^arapiraca$/i.test(part),
    );

    return possibleRegion ?? "Região não informada";
  }

  if (parts.length >= 3 && !looksLikeStreet(parts[0])) {
    return parts[0];
  }

  return "Região não informada";
}

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

export function calculateElapsedMinutes(updatedAt: string): number {
  const updatedAtTimestamp = new Date(updatedAt).getTime();

  if (Number.isNaN(updatedAtTimestamp)) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - updatedAtTimestamp) / 60_000));
}

export function formatElapsedTime(elapsedMinutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(elapsedMinutes));

  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);

  const minutes = safeMinutes % 60;

  if (hours < 24) {
    return `${hours} h ${String(minutes).padStart(2, "0")}`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} d`;
  }

  return `${days} d ${remainingHours} h`;
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