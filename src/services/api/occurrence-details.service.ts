import { z } from "zod";

import { buildApiUrl, getAuthHeaders } from "@/services/api/api.config";
import type {
  OccurrenceDetail,
  OccurrenceHistoryItem,
} from "@/types/occurrence-details";

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
  isArchived: z.boolean(),
  archivedAt: z.string().nullable(),
  assignedAgent: assignedAgentSchema,
  media: z.array(mediaSchema),
});

const occurrenceHistoryAuthorSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .nullable();

const occurrenceHistoryItemSchema = z.object({
  id: z.string(),
  eventKey: z.string(),
  eventDescription: z.string(),
  author: occurrenceHistoryAuthorSchema,
  createdAt: z.string(),
});

const occurrenceHistorySchema = z.array(occurrenceHistoryItemSchema);

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

export async function getOccurrenceHistory(
  occurrenceId: string,
): Promise<OccurrenceHistoryItem[]> {
  const endpoint = buildApiUrl(`occurrences/${occurrenceId}/history`);

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
        "Não foi possível carregar o histórico da ocorrência.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error(
      "A API retornou uma resposta inválida para o histórico da ocorrência.",
    );
  }

  const parsed = occurrenceHistorySchema.safeParse(responseData);

  if (!parsed.success) {
    throw new Error(
      "A API retornou o histórico da ocorrência em formato inesperado.",
    );
  }

  return parsed.data;
}