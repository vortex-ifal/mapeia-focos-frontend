import type {
  OccurrenceFormData,
  OccurrenceResponse,
} from "@/types/occurrence";

export async function createOccurrence(
  data: OccurrenceFormData,
): Promise<OccurrenceResponse> {
  const response = await fetch("/api/ocorrencias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      endereco: data.endereco,
      tipo_situacao: data.tipo_situacao,
      descricao: data.descricao,
      contato: data.contato || undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao registrar ocorrência.");
  }

  return response.json();
}