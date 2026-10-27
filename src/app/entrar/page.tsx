import type { Metadata } from "next";

import { CitizenLogin } from "@/components/auth/CitizenLogin";

export const metadata: Metadata = {
  title: "Entrar | Mapeia Focos",
  description: "Acesse sua conta para acompanhar ocorrências no Mapeia Focos.",
};

export default function CitizenLoginPage() {
  return <CitizenLogin />;
}