import clsx from "clsx";

import type { OperationalPriority } from "@/types/operations";

type PriorityBadgeProps = {
  value: OperationalPriority;
};

const priorityLabels: Record<OperationalPriority, string> = {
  low: "Prioridade baixa",
  medium: "Prioridade média",
  high: "Prioridade alta",
};

export function PriorityBadge({ value }: PriorityBadgeProps) {
  return (
    <span
      className={clsx(
        `
          flex
          h-9
          w-fit
          items-center
          rounded-full
          bg-[#FAEBC8]
          px-3
          text-[12px]
          font-semibold
        `,
        value === "high" ? "text-[#171717]" : "text-[#9A6510]",
      )}
    >
      {priorityLabels[value]}
    </span>
  );
}