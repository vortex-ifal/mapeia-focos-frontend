import {
  type LoginFormData,
  type RegisterCitizenFormData,
  type RegisterBackendPayload,
} from "@/schemas/auth.schema";
import { loginApi, registerApi } from "@/services/api/auth.service";
import type {
  AuthenticatedUser,
  LoginResult,
  RegisterResult,
  UserProfileName,
  UserRole,
} from "@/types/auth";
import { cleanCpf } from "@/utils/cpf.utils";
import { decodeJwtPayload, type JwtAuthPayload } from "@/utils/jwt.utils";

export const CITIZEN_HOME_ROUTE = "/inicio";
export const AGENT_FIELD_DAY_ROUTE = "/dia-em-campo";
export const MANAGER_HOME_ROUTE = "/central-operacional";
export const LOGIN_ROUTE = "/entrar";
export const REGISTER_ROUTE = "/criar-conta";

export const AUTH_USER_KEY = "mapeia-auth-user";
export const AUTH_TOKEN_KEY = "mapeia-auth-token";
export const AUTH_ROLE_COOKIE = "mapeia_user_role";
export const AUTH_TOKEN_COOKIE = "mapeia_auth_token";
export const AUTH_EVENT = "mapeia-auth-change";

export function normalizeRole(roleOrProfile?: string | null): string {
  return (roleOrProfile ?? "").trim().toLowerCase();
}

export function resolveHomeRouteByRole(roleOrProfile?: string | null): string {
  const normalized = normalizeRole(roleOrProfile);

  if (normalized === "agent" || normalized === "agente") {
    return AGENT_FIELD_DAY_ROUTE;
  }

  if (
    normalized === "manager" ||
    normalized === "gestao" ||
    normalized === "gestor"
  ) {
    return MANAGER_HOME_ROUTE;
  }

  return CITIZEN_HOME_ROUTE;
}

export function mapRoleToProfileName(role: string): UserProfileName {
  const normalized = normalizeRole(role);

  if (normalized === "agent" || normalized === "agente") {
    return "Agente";
  }

  if (
    normalized === "manager" ||
    normalized === "gestao" ||
    normalized === "gestor"
  ) {
    return "Gestor";
  }

  return "Cidadão";
}

export function mapRoleToUserRole(role?: string | null): UserRole {
  const normalized = normalizeRole(role);

  if (normalized === "agent" || normalized === "agente") {
    return "agent";
  }

  if (
    normalized === "manager" ||
    normalized === "gestao" ||
    normalized === "gestor"
  ) {
    return "manager";
  }

  return "citizen";
}

function buildUserFromJwtPayload(
  payload: JwtAuthPayload | null,
  fallbackEmail: string,
  token: string,
): AuthenticatedUser {
  const role = mapRoleToUserRole(payload?.role);
  const perfil = mapRoleToProfileName(payload?.role ?? role);

  return {
    id: payload?.sub || "",
    name: payload?.name || (role === "citizen" ? "Cidadão" : "Usuário"),
    email: payload?.email || fallbackEmail,
    role,
    perfil,
    token,
  };
}

export async function authenticateUser(
  credentials: LoginFormData,
): Promise<LoginResult> {
  try {
    const { accessToken } = await loginApi(
      credentials.email.trim().toLowerCase(),
      credentials.password,
    );

    const payload = decodeJwtPayload<JwtAuthPayload>(accessToken);

    const user = buildUserFromJwtPayload(
      payload,
      credentials.email.trim().toLowerCase(),
      accessToken,
    );

    return {
      success: true,
      user,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "E-mail ou senha inválidos. Verifique os dados informados.";

    return {
      success: false,
      error: message,
    };
  }
}

export async function registerCitizen(
  data: RegisterCitizenFormData,
): Promise<RegisterResult> {
  try {
    const trimmedDisplayName = data.displayName?.trim() ?? "";

    const effectiveName =
      trimmedDisplayName.length >= 3 ? trimmedDisplayName : "Cidadão";

    const payload: RegisterBackendPayload = {
      name: effectiveName,
      email: data.email.trim().toLowerCase(),
      password: data.password,
      cpf: cleanCpf(data.cpf),
    };

    await registerApi(payload);

    const loginResult = await authenticateUser({
      email: payload.email,
      password: payload.password,
    });

    if (!loginResult.success || !loginResult.user) {
      return {
        success: false,
        error:
          "Conta criada com sucesso, mas o login automático falhou. Por favor, acesse a tela de login.",
      };
    }

    saveAuthSession(loginResult.user);

    return {
      success: true,
      user: loginResult.user,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível concluir o cadastro. Verifique os dados informados.";

    return {
      success: false,
      error: message,
    };
  }
}

export function saveAuthSession(user: AuthenticatedUser): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  if (user.token) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, user.token);

    document.cookie = `${AUTH_TOKEN_COOKIE}=${user.token}; path=/; SameSite=Lax`;
  }

  document.cookie = `${AUTH_ROLE_COOKIE}=${user.role}; path=/; SameSite=Lax`;

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAuthSession(): AuthenticatedUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = sessionStorage.getItem(AUTH_USER_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthenticatedUser;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function hasActiveAgentSession(): boolean {
  const user = getAuthSession();
  const token = getAuthToken();

  if (!user || !token || user.role !== "agent" || user.token !== token) {
    return false;
  }

  const payload = decodeJwtPayload<JwtAuthPayload>(token);

  return Boolean(
    payload &&
      mapRoleToUserRole(payload.role) === "agent" &&
      typeof payload.exp === "number" &&
      payload.exp * 1000 > Date.now(),
  );
}

export function getAuthSessionSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(AUTH_USER_KEY);
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);

  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);

  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeToAuthSession(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}