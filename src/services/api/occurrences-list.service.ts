import { z } from "zod";

import { buildApiUrl } from "@/services/api/api.config";
import type {
  OccurrenceListApiItem,
  OccurrencesListApiResponse,
} from "@/types/occurrences-list";

const operationalStatusSchema = z.object({
  key: z.string(),
  name: z.string(),
});

const operationalPrioritySchema = z.enum(["low", "medium", "high"]);

const occurrenceListItemSchema = z.object({
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

const occurrencesListResponseSchema = z.object({
  data: z.array(occurrenceListItemSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
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

async function getOccurrencesPage(
  page: number,
  pageSize = 100,
): Promise<OccurrencesListApiResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const endpoint = `${buildApiUrl("occurrences")}?${searchParams.toString()}`;

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
        "Não foi possível carregar as ocorrências.",
      ),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta inválida.");
  }

  const parsedResponse = occurrencesListResponseSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error(
      "A API retornou dados de ocorrências em formato inesperado.",
    );
  }

  return parsedResponse.data;
}

export async function getAllOccurrences(): Promise<OccurrenceListApiItem[]> {
  const firstPage = await getOccurrencesPage(1);

  if (firstPage.totalPages <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from(
      {
        length: firstPage.totalPages - 1,
      },
      (_, index) => getOccurrencesPage(index + 2),
    ),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((response) => response.data),
  ];
}