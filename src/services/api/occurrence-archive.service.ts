import { buildApiUrl, getAuthHeaders } from "@/services/api/api.config";

export type OccurrenceArchiveAction = "archive" | "restore";

export async function updateOccurrenceArchive(
  occurrenceId: string,
  action: OccurrenceArchiveAction,
): Promise<void> {
  const endpoint = buildApiUrl(
    `occurrences/${encodeURIComponent(occurrenceId)}/${action}`,
  );

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "PATCH",
      headers: getAuthHeaders({ Accept: "application/json" }),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }

  if (response.ok) return; // Backend returns 204 No Content.

  let serverMessage = "";
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "message" in body) {
      const message = body.message;
      serverMessage = Array.isArray(message)
        ? message.map(String).join(", ")
        : typeof message === "string" ? message : "";
    }
  } catch {
    // Some error responses have no JSON payload.
  }

  if (response.status === 401) {
    throw new Error("Sua sessão expirou. Entre novamente para continuar.");
  }
  if (response.status === 403) {
    throw new Error("Somente gestores podem realizar esta ação.");
  }
  if (response.status === 404) {
    throw new Error("Ocorrência não encontrada ou indisponível.");
  }
  if (response.status === 409 || response.status === 422) {
    throw new Error(serverMessage || "Esta ocorrência não permite essa operação no estado atual.");
  }
  throw new Error(serverMessage || "Não foi possível atualizar o arquivamento.");
}
