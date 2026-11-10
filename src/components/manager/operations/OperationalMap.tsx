"use client";

import dynamic from "next/dynamic";
import type { OperationalMapProps } from "./OperationalMapLeaflet";

const OperationalMapLeaflet = dynamic(
  () =>
    import("./OperationalMapLeaflet").then((mod) => mod.OperationalMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <section
        aria-label="Mapa operacional"
        className="
          flex
          h-[600px]
          w-full
          min-w-0
          items-center
          justify-center
          rounded-[18px]
          border
          border-[#E9E0D4]
          bg-[#F4EFE6]
          text-[13px]
          text-[#716B67]
          lg:h-full
          lg:min-h-0
        "
      >
        Carregando mapa operacional...
      </section>
    ),
  },
);

export function OperationalMap(props: OperationalMapProps) {
  return <OperationalMapLeaflet {...props} />;
}
