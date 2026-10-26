import { LocationSummary } from "@/components/manager/operations/LocationSummary";
import { MediaThumbnail } from "@/components/manager/operations/MediaThumbnail";
import { Button } from "@/components/ui/Button";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OperationalOccurrence } from "@/types/operations";

type OccurrenceContextPanelProps = {
  occurrence: OperationalOccurrence | null;
  reviewHref: string | null;
};

export function OccurrenceContextPanel({
  occurrence,
  reviewHref,
}: OccurrenceContextPanelProps) {
  if (!occurrence) {
    return (
      <aside
        className="
          h-[640px]
          w-full
          min-w-0
          rounded-[16px]
          border
          border-[#E9E0D4]
          bg-white
          p-[17px]
          lg:h-full
          lg:min-h-0
        "
      >
        <p
          className="
            text-[12px]
            font-semibold
            text-[#716B67]
          "
        >
          Ocorrência selecionada
        </p>

        <div
          className="
            mt-8
            rounded-[12px]
            bg-[#FBF8F2]
            p-4
          "
        >
          <p
            className="
              text-[12px]
              leading-[1.45]
              text-[#716B67]
            "
          >
            Selecione uma ocorrência na fila ou no mapa para visualizar os
            detalhes.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-labelledby="selected-occurrence-title"
      className="
        flex
        h-[640px]
        w-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[17px]
        lg:h-full
        lg:min-h-0
      "
    >
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          pr-1
        "
      >
        <p
          id="selected-occurrence-title"
          className="
            text-[12px]
            font-semibold
            leading-[1.3]
            text-[#716B67]
          "
        >
          Ocorrência selecionada
        </p>

        <h2
          className="
            mt-[7px]
            text-[25px]
            font-extrabold
            leading-[1.2]
            tracking-[-0.4px]
            text-[#171717]
          "
        >
          {occurrence.displayCode}
        </h2>

        <div
          className="
            mt-[13px]
            flex
            flex-wrap
            gap-[7px]
          "
        >
          <PriorityBadge value={occurrence.priority} />

          <StatusBadge label={occurrence.status.name} />
        </div>

        <LocationSummary
          address={occurrence.address}
          context={occurrence.locationContext}
          className="
            mt-4
            min-h-[88px]
          "
        />

        <div
          aria-label="Evidências da ocorrência"
          className="
            mt-[10px]
            flex
            gap-2
          "
        >
          {occurrence.evidence.slice(0, 2).map((evidence) => (
            <MediaThumbnail
              key={evidence.id}
              alt={evidence.alt}
              className="
                  h-16
                  w-[82px]
                "
            />
          ))}
        </div>

        <h3
          className="
            mt-[10px]
            text-[14px]
            font-bold
            leading-[1.3]
            text-[#171717]
          "
        >
          Triagem
        </h3>

        <p
          className="
            mt-[10px]
            text-[12px]
            leading-[1.45]
            text-[#716B67]
          "
        >
          Evidência e localização disponíveis para revisão.
        </p>
      </div>

      {reviewHref ? (
        <Button
          href={reviewHref}
          className="
            mt-[14px]
            w-full
            shrink-0
          "
        >
          Revisar ocorrência
        </Button>
      ) : null}
    </aside>
  );
}