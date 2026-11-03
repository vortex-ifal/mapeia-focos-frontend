import type { Metadata } from "next";

import { CitizenHome } from "@/components/citizen/home/CitizenHome";

export const metadata: Metadata = {
  title: "Início | Mapeia Focos",
  description: "Registre e acompanhe ocorrências no Mapeia Focos.",
};

export default function CitizenHomePage() {
  return <CitizenHome />;
}