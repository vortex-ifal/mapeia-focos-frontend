import { getAuthSession } from "@/controllers/auth.controller";
import type {
  InspectionApiResponse,
  InspectionDraft,
} from "@/types/inspection";
import { getOccurrenceRegion } from "@/utils/occurrence.utils";

export const INSPECTION_CONDITION_OPTIONS = [
  "Recipientes com água parada",
  "Água acumulada em terreno",
  "Reservatório destampado",
  "Foco com larvas visíveis",
  "Sem foco aparente no local",
  "Imóvel fechado ou sem acesso",
] as const;

export function getEmptyInspectionDraft(): InspectionDraft {
  return {
    condition: "",
    actionsTaken: "",
    notes: "",
  };
}

export function getAgentInspectionPath(occurrenceId: string): string {
  return `/dia-em-campo/ocorrencias/${encodeURIComponent(occurrenceId)}/vistoria`;
}

function normalizeProtocolCode(protocol: string | null | undefined): string {
  if (!protocol) {
    return "";
  }

  return protocol.trim().replace(/^#+/, "").toUpperCase();
}

export function formatInspectionHeaderTitle(
  protocol: string | null | undefined,
): string {
  const cleanProtocol = normalizeProtocolCode(protocol);
  if (!cleanProtocol) {
    return "Vistoria";
  }

  return `Vistoria #${cleanProtocol}`;
}

export function formatInspectionSummaryContext(occurrence: {
  address: string;
  protocol: string;
}): string {
  const rawRegion = getOccurrenceRegion(occurrence.address.trim());
  const hasValidRegion =
    Boolean(rawRegion) && rawRegion !== "Região não informada";
  const cleanProtocol = normalizeProtocolCode(occurrence.protocol);

  if (hasValidRegion && cleanProtocol) {
    return `${rawRegion} · ocorrência #${cleanProtocol}`;
  }

  if (cleanProtocol) {
    return `Ocorrência #${cleanProtocol}`;
  }

  if (hasValidRegion) {
    return rawRegion;
  }

  return "Localização da ocorrência";
}

export function getInspectionDraftStorageKey(occurrenceId: string): string {
  const agentId = getAuthSession()?.id?.trim() || "anonymous";
  return `mapeia-inspection-draft:${agentId}:${occurrenceId}`;
}

/**
 * Reads the locally saved draft from sessionStorage.
 * Returns null when no local draft has been stored yet, preserving
 * intentionally cleared empty strings when a draft record already exists.
 */
export function getLocalInspectionDraft(
  occurrenceId: string,
): InspectionDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(getInspectionDraftStorageKey(occurrenceId));
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const record = parsed as Partial<InspectionDraft>;

    return {
      condition: typeof record.condition === "string" ? record.condition : "",
      actionsTaken:
        typeof record.actionsTaken === "string" ? record.actionsTaken : "",
      notes: typeof record.notes === "string" ? record.notes : "",
    };
  } catch {
    return null;
  }
}

export function saveLocalInspectionDraft(
  occurrenceId: string,
  draft: InspectionDraft,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(
      getInspectionDraftStorageKey(occurrenceId),
      JSON.stringify(draft),
    );
  } catch {
    // Ignore storage quota errors in restricted browser environments.
  }
}

export function clearLocalInspectionDraft(occurrenceId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(getInspectionDraftStorageKey(occurrenceId));
  } catch {
    // Ignore storage removal errors.
  }
}

/**
 * Merges the remote draft only when there is no local draft record yet,
 * so fields explicitly cleared to "" locally are never overwritten.
 */
export function mergeRemoteWithLocalDraft(
  localDraft: InspectionDraft | null,
  remoteDraft: InspectionApiResponse | null,
): InspectionDraft {
  if (localDraft !== null) {
    return localDraft;
  }

  if (!remoteDraft) {
    return getEmptyInspectionDraft();
  }

  return {
    condition: remoteDraft.condition ?? "",
    actionsTaken: remoteDraft.actionsTaken ?? "",
    notes: remoteDraft.notes ?? "",
  };
}
