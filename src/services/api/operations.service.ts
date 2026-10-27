import { z } from "zod";

import type { TriageQueueResponse } from "@/types/operations";

import { buildApiUrl } from "./api.config";

const operationalStatusSchema = z.object({
  key: z.string(),
  name: z.string(),
});

const triageQueueItemSchema = z.object({
  id: z.string(),
  protocol: z.string(),
  address: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  createdAt: z.string(),
  waitingMinutes: z.number(),
  status: operationalStatusSchema,
});

const triageQueueResponseSchema = z.object({
  data: z.array(triageQueueItemSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

type GetTriageQueueParams = {
  page?: number;
  pageSize?: number;
};

export async function getTriageQueue({
  page = 1,
  pageSize = 50,
}: GetTriageQueueParams = {}): Promise<TriageQueueResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    statusKey: "registered",
  });

  const endpoint = `${buildApiUrl("occurrences")}?${searchParams.toString()}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = "Não foi possível carregar a fila operacional.";

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

  const parsedResponse = triageQueueResponseSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error("A API retornou dados de triagem em formato inesperado.");
  }

  return parsedResponse.data;
}
