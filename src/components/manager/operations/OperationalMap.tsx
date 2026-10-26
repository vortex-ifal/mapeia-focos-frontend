import clsx from "clsx";

import { MapCluster } from "@/components/manager/map/MapCluster";
import { MapControlsLegend } from "@/components/manager/map/MapControlsLegend";
import { MapMarker } from "@/components/manager/map/MapMarker";
import type { OperationalOccurrence } from "@/types/operations";

type OperationalMapProps = {
  occurrences: OperationalOccurrence[];
  selectedOccurrenceId: string | null;
  onSelectOccurrence: (occurrenceId: string) => void;
};

const roadSegments = [
  {
    left: "-10%",
    top: "15%",
    width: "120%",
    height: "18px",
    rotation: "15deg",
  },
  {
    left: "-8%",
    top: "43%",
    width: "118%",
    height: "15px",
    rotation: "-12deg",
  },
  {
    left: "-12%",
    top: "68%",
    width: "124%",
    height: "18px",
    rotation: "8deg",
  },
  {
    left: "18%",
    top: "-8%",
    width: "15px",
    height: "116%",
    rotation: "18deg",
  },
  {
    left: "54%",
    top: "-10%",
    width: "18px",
    height: "120%",
    rotation: "-10deg",
  },
  {
    left: "80%",
    top: "-8%",
    width: "14px",
    height: "116%",
    rotation: "13deg",
  },
];

export function OperationalMap({
  occurrences,
  selectedOccurrenceId,
  onSelectOccurrence,
}: OperationalMapProps) {
  return (
    <section
      aria-label="Mapa operacional"
      className="
        relative
        h-[600px]
        w-full
        min-w-0
        overflow-hidden
        rounded-[18px]
        border
        border-[#E9E0D4]
        bg-[#F4EFE6]
        lg:h-full
        lg:min-h-0
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        {roadSegments.map((road, index) => (
          <span
            key={index}
            className="absolute bg-white/90"
            style={{
              left: road.left,
              top: road.top,
              width: road.width,
              height: road.height,
              transform: `rotate(${road.rotation})`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>

      <div
        className="
          absolute
          left-[18%]
          top-[28%]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <MapCluster count={12} />
      </div>

      {occurrences.map((occurrence) => {
        const selected = occurrence.id === selectedOccurrenceId;

        return (
          <button
            key={occurrence.id}
            type="button"
            onClick={() => onSelectOccurrence(occurrence.id)}
            aria-label={`Selecionar ocorrência ${occurrence.displayCode}`}
            aria-pressed={selected}
            className={clsx(
              `
                absolute
                flex
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
              `,
              selected ? "h-[52px] w-[52px]" : "h-8 w-8",
            )}
            style={{
              left: `${occurrence.mapPosition.x}%`,
              top: `${occurrence.mapPosition.y}%`,
            }}
          >
            <MapMarker selected={selected} />
          </button>
        );
      })}

      <MapControlsLegend
        className="
          absolute
          bottom-[14px]
          left-[14px]
        "
      />
    </section>
  );
}