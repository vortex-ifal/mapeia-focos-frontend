import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AGENT_FIELD_DAY_ROUTE,
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const authenticatedRole = authToken ? userRole : undefined;

  function noStore(response: NextResponse): NextResponse {
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    return response;
  }

  // Protected agent routes require both authentication cookies.
  if (isAgentRoute(pathname) && (!authToken || authenticatedRole !== "agent")) {
    return noStore(NextResponse.redirect(new URL(LOGIN_ROUTE, request.url)));
  }

  // An authenticated agent cannot access citizen pages or the login page.
  if (authenticatedRole === "agent" && (isCitizenRoute(pathname) || pathname === LOGIN_ROUTE)) {
    return NextResponse.redirect(new URL(AGENT_FIELD_DAY_ROUTE, request.url));
  }

  const response = NextResponse.next();
  return isAgentRoute(pathname) ? noStore(response) : response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|brand|robots.txt|sitemap.xml).*)",
  ],
};
