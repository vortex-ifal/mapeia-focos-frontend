import { MapControlsLegend } from "@/components/manager/map/MapControlsLegend";
import { MapMarker } from "@/components/manager/map/MapMarker";
import { createAgentPriorityMapPoints } from "@/controllers/agent/day-priorities.controller";
import type { AgentPriorityItem } from "@/types/agent-priorities";

type DayPrioritiesMapProps = {
  occurrences: AgentPriorityItem[];
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

export function DayPrioritiesMap({ occurrences }: DayPrioritiesMapProps) {
  const points = createAgentPriorityMapPoints(occurrences);

  return (
    <div
      aria-label="Mapa das prioridades do dia"
      className="
        relative
        h-[430px]
        w-full
        overflow-hidden
        rounded-[14px]
        border
        border-[#E9E0D4]
        bg-[#F4EFE6]
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
            className="
                absolute
                bg-white/90
              "
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

      {points.map((point) => (
        <span
          key={point.id}
          className="
              absolute
              flex
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
            "
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
          }}
        >
          <MapMarker selected={point.selected} />
        </span>
      ))}

      {points.length === 0 ? (
        <div
          className="
            absolute
            left-1/2
            top-1/2
            w-[calc(100%-32px)]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[10px]
            bg-white
            px-4
            py-3
            text-center
            text-[12px]
            leading-5
            text-[#716B67]
          "
        >
          Nenhuma ocorrência possui localização disponível.
        </div>
      ) : (
        <MapControlsLegend
          className="
            absolute
            bottom-3
            left-3
          "
        />
      )}
    </div>
  );
}