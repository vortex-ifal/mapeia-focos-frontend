import { z } from "zod";

import { buildApiUrl, getAuthHeaders } from "@/services/api/api.config";
import type {
  InspectionApiResponse,
  InspectionDraft,
} from "@/types/inspection";

const inspectionApiResponseSchema = z.object({
  id: z.string(),
  occurrenceId: z.string(),
  agentId: z.string(),
  status: z.enum(["draft", "completed"]),
  condition: z.string().nullable(),
  actionsTaken: z.string().nullable(),
  notes: z.string().nullable(),
  result: z.string().nullable(),
  inspectedAt: z.string(),
});

function getDraftEndpoint(occurrenceId: string): string {
  const encodedId = encodeURIComponent(occurrenceId);
  return buildApiUrl(`occurrences/${encodedId}/inspections/draft`);
}

function getHeaders(includeJsonContentType = false): Record<string, string> {
  return getAuthHeaders({
    Accept: "application/json",
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
  });
}

async function getApiErrorMessage(response: Response): Promise<string> {
  if (response.status === 401) {
    return "Sessão expirada. Entre novamente para continuar.";
  }

  if (response.status === 403) {
    return "Esta ocorrência não está atribuída a este agente.";
  }

  if (response.status === 404) {
    return "Ocorrência ou rascunho de vistoria não encontrado.";
  }

  if (response.status === 409) {
    return "Esta ocorrência não está disponível para vistoria.";
  }

  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (body?.message) {
      return Array.isArray(body.message)
        ? body.message.join(", ")
        : String(body.message);
    }
  } catch {
    // Response body may be empty or non-JSON.
  }

  return `Não foi possível processar o rascunho da vistoria (HTTP ${response.status}).`;
}

async function parseInspectionResponse(
  response: Response,
): Promise<InspectionApiResponse> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta inválida para a vistoria.");
  }

  const parsed = inspectionApiResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(
      "A API retornou os dados da vistoria em formato inesperado.",
    );
  }

  return parsed.data;
}

/**
 * Fetches a previously saved inspection draft for the given occurrence.
 * Returns null when no draft exists yet (HTTP 404).
 */
export async function getInspectionDraft(
  occurrenceId: string,
): Promise<InspectionApiResponse | null> {
  let response: Response;
  try {
    response = await fetch(getDraftEndpoint(occurrenceId), {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
  } catch (networkError) {
    throw new Error(
      "Não foi possível conectar ao servidor para consultar o rascunho.",
      { cause: networkError },
    );
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return parseInspectionResponse(response);
}

/**
 * Saves or updates an inspection draft on the backend.
 */
export async function saveInspectionDraft(
  occurrenceId: string,
  draftData: InspectionDraft,
): Promise<InspectionApiResponse> {
  let response: Response;
  try {
    response = await fetch(getDraftEndpoint(occurrenceId), {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify({
        condition: draftData.condition.trim() || undefined,
        actionsTaken: draftData.actionsTaken.trim() || undefined,
        notes: draftData.notes.trim() || undefined,
      }),
    });
  } catch (networkError) {
    throw new Error(
      "Não foi possível conectar ao servidor para salvar o rascunho.",
      { cause: networkError },
    );
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return parseInspectionResponse(response);
}
