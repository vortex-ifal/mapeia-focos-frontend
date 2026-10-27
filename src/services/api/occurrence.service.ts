import type {
  OccurrenceFormData,
  OccurrenceResponse,
  OccurrenceBackendPayload,
  OccurrenceStatusResponse,
} from "@/types/occurrence";

import { buildApiUrl } from "./api.config";

export class OccurrenceNotFoundError extends Error {
  readonly status = 404;

  constructor(
    message = "Protocolo não encontrado. Verifique o código digitado.",
  ) {
    super(message);
    this.name = "OccurrenceNotFoundError";
  }
}

export class OccurrenceValidationError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "OccurrenceValidationError";
  }
}

export class OccurrenceServerError extends Error {
  readonly status = 500;

  constructor(
    message = "Erro ao consultar o sistema. Tente novamente mais tarde.",
  ) {
    super(message);
    this.name = "OccurrenceServerError";
  }
}

export async function createOccurrence(
  data: OccurrenceFormData,
): Promise<OccurrenceResponse> {
  const payload: OccurrenceBackendPayload = {
    address: data.address,
    description: data.description,
    situationType: data.situationType || undefined,
    latitude: data.latitude,
    longitude: data.longitude,
  };

  const endpoint = buildApiUrl("occurrences");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Erro ao registrar ocorrência.";
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : String(errorData.message);
      }
    } catch {
      // response body was empty or not valid JSON
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data ?? {};
  } catch {
    return {};
  }
}

export async function getOccurrenceStatusByProtocol(
  protocol: string,
): Promise<OccurrenceStatusResponse> {
  const cleanProtocol = protocol.trim();
  const endpoint = buildApiUrl(
    `occurrences/protocol/${encodeURIComponent(cleanProtocol)}`,
  );

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new OccurrenceNotFoundError();
    }

    let serverMessage = "";
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        serverMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : String(errorData.message);
      }
    } catch {
      // response body was empty or not valid JSON
    }

    if (response.status === 400) {
      throw new OccurrenceValidationError(
        serverMessage ||
          "Formato de protocolo inválido. Verifique o código digitado.",
      );
    }

    if (response.status >= 500) {
      throw new OccurrenceServerError();
    }

    throw new Error(
      serverMessage ||
        "Não foi possível realizar a consulta. Tente novamente mais tarde.",
    );
  }

  return response.json();
}