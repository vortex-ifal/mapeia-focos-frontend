import type { Metadata } from "next";

import { OperationsDashboard } from "@/components/manager/operations/OperationsDashboard";

export const metadata: Metadata = {
  title: "Central Operacional | Mapeia Focos",
  description: "Fila operacional e triagem de ocorrências do Mapeia Focos.",
};

export default function OperationalCenterPage() {
  return <OperationsDashboard />;
}