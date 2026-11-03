import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AGENT_FIELD_DAY_ROUTE,
  AUTH_ROLE_COOKIE,
  CITIZEN_HOME_ROUTE,
  LOGIN_ROUTE,
} from "./controllers/auth.controller";

const CITIZEN_ROUTES = [
  CITIZEN_HOME_ROUTE,
  "/nova-ocorrencia",
  "/acompanhar-referencia",
];

const AGENT_ROUTES = [AGENT_FIELD_DAY_ROUTE, "/agente"];

function isCitizenRoute(pathname: string): boolean {
  if (pathname === CITIZEN_HOME_ROUTE) {
    return true;
  }

  return CITIZEN_ROUTES.some(
    (route) => route !== CITIZEN_HOME_ROUTE && pathname.startsWith(route),
  );
}

function isAgentRoute(pathname: string): boolean {
  return AGENT_ROUTES.some((route) => pathname.startsWith(route));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get(AUTH_ROLE_COOKIE)?.value;

  // Agent cannot access citizen screens or citizen login:
  if (userRole === "agent") {
    if (isCitizenRoute(pathname) || pathname === LOGIN_ROUTE) {
      return NextResponse.redirect(new URL(AGENT_FIELD_DAY_ROUTE, request.url));
    }
  }

  // Citizen cannot access agent module:
  if (userRole === "citizen") {
    if (isAgentRoute(pathname)) {
      return NextResponse.redirect(new URL(CITIZEN_HOME_ROUTE, request.url));
    }
  }

  // Unauthenticated user cannot access agent module:
  if (!userRole && isAgentRoute(pathname)) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|brand|robots.txt|sitemap.xml).*)",
  ],
};
