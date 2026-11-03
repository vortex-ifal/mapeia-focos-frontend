import clsx from "clsx";

import { Button } from "@/components/ui/Button";
import { getPriorityLabel } from "@/controllers/manager/priority.controller";
import type { OperationalPriority } from "@/types/operations";

const priorityOptions: OperationalPriority[] = ["low", "medium", "high"];

type PriorityActionPanelProps = {
  selectedPriority: OperationalPriority | null;
  saving: boolean;
  disabled?: boolean;
  errorMessage?: string | null;
  onSelect: (priority: OperationalPriority) => void;
  onSubmit: () => void;
};

export function PriorityActionPanel({
  selectedPriority,
  saving,
  disabled = false,
  errorMessage,
  onSelect,
  onSubmit,
}: PriorityActionPanelProps) {
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
      <fieldset disabled={disabled || saving}>
        <legend
          className="
            text-[20px]
            font-bold
            leading-[26px]
            text-[#171717]
          "
        >
          Prioridade
        </legend>

        <div className="mt-[10px] flex flex-col items-start gap-[10px]">
          {priorityOptions.map((priority) => {
            const selected = selectedPriority === priority;

            return (
              <label
                key={priority}
                className={clsx(
                  `
                    relative
                    flex
                    h-9
                    cursor-pointer
                    items-center
                    rounded-full
                    bg-[#FAEBC8]
                    px-3
                    text-[12px]
                    font-semibold
                    transition
                    focus-within:outline-none
                    focus-within:ring-2
                    focus-within:ring-[#C94F32]
                    focus-within:ring-offset-2
                    hover:bg-[#F6DFAB]
                  `,
                  priority === "high" ? "text-[#171717]" : "text-[#9A6510]",
                  selected && "ring-2 ring-[#C94F32] ring-offset-2",
                  (disabled || saving) && "cursor-not-allowed opacity-50",
                )}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={selected}
                  onChange={() => onSelect(priority)}
                  className="sr-only"
                />

                {getPriorityLabel(priority)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {errorMessage ? (
        <div
          role="alert"
          className="
            mt-4
            rounded-[10px]
            bg-[#F8E3E0]
            px-3
            py-2
          "
        >
          <p className="text-[12px] leading-5 text-[#9D352D]">{errorMessage}</p>
        </div>
      ) : null}

      <Button
        type="button"
        disabled={!selectedPriority || disabled}
        loading={saving}
        onClick={onSubmit}
        className="mt-[10px] w-[220px] max-w-full"
      >
        Definir prioridade
      </Button>
    </section>
  );
}