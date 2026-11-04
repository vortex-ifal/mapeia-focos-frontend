import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPriorityStatusLabel } from "@/controllers/manager/priority.controller";
import type { PriorityOccurrence } from "@/types/priority";

type PriorityContextPanelProps = {
  occurrence: PriorityOccurrence;
};

export function PriorityContextPanel({
  occurrence,
}: PriorityContextPanelProps) {
  return (
    <section
      className="
        min-h-[360px]
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[17px]
        lg:h-full
      "
    >
      <h2
        className="
          text-[26px]
          font-extrabold
          leading-[33px]
          tracking-[-0.4px]
          text-[#171717]
        "
      >
        {occurrence.displayCode}
      </h2>

      <div className="mt-[10px]">
        <StatusBadge label={getPriorityStatusLabel(occurrence)} />
      </div>

      <p
        className="
          mt-[10px]
          max-w-[520px]
          text-[12px]
          leading-[18px]
          text-[#716B67]
        "
      >
        {occurrence.address}
      </p>

      <FeedbackAlert className="mt-[10px]">
        Defina a prioridade conforme sua avaliação operacional e o contexto
        disponível.
      </FeedbackAlert>
    </section>
  );
}