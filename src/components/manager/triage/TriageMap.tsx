"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import type { TriageMapProps } from "./TriageMapLeaflet";

const TriageMapLeaflet = dynamic(
  () => import("./TriageMapLeaflet").then((mod) => mod.TriageMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div
        className="
          flex
          h-full
          w-full
          min-w-0
          items-center
          justify-center
          rounded-[14px]
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

export function TriageMap(props: TriageMapProps) {
  const isDetail = props.variant === "detail";

  return (
    <div
      className={clsx(
        "w-full min-w-0",
        isDetail ? "h-[220px]" : "h-[360px]",
      )}
    >
      <TriageMapLeaflet {...props} />
    </div>
  );
}

export type { TriageMapProps, TriageMapVariant } from "./TriageMapLeaflet";
