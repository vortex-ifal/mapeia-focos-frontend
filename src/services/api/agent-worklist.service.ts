import { z } from "zod";

import { buildApiUrl } from "@/services/api/api.config";
import type { AgentWorkOccurrenceApiItem } from "@/types/agent-priorities";

const operationalStatusSchema = z.object({
  key: z.string(),
  name: z.string(),
});

const operationalPrioritySchema = z.enum(["low", "medium", "high"]);

const agentOccurrenceSchema = z.object({
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
});

const agentWorklistSchema = z.array(agentOccurrenceSchema);

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

export async function getAgentWorklist(): Promise<
  AgentWorkOccurrenceApiItem[]
> {
  const endpoint = buildApiUrl("agents/occurrences");

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
        "Não foi possível carregar as prioridades do dia.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta inválida.");
  }

  const parsed = agentWorklistSchema.safeParse(responseData);

  if (!parsed.success) {
    throw new Error("A API retornou as prioridades em formato inesperado.");
  }

  return parsed.data;
}