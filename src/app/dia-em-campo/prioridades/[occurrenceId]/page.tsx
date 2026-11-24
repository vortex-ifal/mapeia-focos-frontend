import type { Metadata } from "next";

import { AgentOccurrenceDetails } from "@/components/agent/AgentOccurrenceDetails";

export const metadata: Metadata = {
  title: "Detalhamento da ocorrência | Mapeia Focos",
  description:
    "Informações completas e georreferenciadas da ocorrência para o agente.",
};

type PageProps = {
  params: Promise<{
    occurrenceId: string;
  }>;
};

export default async function DayPriorityDetailPage({ params }: PageProps) {
  const { occurrenceId } = await params;

  return <AgentOccurrenceDetails occurrenceId={occurrenceId} />;
}
