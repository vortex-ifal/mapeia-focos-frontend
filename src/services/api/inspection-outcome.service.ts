import { buildApiUrl, getAuthHeaders } from "@/services/api/api.config";
import type { InspectionDraft } from "@/controllers/agent/inspection-outcome.controller";

/**
 * A rota real de criação/conclusão de vistoria ainda precisa ser confirmada
 * com o time de Back-end. Não usar endpoint inventado ou gravar status local.
 * O contrato/payload abaixo também deve ser validado antes de habilitar o POST.
 */
export async function submitInspectionOutcome(
  occurrenceId: string,
  draft: InspectionDraft,
): Promise<void> {
  const endpointTemplate = process.env.NEXT_PUBLIC_INSPECTION_SUBMIT_PATH;
  if (!endpointTemplate || !endpointTemplate.includes(":occurrenceId")) {
    throw new Error("Conclusão indisponível: contrato da API de vistorias pendente de integração com o Back-end.");
  }
  if (!draft.outcome) {
    throw new Error("Selecione um desfecho antes de concluir.");
  }
  if (!draft.condition || !draft.actions) {
    throw new Error("É necessário concluir o registro da vistoria (T058) antes de enviar.");
  }
  const endpoint = buildApiUrl(endpointTemplate.replace(":occurrenceId", encodeURIComponent(occurrenceId)).replace(/^\/+/, ""));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json", Accept: "application/json" }),
    body: JSON.stringify({
      outcome: draft.outcome,
      notes: draft.notes.trim(),
      condition: draft.condition,
      actions: draft.actions,
      mediaIds: (draft.media ?? []).map((item) => item.id),
    }),
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error("Sessão expirada. Entre novamente.");
    if (response.status === 403) throw new Error("Você não possui permissão para concluir esta vistoria.");
    throw new Error(`Não foi possível concluir a vistoria (HTTP ${response.status}). Tente novamente.`);
  }
}
