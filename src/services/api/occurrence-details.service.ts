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
  situationType: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: operationalStatusSchema,
  priority: operationalPrioritySchema.nullable().optional(),
  assignedAgent: assignedAgentSchema.optional(),
  media: z.array(mediaSchema).nullish().transform((val) => val ?? []),
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

// TODO(T056): Replace this contingency fixture with real API responses once the backend service is integrated across all environments.
export const OCCURRENCE_DETAIL_FIXTURE: OccurrenceDetail = {
  id: "fixture-0248",
  protocol: "MF-0248",
  address: "Rua das Mangueiras, 128",
  description: "terreno ao lado da praça",
  situationType: "Foco em terreno baldio",
  latitude: -9.7515,
  longitude: -36.66,
  createdAt: "2026-11-20T10:00:00.000Z",
  updatedAt: "2026-11-22T14:30:00.000Z",
  status: {
    key: "accepted",
    name: "Validada",
  },
  priority: "high",
  assignedAgent: {
    id: "agent-1",
    name: "Agente Silva",
  },
  media: [
    {
      id: "media-1",
      url: "",
      type: "image",
    },
    {
      id: "media-2",
      url: "",
      type: "image",
    },
    {
      id: "media-3",
      url: "",
      type: "image",
    },
  ],
};

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

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "GET",
      headers: getAuthHeaders({
        Accept: "application/json",
      }),
    });
  } catch (networkError) {
    if (occurrenceId === "fixture-0248" || occurrenceId === "MF-0248") {
      return OCCURRENCE_DETAIL_FIXTURE;
    }
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      { cause: networkError },
    );
  }

  if (!response.ok) {
    if (
      (occurrenceId === "fixture-0248" || occurrenceId === "MF-0248") &&
      response.status === 404
    ) {
      return OCCURRENCE_DETAIL_FIXTURE;
    }

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

  return {
    ...parsed.data,
    situationType: parsed.data.situationType ?? null,
    latitude: parsed.data.latitude ?? null,
    longitude: parsed.data.longitude ?? null,
    priority: parsed.data.priority ?? null,
    assignedAgent: parsed.data.assignedAgent ?? null,
  };
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
