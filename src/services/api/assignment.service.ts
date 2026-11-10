import { z } from "zod";

import { buildApiUrl } from "@/services/api/api.config";
import type {
  AssignmentAgentResponse,
  AssignmentOccurrenceResponse,
} from "@/types/assignment";

const operationalPrioritySchema = z.enum(["low", "medium", "high"]);

const operationalStatusSchema = z.object({
  key: z.string(),
  name: z.string(),
});

const occurrenceSchema = z.object({
  id: z.string(),
  protocol: z.string(),
  address: z.string(),
  status: operationalStatusSchema,
  priority: operationalPrioritySchema.nullable(),
});

const agentSchema = z.object({
  agentId: z.string(),
  name: z.string(),
  sectorRegion: z.string().nullable(),
  totalActiveTasks: z.number(),
});

const agentsSchema = z.array(agentSchema);

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

export async function getOccurrenceForAssignment(
  occurrenceId: string,
): Promise<AssignmentOccurrenceResponse> {
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

  const parsedResponse = occurrenceSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error(
      "A API retornou dados da ocorrência em formato inesperado.",
    );
  }

  return parsedResponse.data;
}

export async function getAgentsForAssignment(): Promise<
  AssignmentAgentResponse[]
> {
  const endpoint = buildApiUrl("users/agentes");

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
        "Não foi possível carregar os agentes disponíveis.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma lista de agentes inválida.");
  }

  const parsedResponse = agentsSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error("A API retornou os agentes em formato inesperado.");
  }

  return parsedResponse.data;
}

export async function assignOccurrenceToAgent(
  occurrenceId: string,
  agentId: string,
): Promise<void> {
  const endpoint = buildApiUrl(`occurrences/${occurrenceId}/assign`);

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agentId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível atribuir o agente à ocorrência.",
      ),
    );
  }
}