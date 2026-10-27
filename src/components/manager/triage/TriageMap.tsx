import { MapControlsLegend } from "@/components/manager/map/MapControlsLegend";
import { MapMarker } from "@/components/manager/map/MapMarker";
import { createTriageMapPoints } from "@/controllers/manager/triage.controller";
import type {
  TerritorialContextResponse,
  TriageOccurrence,
} from "@/types/triage";
import clsx from "clsx";

type TriageMapVariant = "detail" | "territorial";

type TriageMapProps = {
  occurrence: TriageOccurrence;
  context: TerritorialContextResponse | null;
  variant: TriageMapVariant;
  loading?: boolean;
  errorMessage?: string | null;
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

export function TriageMap({
  occurrence,
  context,
  variant,
  loading = false,
  errorMessage = null,
}: TriageMapProps) {
  const points = createTriageMapPoints(occurrence, context);

  const isDetail = variant === "detail";

  return (
    <div
      aria-label={
        isDetail ? "Mapa da ocorrência" : "Mapa de contexto territorial"
      }
      className={clsx(
        `
          relative
          w-full
          min-w-0
          overflow-hidden
          rounded-[14px]
          border
          border-[#E9E0D4]
          bg-[#F4EFE6]
        `,
        isDetail ? "h-[220px]" : "h-[360px]",
      )}
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

      {!loading &&
        !errorMessage &&
        points.map((point) => (
          <span
            key={point.id}
            aria-label={
              point.selected
                ? "Ocorrência analisada"
                : point.distanceMeters !== null
                  ? `Registro próximo a aproximadamente ${Math.round(
                      point.distanceMeters,
                    )} metros`
                  : "Registro próximo"
            }
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

      {loading ? (
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-[#F4EFE6]/80
            px-4
            text-center
            text-[12px]
            text-[#716B67]
          "
        >
          Carregando contexto territorial...
        </div>
      ) : null}

      {!loading && errorMessage ? (
        <div
          role="alert"
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
            leading-[1.4]
            text-[#9D352D]
          "
        >
          {errorMessage}
        </div>
      ) : null}

      {!loading && !errorMessage && points.length === 0 ? (
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
            leading-[1.4]
            text-[#716B67]
          "
        >
          Localização não disponível para esta ocorrência.
        </div>
      ) : null}

      {!loading && !errorMessage && points.length > 0 ? (
        <MapControlsLegend
          className={clsx(
            `
              absolute
              left-[14px]
            `,
            isDetail ? "top-[8px]" : "bottom-[14px]",
          )}
        />
      ) : null}
    </div>
  );
}