import type { Metadata } from "next";

import { OccurrencesList } from "@/components/manager/occurrences-list/OccurrencesList";

export const metadata: Metadata = {
  title: "Ocorrências | Mapeia Focos",
  description: "Lista completa de ocorrências registradas no Mapeia Focos.",
};

export default function OccurrencesPage() {
  return <OccurrencesList />;
}
