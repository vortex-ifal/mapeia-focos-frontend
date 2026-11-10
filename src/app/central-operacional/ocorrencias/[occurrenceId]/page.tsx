import type { Metadata } from "next";

import { OccurrenceDetails } from "@/components/manager/occurrence-details/OccurrenceDetails";

export const metadata: Metadata = {
  title: "Detalhes da ocorrência | Mapeia Focos",
};

type OccurrenceDetailsPageProps = {
  params: Promise<{
    occurrenceId: string;
  }>;
};

export default async function OccurrenceDetailsPage({
  params,
}: OccurrenceDetailsPageProps) {
  const { occurrenceId } = await params;

  return <OccurrenceDetails occurrenceId={occurrenceId} />;
}