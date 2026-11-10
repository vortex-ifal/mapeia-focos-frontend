import clsx from "clsx";

import type { AgentPriorityItem } from "@/types/agent-priorities";

type DayPriorityCardProps = {
  occurrence: AgentPriorityItem;
};

export function DayPriorityCard({ occurrence }: DayPriorityCardProps) {
  const highPriority = occurrence.priority === "high";

  return (
    <article
      className={clsx(
        `
          w-full
          rounded-[12px]
          border
          px-[15px]
          py-[14px]
        `,
        highPriority
          ? `
              border-[#C94F32]
              bg-[#FAEBC8]
            `
          : `
              border-[#E9E0D4]
              bg-white
            `,
      )}
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-[13px]
            font-extrabold
            leading-[17px]
            text-[#171717]
          "
        >
          {occurrence.displayCode}
        </p>

        <PriorityLabel
          priority={occurrence.priority}
          label={occurrence.priorityLabel}
        />
      </div>

      <p
        className="
          mt-2
          text-[13px]
          font-semibold
          leading-[17px]
          text-[#171717]
        "
      >
        {occurrence.region}
      </p>

      <p
        className="
          mt-[5px]
          text-[12px]
          leading-4
          text-[#584A57]
        "
      >
        {occurrence.statusLabel}
      </p>

      <div
        className="
          mt-3
          border-t
          border-[#E9E0D4]
          pt-3
        "
      >
        <p
          className="
            text-[11px]
            leading-[15px]
            text-[#716B67]
          "
        >
          Próxima ação
        </p>

        <p
          className="
            mt-[2px]
            text-[12px]
            font-bold
            leading-4
            text-[#171717]
          "
        >
          {occurrence.actionLabel}
        </p>
      </div>
    </article>
  );
}

type PriorityLabelProps = {
  priority: AgentPriorityItem["priority"];
  label: string;
};

function PriorityLabel({ priority, label }: PriorityLabelProps) {
  return (
    <span
      className={clsx(
        `
          flex
          min-h-7
          shrink-0
          items-center
          rounded-full
          px-3
          text-[10px]
          font-bold
          leading-none
        `,
        priority === "high" &&
          `
            bg-[#C94F32]
            text-white
          `,
        priority === "medium" &&
          `
            bg-[#F4EFE6]
            text-[#584A57]
          `,
        priority === "low" &&
          `
            bg-[#EEE8ED]
            text-[#584A57]
          `,
        !priority &&
          `
            bg-[#F4EFE6]
            text-[#716B67]
          `,
      )}
    >
      {label}
    </span>
  );
}