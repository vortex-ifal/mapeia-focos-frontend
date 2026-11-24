import type { Metadata } from "next";

import { InspectionFlow } from "@/components/agent/inspection/InspectionFlow";

export const metadata: Metadata = {
  title: "Registrar vistoria | Mapeia Focos",
  description:
    "Registro da vistoria em campo e seleção de desfecho da ocorrência.",
};

type AgentInspectionPageProps = {
  params: Promise<{
    occurrenceId: string;
  }>;
};

export default async function AgentInspectionPage({
  params,
}: AgentInspectionPageProps) {
  const { occurrenceId } = await params;

  return <InspectionFlow occurrenceId={occurrenceId} />;
}
