import { operationalOccurrencesFixture } from "@/components/manager/operations/operations.fixture";
import type { OperationalOccurrence } from "@/types/operations";

export function getOperationalOccurrences(): OperationalOccurrence[] {
  return operationalOccurrencesFixture.map((occurrence) => ({
    ...occurrence,
    mapPosition: { ...occurrence.mapPosition },
    evidence: [...occurrence.evidence],
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