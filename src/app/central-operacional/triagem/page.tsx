import type { Metadata } from "next";
import { Suspense } from "react";

import { HumanTriage } from "@/components/manager/triage/HumanTriage";

export const metadata: Metadata = {
  title: "Triagem | Mapeia Focos",
  description: "Análise e moderação de ocorrências do Mapeia Focos.",
};

export default function HumanTriagePage() {
  return (
    <Suspense
      fallback={
        <main
          className="
            min-h-dvh
            bg-[#FBF8F2]
            px-5
            py-8
            text-[#716B67]
          "
        >
          Carregando triagem...
        </main>
      }
    >
      <HumanTriage />
    </Suspense>
  );
}