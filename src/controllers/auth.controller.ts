import type { LoginFormData } from "@/schemas/auth.schema";
import type { AuthenticatedUser, LoginResult } from "@/types/auth";

export const MOCK_CITIZEN_CREDENTIALS = {
  email: "cidadao@teste.com",
  password: "123456",
} as const;

export const MOCK_AGENT_CREDENTIALS = {
  email: "agente@teste.com",
  password: "123456",
} as const;

export const MOCK_MANAGER_CREDENTIALS = {
  email: "admin@gestao.com",
  password: "123456",
} as const;

export const CITIZEN_HOME_ROUTE = "/";
export const AGENT_FIELD_DAY_ROUTE = "/dia-em-campo";
export const MANAGER_HOME_ROUTE = "/central-operacional";
export const LOGIN_ROUTE = "/entrar";

export const AUTH_USER_KEY = "mapeia-auth-user";
export const AUTH_ROLE_COOKIE = "mapeia_user_role";
export const AUTH_EVENT = "mapeia-auth-change";

export const MOCK_USERS: Record<string, AuthenticatedUser> = {
  [MOCK_CITIZEN_CREDENTIALS.email]: {
    id: "usr-citizen-1",
    name: "Cidadão Teste",
    email: MOCK_CITIZEN_CREDENTIALS.email,
    role: "citizen",
    perfil: "Cidadão",
  },
  [MOCK_AGENT_CREDENTIALS.email]: {
    id: "usr-agent-1",
    name: "Agente de Endemias",
    email: MOCK_AGENT_CREDENTIALS.email,
    role: "agent",
    perfil: "Agente",
  },
  [MOCK_MANAGER_CREDENTIALS.email]: {
    id: "usr-manager-1",
    name: "Gestor Operacional",
    email: MOCK_MANAGER_CREDENTIALS.email,
    role: "manager",
    perfil: "Gestor",
  },
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

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

export function validateCitizenCredentials(
  credentials: LoginFormData,
): boolean {
  return (
    normalizeEmail(credentials.email) === MOCK_CITIZEN_CREDENTIALS.email &&
    credentials.password === MOCK_CITIZEN_CREDENTIALS.password
  );
}

export function validateAgentCredentials(
  credentials: LoginFormData,
): boolean {
  return (
    normalizeEmail(credentials.email) === MOCK_AGENT_CREDENTIALS.email &&
    credentials.password === MOCK_AGENT_CREDENTIALS.password
  );
}

export function validateManagerCredentials(
  credentials: LoginFormData,
): boolean {
  return (
    normalizeEmail(credentials.email) === MOCK_MANAGER_CREDENTIALS.email &&
    credentials.password === MOCK_MANAGER_CREDENTIALS.password
  );
}

export function authenticateUser(credentials: LoginFormData): LoginResult {
  const normalizedInputEmail = normalizeEmail(credentials.email);

  if (
    normalizedInputEmail === MOCK_CITIZEN_CREDENTIALS.email &&
    credentials.password === MOCK_CITIZEN_CREDENTIALS.password
  ) {
    return {
      success: true,
      user: MOCK_USERS[MOCK_CITIZEN_CREDENTIALS.email],
    };
  }

  if (
    normalizedInputEmail === MOCK_AGENT_CREDENTIALS.email &&
    credentials.password === MOCK_AGENT_CREDENTIALS.password
  ) {
    return {
      success: true,
      user: MOCK_USERS[MOCK_AGENT_CREDENTIALS.email],
    };
  }

  if (
    normalizedInputEmail === MOCK_MANAGER_CREDENTIALS.email &&
    credentials.password === MOCK_MANAGER_CREDENTIALS.password
  ) {
    return {
      success: true,
      user: MOCK_USERS[MOCK_MANAGER_CREDENTIALS.email],
    };
  }

  return {
    success: false,
    error: "E-mail ou senha inválidos. Verifique os dados informados.",
  };
}

export function saveAuthSession(user: AuthenticatedUser): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
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
  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeToAuthSession(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
  };
}
