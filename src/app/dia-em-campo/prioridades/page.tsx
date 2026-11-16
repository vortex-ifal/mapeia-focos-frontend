import type { Metadata } from "next";

import { DayPriorities } from "@/components/agent/DayPriorities";

export const metadata: Metadata = {
  title: "Prioridades do dia | Mapeia Focos",

  description:
    "Ocorrências atribuídas ao agente para acompanhamento das atividades em campo.",
};

export default function DayPrioritiesPage() {
  return <DayPriorities />;
}