"use client";

import dynamic from "next/dynamic";
import type { AgentOccurrenceMapProps } from "./AgentOccurrenceMapLeaflet";

const AgentOccurrenceMapLeaflet = dynamic(
  () =>
    import("./AgentOccurrenceMapLeaflet").then(
      (mod) => mod.AgentOccurrenceMapLeaflet,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="
          flex
          h-[240px]
          w-full
          min-w-0
          items-center
          justify-center
          rounded-[16px]
          border
          border-[#E9E0D4]
          bg-[#F4EFE6]
          text-[12px]
          text-[#716B67]
        "
      >
        Carregando mapa...
      </div>
    ),
  },
);

export function AgentOccurrenceMap(props: AgentOccurrenceMapProps) {
  return <AgentOccurrenceMapLeaflet {...props} />;
}
