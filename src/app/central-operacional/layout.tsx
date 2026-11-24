import type { ReactNode } from "react";

import { ManagerSessionGuard } from "@/components/auth/ManagerSessionGuard";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return <ManagerSessionGuard>{children}</ManagerSessionGuard>;
}
