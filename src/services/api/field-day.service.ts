import { z } from "zod";

import { buildApiUrl } from "@/services/api/api.config";
import type { AgentDashboardApiResponse } from "@/types/agent";

const dashboardNextPrioritySchema = z.object({
  id: z.string(),
  protocol: z.string(),
  displayCode: z.string().optional(),
  address: z.string().optional().default(""),
  neighborhood: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  waitingMinutes: z.number().optional(),
  nextAction: z.string().nullable().optional(),
  status: z
    .union([
      z.object({
        key: z.string(),
        name: z.string(),
      }),
      z.string(),
    ])
    .optional(),
  statusName: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).nullable().optional(),
});

export const agentDashboardResponseSchema = z.object({
  totalAssigned: z.number(),
  totalHighPriority: z.number(),
  totalInspections: z.number(),
  nextPriority: dashboardNextPrioritySchema.nullable(),
});

// Contingency fixture for offline development / testing (AGENTS.md Rule 11)
export const FIELD_DAY_FIXTURE: AgentDashboardApiResponse = {
  totalAssigned: 4,
  totalHighPriority: 1,
  totalInspections: 1,
  nextPriority: {
    id: "fixture-0248",
    protocol: "MF-0248",
    displayCode: "#MF-0248",
    statusName: "Validada",
    address: "Rua do Comércio, 120, Centro",
    neighborhood: "Centro",
    waitingMinutes: 18,
    nextAction: "vistoria",
    priority: "high",
  },
};

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

export async function getAgentDashboard(): Promise<AgentDashboardApiResponse> {
  const endpoint = buildApiUrl("agents/dashboard");

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
        "Não foi possível carregar as atividades do dia do agente.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta inválida.");
  }

  const parsed = agentDashboardResponseSchema.safeParse(responseData);

  if (!parsed.success) {
    throw new Error(
      "A API retornou as atividades do agente em formato inesperado.",
    );
  }

  return parsed.data as AgentDashboardApiResponse;
}
