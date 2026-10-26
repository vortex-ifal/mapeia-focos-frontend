import clsx from "clsx";

import { formatWaitingTime } from "@/controllers/manager/operations.controller";
import type { OperationalOccurrence } from "@/types/operations";

type OperationsQueueCardProps = {
  occurrence: OperationalOccurrence;
  selected: boolean;
  onSelect: () => void;
  className?: string;
};

export function OperationsQueueCard({
  occurrence,
  selected,
  onSelect,
  className,
}: OperationsQueueCardProps) {
  const secondaryLabel = occurrence.neighborhood
    ? `${occurrence.status.name} · ${occurrence.neighborhood}`
    : occurrence.status.name;

  const waitingLabel = occurrence.nextAction
    ? `${formatWaitingTime(
        occurrence.waitingMinutes,
      )} · próxima ação: ${occurrence.nextAction}`
    : formatWaitingTime(occurrence.waitingMinutes);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      title={occurrence.id}
      className={clsx(
        `
          flex
          min-h-[83px]
          w-full
          shrink-0
          flex-col
          gap-[5px]
          rounded-[12px]
          px-[14px]
          py-3
          text-left
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#C94F32]
          focus-visible:ring-offset-2
        `,
        selected
          ? `
              border-2
              border-[#C94F32]
              bg-[#FAEBC8]
            `
          : `
              border
              border-[#E9E0D4]
              bg-white
              hover:bg-[#FBF8F2]
            `,
        className,
      )}
    >
      <span
        className="
          w-full
          overflow-hidden
          text-ellipsis
          whitespace-nowrap
          text-[13px]
          font-bold
          leading-[17px]
          text-[#171717]
        "
      >
        {occurrence.displayCode}
      </span>

      <span
        className="
          w-full
          overflow-hidden
          text-ellipsis
          whitespace-nowrap
          text-[12px]
          font-semibold
          leading-4
          text-[#171717]
        "
      >
        {secondaryLabel}
      </span>

      <span
        className="
          w-full
          overflow-hidden
          text-ellipsis
          whitespace-nowrap
          text-[11px]
          leading-[14px]
          text-[#716B67]
        "
      >
        {waitingLabel}
      </span>
    </button>
  );
}