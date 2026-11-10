import { toast } from "react-toastify";

import { getOccurrenceRegion } from "@/utils/occurrence.utils";
import type {
  AgentDashboardApiResponse,
  AgentDashboardNextPriorityResponse,
  FieldDayData,
  FieldDayNextPriority,
  FieldDayStats,
} from "@/types/agent";
import type { OperationalPriority } from "@/types/operations";

export const AGENT_OFFLINE_SURVEY_KEYS = [
  "mapeia_saved_inspection",
  "mapeia-agent-inspection-draft",
  "mapeia_offline_survey",
  "mapeia_inspection_draft",
] as const;

export const AGENT_OFFLINE_SURVEY_EVENT = "mapeia-offline-survey-change";

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
  return getOccurrenceRegion(address);
}

export type PriorityPresentation = {
  label: string | null;
  badgeClassName: string;
  cardClassName: string;
};

export function getPriorityPresentation(
  priority: OperationalPriority | null,
): PriorityPresentation {
  switch (priority) {
    case "high":
      return {
        label: "Prioridade alta",
        badgeClassName: "bg-[#FAEBC8] text-[#171717]",
        cardClassName: "border-2 border-[#C94F32] bg-[#FAEBC8]",
      };
    case "medium":
      return {
        label: "Prioridade média",
        badgeClassName: "bg-[#FEF3C7] text-[#92400E]",
        cardClassName: "border-2 border-[#D97706] bg-[#FFFBEB]",
      };
    case "low":
      return {
        label: "Prioridade baixa",
        badgeClassName: "bg-[#E5E7EB] text-[#374151]",
        cardClassName: "border border-[#D1D5DB] bg-white",
      };
    default:
      return {
        label: null,
        badgeClassName: "",
        cardClassName: "border border-[#E9E0D4] bg-white",
      };
  }
}

export function mapDashboardNextPriority(
  rawNextPriority: AgentDashboardNextPriorityResponse | null | undefined,
): FieldDayNextPriority | null {
  if (!rawNextPriority) {
    return null;
  }

  const displayCode =
    rawNextPriority.displayCode ??
    (rawNextPriority.protocol.startsWith("#")
      ? rawNextPriority.protocol
      : `#${rawNextPriority.protocol.toUpperCase()}`);

  const statusName =
    rawNextPriority.statusName ??
    (typeof rawNextPriority.status === "object" && rawNextPriority.status !== null
      ? rawNextPriority.status.name
      : typeof rawNextPriority.status === "string"
        ? rawNextPriority.status
        : "Validada");

  const neighborhood =
    rawNextPriority.neighborhood && rawNextPriority.neighborhood.trim() !== ""
      ? rawNextPriority.neighborhood.trim()
      : rawNextPriority.address
        ? getOccurrenceRegion(rawNextPriority.address)
        : "Região não informada";

  const waitingMinutes =
    typeof rawNextPriority.waitingMinutes === "number"
      ? rawNextPriority.waitingMinutes
      : rawNextPriority.createdAt
        ? calculateWaitingMinutes(rawNextPriority.createdAt)
        : 0;

  return {
    id: rawNextPriority.id,
    protocol: rawNextPriority.protocol,
    displayCode,
    statusName,
    neighborhood,
    waitingMinutes,
    nextAction: rawNextPriority.nextAction ?? "vistoria",
    priority: rawNextPriority.priority ?? null,
  };
}

export const INITIAL_FIELD_DAY_STATS: FieldDayStats = {
  assignedActivitiesCount: 0,
  highPriorityCount: 0,
  indicatedInspectionsCount: 0,
};

export function mapDashboardResponseToFieldDayData(
  response: AgentDashboardApiResponse | undefined,
): FieldDayData {
  if (!response) {
    return {
      stats: INITIAL_FIELD_DAY_STATS,
      nextPriority: null,
    };
  }

  return {
    stats: {
      assignedActivitiesCount: response.totalAssigned,
      highPriorityCount: response.totalHighPriority,
      indicatedInspectionsCount: response.totalInspections,
    },
    nextPriority: mapDashboardNextPriority(response.nextPriority),
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

export function notifyOfflineSurveyChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AGENT_OFFLINE_SURVEY_EVENT));
  }
}

export function subscribeToSavedOfflineSurvey(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(AGENT_OFFLINE_SURVEY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AGENT_OFFLINE_SURVEY_EVENT, callback);
  };
}

export function saveOfflineSurveyDraft(key: string, data: unknown): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const serialized =
      typeof data === "string" ? data : JSON.stringify(data);
    sessionStorage.setItem(key, serialized);
    notifyOfflineSurveyChanged();
  } catch {
    // Ignore storage quota errors
  }
}

export function clearOfflineSurveyDraft(key?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (key) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } else {
      for (const k of AGENT_OFFLINE_SURVEY_KEYS) {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      }
    }
    notifyOfflineSurveyChanged();
  } catch {
    // Ignore storage errors
  }
}

export function handleViewDayPriorities(): void {
  toast.info("Em breve");
}

export function handleResumeSavedSurvey(): void {
  toast.info("Retomando vistoria salva...");
}
