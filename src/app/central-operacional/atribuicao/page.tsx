import type { Metadata } from "next";
import { Suspense } from "react";

import { AgentAssignment } from "@/components/manager/assignment/AgentAssignment";

export const metadata: Metadata = {
  title: "Atribuir agente | Mapeia Focos",
};

export default function AssignmentPage() {
  return (
    <Suspense>
      <AgentAssignment />
    </Suspense>
  );
}