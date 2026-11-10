import { z } from "zod";

import { buildApiUrl } from "@/services/api/api.config";
import type { HeatMapResponse } from "@/types/heatmap";

const heatMapPointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const heatMapResponseSchema = z.object({
  total: z.number(),
  points: z.array(heatMapPointSchema),
});

export async function getHeatMapData(): Promise<HeatMapResponse> {
  const endpoint = buildApiUrl("occurrences/heatmap");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = "Não foi possível carregar os dados do mapa de calor.";

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : String(errorData.message);
      }
    } catch {
      // The response body may be empty or invalid JSON.
    }

    throw new Error(errorMessage);
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta inválida.");
  }

  const parsedResponse = heatMapResponseSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error(
      "A API retornou dados de mapa de calor em formato inesperado.",
    );
  }

  return parsedResponse.data;
}
