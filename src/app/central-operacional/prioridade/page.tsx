import type { Metadata } from "next";
import { Suspense } from "react";

import { ManualPriority } from "@/components/manager/priority/ManualPriority";

export const metadata: Metadata = {
  title: "Definir prioridade | Mapeia Focos",
  description: "Definição manual da prioridade de uma ocorrência validada.",
};

export default function ManualPriorityPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-[#FBF8F2] px-5 py-8 text-[#716B67]">
          Carregando prioridade...
        </main>
      }
    >
      <ManualPriority />
    </Suspense>
  );
}