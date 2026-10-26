import { Suspense } from "react";
import { OccurrenceStatus } from "@/components/citizen/occurrence/OccurrenceStatus";

interface PageProps {
  params: Promise<{
    codigo: string;
  }>;
}

export default async function OccurrenceStatusPage({ params }: PageProps) {
  const { codigo } = await params;

  return (
    <Suspense fallback={null}>
      <OccurrenceStatus protocol={codigo} />
    </Suspense>
  );
}
