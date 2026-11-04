import { z } from "zod";

import { buildApiUrl } from "@/services/api/api.config";
import type { OperationalPriority } from "@/types/operations";
import type { PriorityOccurrenceResponse } from "@/types/priority";

const prioritySchema = z.enum(["low", "medium", "high"]);

const operationalStatusSchema = z.object({
  key: z.string(),
  name: z.string(),
});

const priorityOccurrenceSchema = z.object({
  id: z.string(),
  protocol: z.string(),
  address: z.string(),
  status: operationalStatusSchema,
  priority: prioritySchema.nullable(),
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

export async function getOccurrenceForPriority(
  occurrenceId: string,
): Promise<PriorityOccurrenceResponse> {
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

  const parsedResponse = priorityOccurrenceSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error(
      "A API retornou dados da ocorrência em formato inesperado.",
    );
  }

  return parsedResponse.data;
}

export async function updateOccurrencePriority(
  occurrenceId: string,
  priority: OperationalPriority,
): Promise<void> {
  const endpoint = buildApiUrl(`occurrences/${occurrenceId}/priority`);

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      priority,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível definir a prioridade da ocorrência.",
      ),
    );
  }
}