import type { Metadata } from "next";

import { FieldDay } from "@/components/agent/FieldDay";

export const metadata: Metadata = {
  title: "Dia em campo | Mapeia Focos",
  description: "Módulo do Agente no Mapeia Focos.",
};

export default function AgentFieldDayPage() {
  return <FieldDay />;
}
