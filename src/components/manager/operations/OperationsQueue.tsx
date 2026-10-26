import { OperationsQueueCard } from "@/components/manager/operations/OperationsQueueCard";
import { FilterButton } from "@/components/ui/FilterButton";
import type { OperationalOccurrence } from "@/types/operations";

type OperationsQueueProps = {
  occurrences: OperationalOccurrence[];
  selectedOccurrenceId: string | null;
  onSelectOccurrence: (occurrenceId: string) => void;
};

export function OperationsQueue({
  occurrences,
  selectedOccurrenceId,
  onSelectOccurrence,
}: OperationsQueueProps) {
  return (
    <section
      aria-labelledby="operations-queue-title"
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
        p-4
        lg:h-full
        lg:min-h-0
      "
    >
      <div
        className="
          flex
          shrink-0
          items-start
          justify-between
          gap-3
        "
      >
        <div className="min-w-0">
          <h2
            id="operations-queue-title"
            className="
              text-[20px]
              font-bold
              leading-[1.2]
              text-[#171717]
            "
          >
            Atenção agora
          </h2>

          <p
            className="
              mt-1
              text-[12px]
              leading-[1.35]
              text-[#716B67]
            "
          >
            Fila operacional priorizada
          </p>
        </div>

        <FilterButton label="Filtros" disabled />
      </div>

      <div
        className="
          mt-[18px]
          flex
          min-h-0
          flex-1
          flex-col
          gap-[10px]
          overflow-y-auto
          pr-1
        "
      >
        {occurrences.length === 0 ? (
          <div
            className="
              rounded-[12px]
              border
              border-dashed
              border-[#E9E0D4]
              px-4
              py-8
              text-center
              text-[12px]
              text-[#716B67]
            "
          >
            Nenhuma ocorrência aguardando triagem.
          </div>
        ) : (
          occurrences.map((occurrence) => (
            <OperationsQueueCard
              key={occurrence.id}
              occurrence={occurrence}
              selected={occurrence.id === selectedOccurrenceId}
              onSelect={() => onSelectOccurrence(occurrence.id)}
              className="h-[106px]"
            />
          ))
        )}
      </div>
    </section>
  );
}