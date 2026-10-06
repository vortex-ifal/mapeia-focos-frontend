import type {
  OccurrenceFormData,
  OccurrenceResponse,
  OccurrenceBackendPayload,
} from "@/types/occurrence";

export async function createOccurrence(
  data: OccurrenceFormData,
): Promise<OccurrenceResponse> {
  const contactParts: string[] = [];
  if (data.nome?.trim()) contactParts.push(`Nome: ${data.nome.trim()}`);
  if (data.email?.trim()) contactParts.push(`E-mail: ${data.email.trim()}`);
  if (data.telefone?.trim()) contactParts.push(`Telefone: ${data.telefone.trim()}`);

  const payload: OccurrenceBackendPayload = {
    address: data.endereco,
    description: data.descricao,
    situation_type: data.tipo_situacao || undefined,
    contact: contactParts.length > 0 ? contactParts.join(" | ") : undefined,
  };

  const apiBaseUrl = (
    process.env.NEXT_PUBLIC_API_URL || ""
  ).replace(/\/+$/, "");

  const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/occurrences` : "/api/occurrences";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Erro ao registrar ocorrência.";
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : String(errorData.message);
      }
    } catch {
      // response body was empty or not valid JSON
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data ?? {};
  } catch {
    return {};
  }
}