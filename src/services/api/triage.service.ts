import { z } from "zod";

import { buildApiUrl } from "@/services/api/api.config";
import type {
  ModerationStatusKey,
  OccurrenceListItemResponse,
  TerritorialContextResponse,
} from "@/types/triage";

const operationalStatusSchema = z.object({
  key: z.string(),
  name: z.string(),
});

const operationalPrioritySchema = z.enum(["low", "medium", "high"]);

const mediaSchema = z.object({
  id: z.string(),
  mimeType: z.string(),
  fileSizeBytes: z.number(),
  type: z.string(),
  uploadedAt: z.string(),
});

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
  media: z.array(mediaSchema),
});

const nearbyOccurrenceSchema = z.object({
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  distanceMeters: z.number(),
  status: operationalStatusSchema,
  createdAt: z.string(),
});

const territorialContextSchema = z.object({
  radiusMeters: z.number(),
  total: z.number(),
  items: z.array(nearbyOccurrenceSchema),
});

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const errorData = await response.json();

    if (errorData?.message) {
      return Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : String(errorData.message);
    }
  } catch {
    // The response body may be empty or invalid JSON.
  }

  return fallbackMessage;
}

export async function getOccurrenceForTriage(
  occurrenceId: string,
): Promise<OccurrenceListItemResponse> {
  const endpoint = buildApiUrl(`occurrences/${occurrenceId}`);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar a ocorrência.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta inválida.");
  }

  const parsedResponse = occurrenceDetailSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error(
      "A API retornou dados de ocorrência em formato inesperado.",
    );
  }

  return parsedResponse.data;
}

export async function getTerritorialContext(
  occurrenceId: string,
  radius = 500,
  limit = 50,
): Promise<TerritorialContextResponse> {
  const searchParams = new URLSearchParams({
    radius: String(radius),
    limit: String(limit),
  });

  const endpoint = `${buildApiUrl(
    `occurrences/${occurrenceId}/territorial-context`,
  )}?${searchParams.toString()}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar o contexto territorial.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou um contexto territorial inválido.");
  }

  const parsedResponse = territorialContextSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error("A API retornou dados territoriais em formato inesperado.");
  }

  return parsedResponse.data;
}

export async function updateOccurrenceStatus(
  occurrenceId: string,
  statusKey: ModerationStatusKey,
): Promise<void> {
  const endpoint = buildApiUrl(`occurrences/${occurrenceId}/status`);

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      statusKey,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        statusKey === "accepted"
          ? "Não foi possível validar a ocorrência."
          : "Não foi possível sinalizar a ocorrência.",
      ),
    );
  }
}