import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AGENT_FIELD_DAY_ROUTE,
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
  MANAGER_HOME_ROUTE,
  CITIZEN_HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from "./controllers/auth.controller";

const CITIZEN_ROUTES = [
  CITIZEN_HOME_ROUTE,
  "/",
  "/acompanhar-referencia",
  "/nova-ocorrencia",
  REGISTER_ROUTE,
];

const AGENT_ROUTES = [AGENT_FIELD_DAY_ROUTE, "/agente"];

function isManagerRoute(pathname: string): boolean {
  return pathname === MANAGER_HOME_ROUTE || pathname.startsWith(`${MANAGER_HOME_ROUTE}/`);
}

function isCitizenRoute(pathname: string): boolean {
  if (pathname === "/" || pathname === CITIZEN_HOME_ROUTE) {
    return true;
  }

  return CITIZEN_ROUTES.some(
    (route) => route !== "/" && pathname.startsWith(route),
  );
}

function isAgentRoute(pathname: string): boolean {
  return AGENT_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * The proxy checks expiration and role consistency to avoid redirect loops.
 * Backend endpoints must still verify the token's signature and permissions:
 * decoding a JWT here is not an authentication mechanism.
 */
function getActiveCookieRole(token: string | undefined, cookieRole: string | undefined): string | null {
  if (!token || !cookieRole) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const encoded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "="))) as {
      exp?: unknown;
      role?: unknown;
    };
    if (typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now()) return null;
    if (typeof payload.role !== "string") return null;
    const role = payload.role.toLowerCase();
    if (!["agent", "manager", "citizen"].includes(role)) return null;
    return role === cookieRole ? role : null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const authenticatedRole = getActiveCookieRole(authToken, userRole);
  const hasInvalidCookies = Boolean(authToken || userRole) && !authenticatedRole;

  function finish(response: NextResponse): NextResponse {
    if (hasInvalidCookies) {
      response.cookies.delete(AUTH_ROLE_COOKIE);
      response.cookies.delete(AUTH_TOKEN_COOKIE);
    }
    return response;
  }


  function noStore(response: NextResponse): NextResponse {
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return response;
  }

  // Protected agent routes require an active agent session.
  if (isAgentRoute(pathname) && (!authToken || authenticatedRole !== "agent")) {
    const destination = authenticatedRole === "citizen"
      ? CITIZEN_HOME_ROUTE
      : authenticatedRole === "manager"
        ? MANAGER_HOME_ROUTE
        : LOGIN_ROUTE;
    return finish(noStore(NextResponse.redirect(new URL(destination, request.url))));
  }

  // Management pages require a manager role; send other known roles home.
  if (isManagerRoute(pathname) && (!authToken || authenticatedRole !== "manager")) {
    const destination = authenticatedRole === "citizen"
      ? CITIZEN_HOME_ROUTE
      : authenticatedRole === "agent"
        ? AGENT_FIELD_DAY_ROUTE
        : "/gestao/entrar";
    return finish(noStore(NextResponse.redirect(new URL(destination, request.url))));
  }

  // An authenticated agent cannot access citizen pages or the login page.
  if (authenticatedRole === "agent" && (isCitizenRoute(pathname) || pathname === LOGIN_ROUTE)) {
    return finish(NextResponse.redirect(new URL(AGENT_FIELD_DAY_ROUTE, request.url)));
  }

  const response = NextResponse.next();
  return finish(isAgentRoute(pathname) || isManagerRoute(pathname) ? noStore(response) : response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|brand|robots.txt|sitemap.xml).*)",
  ],
};
