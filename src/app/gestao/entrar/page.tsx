import type { Metadata } from "next";

import { ManagerLogin } from "@/components/auth/ManagerLogin";

export const metadata: Metadata = {
  title: "Entrar na gestão | Mapeia Focos",
  description: "Acesso à Central Operacional do Mapeia Focos.",
};

export default function ManagerLoginPage() {
  return <ManagerLogin />;
}