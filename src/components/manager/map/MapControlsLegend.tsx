import { ChevronDown, Layers3 } from "lucide-react";
import clsx from "clsx";

import { MapMarker } from "@/components/manager/map/MapMarker";

type MapControlsLegendProps = {
  className?: string;
};

export function MapControlsLegend({ className }: MapControlsLegendProps) {
  return (
    <div
      className={clsx(
        `
          flex
          h-11
          w-[360px]
          max-w-[calc(100%-28px)]
          items-center
          gap-2
          rounded-[12px]
          border
          border-[#E9E0D4]
          bg-white
          px-[10px]
          text-[11px]
          text-[#584A57]
          shadow-sm
        `,
        className,
      )}
    >
      <span className="flex shrink-0 items-center gap-2">
        <MapMarker size="legend" />
        ocorrência
      </span>

      <span className="flex shrink-0 items-center gap-2">
        <MapMarker selected size="legend" />
        selecionada
      </span>

      <span
        className="
          ml-auto
          flex
          shrink-0
          items-center
          gap-[5px]
          font-semibold
        "
      >
        <Layers3 size={18} strokeWidth={1.8} aria-hidden="true" />
        Camadas
        <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
      </span>
    </div>
  );
}