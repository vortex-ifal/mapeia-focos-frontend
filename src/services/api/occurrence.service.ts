import type {
  OccurrenceFormData,
  OccurrenceResponse,
  OccurrenceBackendPayload,
} from "@/types/occurrence";

import { buildApiUrl } from "./api.config";

export async function createOccurrence(
  data: OccurrenceFormData,
): Promise<OccurrenceResponse> {
  const payload: OccurrenceBackendPayload = {
    address: data.address,
    description: data.description,
    situationType: data.situationType || undefined,
    latitude: data.latitude,
    longitude: data.longitude,
  };

  const endpoint = buildApiUrl("occurrences");

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