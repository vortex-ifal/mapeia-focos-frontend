import type {
  OperationalOccurrence,
  TriageQueueResponse,
} from "@/types/operations";

function calculateWaitingMinutes(createdAt: string): number {
  const createdAtTimestamp = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtTimestamp)) {
    return 0;
  }

  const elapsedMilliseconds = Date.now() - createdAtTimestamp;

  return Math.max(0, Math.floor(elapsedMilliseconds / 60_000));
}

export function mapTriageQueueToOperationalOccurrences(
  response: TriageQueueResponse,
): OperationalOccurrence[] {
  return response.data.map((item) => ({
    id: item.id,
    protocol: item.protocol,
    displayCode: `#${item.protocol.toUpperCase()}`,
    address: item.address,
    neighborhood: null,
    locationContext: null,
    latitude: item.latitude,
    longitude: item.longitude,
    createdAt: item.createdAt,
    waitingMinutes: calculateWaitingMinutes(item.createdAt),
    nextAction: null,
    priority: item.priority,
    status: item.status,
    mapPosition: null,
    evidence: [],
  }));
}

export function getInitialSelectedOccurrenceId(
  occurrences: OperationalOccurrence[],
): string | null {
  return occurrences[0]?.id ?? null;
}

export function getOperationalOccurrenceById(
  occurrences: OperationalOccurrence[],
  occurrenceId: string | null,
): OperationalOccurrence | null {
  if (!occurrenceId) {
    return null;
  }

  return (
    occurrences.find((occurrence) => occurrence.id === occurrenceId) ?? null
  );
}

export function formatWaitingTime(waitingMinutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(waitingMinutes));

  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);

  const minutes = safeMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${String(minutes).padStart(2, "0")}`;
}

export function getHumanTriagePath(occurrenceId: string): string {
  return `/central-operacional/triagem?occurrenceId=${encodeURIComponent(
    occurrenceId,
  )}`;
}