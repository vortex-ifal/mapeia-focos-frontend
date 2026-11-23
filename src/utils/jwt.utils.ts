export const AUTH_TOKEN_KEY = "mapeia-auth-token";

export interface JwtAuthPayload {
  sub: string;
  name: string;
  email: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function decodeJwtPayload<T = JwtAuthPayload>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as T;
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
