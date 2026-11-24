import type { Metadata } from "next";

import { AgentOccurrenceDetails } from "@/components/agent/AgentOccurrenceDetails";

export const metadata: Metadata = {
  title: "Detalhamento da ocorrência | Mapeia Focos",
  description:
    "Informações completas e georreferenciadas da ocorrência para o agente.",
};

type AgentOccurrenceDetailsPageProps = {
  params: Promise<{
    occurrenceId: string;
  }>;
};

export default async function AgentOccurrenceDetailsPage({
  params,
}: AgentOccurrenceDetailsPageProps) {
  const { occurrenceId } = await params;

  return <AgentOccurrenceDetails occurrenceId={occurrenceId} />;
}
