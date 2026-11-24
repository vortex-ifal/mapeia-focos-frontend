import { buildApiUrl, getAuthHeaders } from "@/services/api/api.config";
import type {
  InspectionDraft,
  InspectionOutcome,
} from "@/controllers/agent/inspection-outcome.controller";

export type InspectionApiResponse = {
  id: string;
  occurrenceId: string;
  agentId: string;
  status: "draft" | "completed";
  condition: string | null;
  actionsTaken: string | null;
  notes: string | null;
  result: InspectionOutcome | null;
  inspectedAt: string;
};

/**
 * Rotas oficiais da T058/T060 (Swagger):
 * GET/PUT  /api/occurrences/{id}/inspections/draft
 * GET/POST /api/occurrences/{id}/inspections
 *
 * buildApiUrl acrescenta /api e evita duplicá-lo quando já existe na base.
 */
function inspectionEndpoints(occurrenceId: string) {
  const inspections = buildApiUrl(
    `occurrences/${encodeURIComponent(occurrenceId)}/inspections`,
  );
  return {
    inspections,
    draft: `${inspections}/draft`,
  };
}

async function readError(response: Response): Promise<never> {
  if (response.status === 401) {
    throw new Error("Sessão expirada. Entre novamente.");
  }
  if (response.status === 403) {
    throw new Error("A ocorrência não está atribuída a este agente.");
  }
  if (response.status === 404) {
    throw new Error("Ocorrência ou vistoria não encontrada.");
  }
  if (response.status === 409) {
    throw new Error("Esta ocorrência não está disponível para vistoria.");
  }
  throw new Error(`Não foi possível processar a vistoria (HTTP ${response.status}).`);
}

function inspectionHeaders(json = false): Record<string, string> {
  return getAuthHeaders({
    Accept: "application/json",
    ...(json ? { "Content-Type": "application/json" } : {}),
  });
}

export async function getInspectionDraft(
  occurrenceId: string,
): Promise<InspectionApiResponse | null> {
  const response = await fetch(inspectionEndpoints(occurrenceId).draft, {
    method: "GET",
    headers: inspectionHeaders(),
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) return readError(response);
  return response.json() as Promise<InspectionApiResponse>;
}

export async function saveInspectionDraft(
  occurrenceId: string,
  draft: InspectionDraft,
): Promise<InspectionApiResponse> {
  const response = await fetch(inspectionEndpoints(occurrenceId).draft, {
    method: "PUT",
    headers: inspectionHeaders(true),
    body: JSON.stringify({
      condition: draft.condition.trim() || undefined,
      actionsTaken: draft.actionsTaken.trim() || undefined,
      notes: draft.notes.trim() || undefined,
    }),
  });
  if (!response.ok) return readError(response);
  return response.json() as Promise<InspectionApiResponse>;
}

export async function submitInspectionOutcome(
  occurrenceId: string,
  draft: InspectionDraft,
): Promise<InspectionApiResponse> {
  if (!draft.outcome) {
    throw new Error("Selecione um desfecho antes de concluir.");
  }
  if (
    !draft.condition.trim() ||
    draft.condition.trim().length > 100 ||
    !draft.actionsTaken.trim()
  ) {
    throw new Error(
      "Informe a condição encontrada (até 100 caracteres) e as ações realizadas.",
    );
  }

  const response = await fetch(inspectionEndpoints(occurrenceId).inspections, {
    method: "POST",
    headers: inspectionHeaders(true),
    body: JSON.stringify({
      condition: draft.condition.trim(),
      actionsTaken: draft.actionsTaken.trim(),
      notes: draft.notes.trim(),
      result: draft.outcome,
    }),
  });
  if (!response.ok) return readError(response);
  return response.json() as Promise<InspectionApiResponse>;
}

/** Lista as vistorias já registradas para uma ocorrência. */
export async function listOccurrenceInspections(
  occurrenceId: string,
): Promise<InspectionApiResponse[]> {
  const response = await fetch(inspectionEndpoints(occurrenceId).inspections, {
    method: "GET",
    headers: inspectionHeaders(),
    cache: "no-store",
  });
  if (!response.ok) return readError(response);
  return response.json() as Promise<InspectionApiResponse[]>;
}
