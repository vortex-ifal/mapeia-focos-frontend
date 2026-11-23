import { z } from "zod";

import { buildApiUrl, getAuthHeaders } from "@/services/api/api.config";
import type { OccurrenceDetail } from "@/types/occurrence-details";

const operationalStatusSchema = z.object({
  key: z.string(),
  name: z.string(),
});

const operationalPrioritySchema = z.enum(["low", "medium", "high"]);

const mediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  type: z.string(),
});

const assignedAgentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .nullable();

const occurrenceDetailSchema = z.object({
  id: z.string(),
  protocol: z.string(),
  address: z.string(),
  description: z.string(),
  situationType: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: operationalStatusSchema,
  priority: operationalPrioritySchema.nullable(),
  assignedAgent: assignedAgentSchema,
  media: z.array(mediaSchema),
});

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const data = await response.json();

    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message.join(", ")
        : String(data.message);
    }
  } catch {
    // The response body may be empty or invalid JSON.
  }

  return fallbackMessage;
}

export async function getOccurrenceDetails(
  occurrenceId: string,
): Promise<OccurrenceDetail> {
  const endpoint = buildApiUrl(`occurrences/${occurrenceId}`);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: getAuthHeaders({
      Accept: "application/json",
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar os detalhes da ocorrência.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta inválida.");
  }

  const parsed = occurrenceDetailSchema.safeParse(responseData);

  if (!parsed.success) {
    throw new Error(
      "A API retornou os detalhes da ocorrência em formato inesperado.",
    );
  }

  return parsed.data;
}