import { toast } from "react-toastify";

import type {
  FieldDayData,
  FieldDayNextPriority,
  FieldDayStats,
} from "@/types/agent";
import type { OccurrenceListApiItem } from "@/types/occurrences-list";

export const AGENT_OFFLINE_SURVEY_KEYS = [
  "mapeia_saved_inspection",
  "mapeia-agent-inspection-draft",
  "mapeia_offline_survey",
  "mapeia_inspection_draft",
] as const;

export function formatCardNumber(count: number): string {
  const safeCount = Math.max(0, Math.floor(count));
  return String(safeCount).padStart(2, "0");
}

export function calculateWaitingMinutes(createdAt: string): number {
  const createdAtTimestamp = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtTimestamp)) {
    return 0;
  }

  const elapsedMilliseconds = Date.now() - createdAtTimestamp;
  return Math.max(0, Math.floor(elapsedMilliseconds / 60_000));
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

export function extractNeighborhood(address: string): string {
  if (!address) {
    return "Centro";
  }

  const segments = address.split(/[,-]/).map((item) => item.trim());

  if (segments.length >= 2) {
    const candidate = segments[segments.length - 1];
    if (candidate && candidate.length > 2) {
      return candidate;
    }
  }

  return "Centro";
}

export function calculateFieldDayStats(
  occurrences: OccurrenceListApiItem[],
): FieldDayStats {
  const activeOccurrences = occurrences.filter(
    (item) => item.status.key !== "resolved" && item.status.key !== "rejected",
  );

  const highPriorityCount = activeOccurrences.filter(
    (item) => item.priority === "high",
  ).length;

  const indicatedInspectionsCount = activeOccurrences.filter(
    (item) =>
      item.status.key === "forwarded_for_inspection" ||
      item.status.name.toLowerCase().includes("vistoria") ||
      (item.situationType &&
        item.situationType.toLowerCase().includes("vistoria")),
  ).length;

  return {
    assignedActivitiesCount: activeOccurrences.length,
    highPriorityCount,
    indicatedInspectionsCount,
  };
}

export function resolveNextPriority(
  occurrences: OccurrenceListApiItem[],
): FieldDayNextPriority | null {
  const activeOccurrences = occurrences.filter(
    (item) => item.status.key !== "resolved" && item.status.key !== "rejected",
  );

  if (activeOccurrences.length === 0) {
    return null;
  }

  // Find high priority first, then medium, then low
  const highPriorityItems = activeOccurrences.filter(
    (item) => item.priority === "high",
  );

  const candidate =
    highPriorityItems.length > 0
      ? highPriorityItems.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )[0]
      : activeOccurrences[0];

  if (!candidate) {
    return null;
  }

  const displayCode = candidate.protocol.startsWith("#")
    ? candidate.protocol
    : `#${candidate.protocol.toUpperCase()}`;

  return {
    id: candidate.id,
    protocol: candidate.protocol,
    displayCode,
    statusName: candidate.status.name,
    neighborhood: extractNeighborhood(candidate.address),
    waitingMinutes: calculateWaitingMinutes(candidate.createdAt),
    nextAction: "vistoria",
    priority: candidate.priority,
  };
}

export const INITIAL_FIELD_DAY_STATS: FieldDayStats = {
  assignedActivitiesCount: 0,
  highPriorityCount: 0,
  indicatedInspectionsCount: 0,
};

export function mapOccurrencesToFieldDayData(
  occurrences: OccurrenceListApiItem[] | undefined,
): FieldDayData {
  if (!occurrences) {
    return {
      stats: INITIAL_FIELD_DAY_STATS,
      nextPriority: null,
    };
  }

  const stats = calculateFieldDayStats(occurrences);
  const nextPriority = resolveNextPriority(occurrences);

  return {
    stats,
    nextPriority,
  };
}

export function hasSavedOfflineSurvey(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    for (const key of AGENT_OFFLINE_SURVEY_KEYS) {
      if (localStorage.getItem(key) || sessionStorage.getItem(key)) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

export function getSavedOfflineSurveySnapshot(): string {
  return hasSavedOfflineSurvey() ? "saved" : "empty";
}

export function subscribeToSavedOfflineSurvey(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

export function handleViewDayPriorities(): void {
  toast.info("Em breve");
}

export function handleRegisterOccurrence(): void {
  toast.info("Em breve");
}

export function handleResumeSavedSurvey(): void {
  toast.info("Retomando vistoria salva...");
}
