import { Flame, LocateFixed } from "lucide-react";
import clsx from "clsx";

import { formatHeatmapTotal } from "@/controllers/manager/heatmap.controller";

type HeatMapLegendProps = {
  total: number;
  className?: string;
  onRecenter?: () => void;
};

export function HeatMapLegend({
  total,
  className,
  onRecenter,
}: HeatMapLegendProps) {
  return (
    <div
      aria-label="Legenda do mapa de calor de risco"
      className={clsx(
        `
          pointer-events-auto
          flex
          flex-col
          gap-2.5
          rounded-[14px]
          border
          border-[#E9E0D4]
          bg-white/95
          p-3.5
          shadow-md
          backdrop-blur-sm
          sm:min-w-[250px]
        `,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#171717]">
          <Flame size={16} className="text-[#C94F32]" aria-hidden="true" />
          Densidade de Risco
        </span>

        <span
          className="
            rounded-full
            bg-[#F8E3E0]
            px-2
            py-0.5
            text-[11px]
            font-semibold
            text-[#C94F32]
          "
        >
          {formatHeatmapTotal(total)}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div
          aria-hidden="true"
          className="
            h-2.5
            w-full
            rounded-full
            bg-gradient-to-r
            from-[#FACC15]
            via-[#F97316]
            to-[#991B1B]
          "
        />

        <div className="flex items-center justify-between text-[10px] font-medium text-[#716B67]">
          <span>Baixa densidade</span>
          <span>Alta densidade</span>
        </div>
      </div>

      {onRecenter ? (
        <button
          type="button"
          onClick={onRecenter}
          className="
            mt-0.5
            flex
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-[8px]
            border
            border-[#E9E0D4]
            bg-[#FBF8F2]
            px-2.5
            py-1.5
            text-[11px]
            font-semibold
            text-[#584A57]
            transition-colors
            hover:bg-[#F4EFE6]
            hover:text-[#171717]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#C94F32]
          "
        >
          <LocateFixed
            size={13}
            className="text-[#C94F32]"
            aria-hidden="true"
          />
          Centralizar em Arapiraca
        </button>
      ) : null}
    </div>
  );
}
