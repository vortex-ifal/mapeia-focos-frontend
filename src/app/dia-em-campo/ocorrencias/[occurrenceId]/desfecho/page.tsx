import type { Metadata } from "next";
import { InspectionOutcomeFlow } from "@/components/agent/inspection/InspectionOutcomeFlow";

export const metadata: Metadata = { title: "Desfecho da vistoria | Mapeia Focos" };

export default async function InspectionOutcomePage({
  params,
}: { params: Promise<{ occurrenceId: string }> }) {
  const { occurrenceId } = await params;
  return <InspectionOutcomeFlow occurrenceId={occurrenceId} />;
}
