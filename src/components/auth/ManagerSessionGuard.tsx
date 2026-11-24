"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  AUTH_EVENT,
  hasActiveManagerSession,
} from "@/controllers/auth.controller";

const MANAGER_LOGIN_ROUTE = "/gestao/entrar";

export function ManagerSessionGuard({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    function validateSession() {
      if (!hasActiveManagerSession()) {
        setIsAuthorized(false);
        window.location.replace(MANAGER_LOGIN_ROUTE);
        return;
      }

      setIsAuthorized(true);
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        validateSession();
      }
    }

    validateSession();
    window.addEventListener("pageshow", validateSession);
    window.addEventListener("popstate", validateSession);
    window.addEventListener("focus", validateSession);
    window.addEventListener(AUTH_EVENT, validateSession);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", validateSession);
      window.removeEventListener("popstate", validateSession);
      window.removeEventListener("focus", validateSession);
      window.removeEventListener(AUTH_EVENT, validateSession);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!isAuthorized) {
    return <div className="min-h-dvh bg-[#FBF8F2]" aria-busy="true" />;
  }

  return <>{children}</>;
}
