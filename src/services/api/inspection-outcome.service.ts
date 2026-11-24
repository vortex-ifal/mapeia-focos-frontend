import { buildApiUrl, getAuthHeaders } from "@/services/api/api.config";
import type { InspectionDraft, InspectionOutcome } from "@/controllers/agent/inspection-outcome.controller";

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

function getEndpoint(occurrenceId: string): string {
  return buildApiUrl(`occurrences/${encodeURIComponent(occurrenceId)}/inspections`);
}

async function readResponse(response: Response): Promise<InspectionApiResponse> {
  if (!response.ok) {
    if (response.status === 401) throw new Error("Sessão expirada. Entre novamente.");
    if (response.status === 403) throw new Error("A ocorrência não está atribuída a este agente.");
    if (response.status === 404) throw new Error("Ocorrência ou rascunho não encontrado.");
    if (response.status === 409) throw new Error("Esta ocorrência não está disponível para vistoria.");
    throw new Error(`Não foi possível processar a vistoria (HTTP ${response.status}).`);
  }
  return response.json() as Promise<InspectionApiResponse>;
}

export async function getInspectionDraft(occurrenceId: string): Promise<InspectionApiResponse | null> {
  const response = await fetch(`${getEndpoint(occurrenceId)}/draft`, {
    headers: getAuthHeaders({ Accept: "application/json" }),
    cache: "no-store",
  });
  if (response.status === 404) return null;
  return readResponse(response);
}

export async function saveInspectionDraft(
  occurrenceId: string,
  draft: InspectionDraft,
): Promise<InspectionApiResponse> {
  return readResponse(await fetch(`${getEndpoint(occurrenceId)}/draft`, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json", Accept: "application/json" }),
    body: JSON.stringify({
      condition: draft.condition.trim() || undefined,
      actionsTaken: draft.actionsTaken.trim() || undefined,
      notes: draft.notes.trim() || undefined,
    }),
  }));
}

export async function submitInspectionOutcome(
  occurrenceId: string,
  draft: InspectionDraft,
): Promise<InspectionApiResponse> {
  if (!draft.outcome) throw new Error("Selecione um desfecho antes de concluir.");
  if (!draft.condition.trim() || draft.condition.trim().length > 100 || !draft.actionsTaken.trim()) {
    throw new Error("Informe a condição encontrada (até 100 caracteres) e as ações realizadas.");
  }
  return readResponse(await fetch(getEndpoint(occurrenceId), {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json", Accept: "application/json" }),
    body: JSON.stringify({
      condition: draft.condition.trim(),
      actionsTaken: draft.actionsTaken.trim(),
      notes: draft.notes.trim(),
      result: draft.outcome,
    }),
  }));
}
