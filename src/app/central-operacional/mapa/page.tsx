import type { Metadata } from "next";

import { HeatMapDashboard } from "@/components/manager/heatmap/HeatMapDashboard";

export const metadata: Metadata = {
  title: "Mapa de Calor | Mapeia Focos",
  description: "Visualização geográfica da densidade e concentração de focos.",
};

export default function HeatMapPage() {
  return <HeatMapDashboard />;
}
