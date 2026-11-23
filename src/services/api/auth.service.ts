import type { CreatedUserResponse, LoginResponse } from "@/types/auth";
import type { RegisterBackendPayload } from "@/schemas/auth.schema";

import { buildApiUrl } from "./api.config";

export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

function parseErrorMessage(errorData: unknown, fallbackMessage: string): string {
  if (
    typeof errorData === "object" &&
    errorData !== null &&
    "message" in errorData
  ) {
    const msg = (errorData as { message: unknown }).message;
    if (Array.isArray(msg)) {
      return msg.join(", ");
    }
    if (typeof msg === "string" && msg.trim().length > 0) {
      return msg;
    }
  }

  return fallbackMessage;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const endpoint = buildApiUrl("auth/login");

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new AuthApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
      503,
    );
  }

  if (!response.ok) {
    let errorMessage = "Credenciais inválidas. Verifique os dados informados.";
    try {
      const errorData = await response.json();
      errorMessage = parseErrorMessage(errorData, errorMessage);
    } catch {
      // response body was not valid JSON
    }
    throw new AuthApiError(errorMessage, response.status);
  }

  try {
    const data = (await response.json()) as LoginResponse;
    if (!data?.accessToken) {
      throw new AuthApiError(
        "Resposta inesperada do servidor de autenticação.",
        500,
      );
    }
    return data;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }
    throw new AuthApiError("Falha ao processar resposta do servidor.", 500);
  }
}

export async function registerApi(
  payload: RegisterBackendPayload,
): Promise<CreatedUserResponse> {
  const endpoint = buildApiUrl("auth/register");

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new AuthApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
      503,
    );
  }

  if (!response.ok) {
    let errorMessage = "Erro ao cadastrar usuário. Verifique os dados.";
    try {
      const errorData = await response.json();
      errorMessage = parseErrorMessage(errorData, errorMessage);
    } catch {
      // response body was not valid JSON
    }
    throw new AuthApiError(errorMessage, response.status);
  }

  try {
    const data = (await response.json()) as CreatedUserResponse;
    return data ?? { id: "" };
  } catch {
    return { id: "" };
  }
}

