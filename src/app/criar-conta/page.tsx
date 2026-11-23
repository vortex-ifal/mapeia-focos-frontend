import type { Metadata } from "next";

import { CitizenRegister } from "@/components/auth/CitizenRegister";

export const metadata: Metadata = {
  title: "Criar conta | Mapeia Focos",
  description:
    "Crie sua conta para acompanhar suas ocorrências no Mapeia Focos.",
};

export default function CitizenRegisterPage() {
  return <CitizenRegister />;
}

