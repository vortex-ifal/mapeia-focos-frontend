import clsx from "clsx";

export const DEFAULT_TIMELINE_STEPS = [
  "Registrada",
  "Em análise",
  "Vistoria prevista",
  "Resolvida",
] as const;

export const REJECTED_TIMELINE_STEPS = [
  "Registrada",
  "Em análise",
  "Reprovada",
] as const;

interface OccurrenceTimelineProps {
  steps?: readonly string[];
  currentStepIndex: number;
  activeDotClassName?: string;
  className?: string;
}

export function OccurrenceTimeline({
  steps = DEFAULT_TIMELINE_STEPS,
  currentStepIndex,
  activeDotClassName = "bg-[#584A57]",
  className,
}: OccurrenceTimelineProps) {
  return (
    <div
      role="region"
      aria-label="Linha do tempo do progresso"
      className={clsx(
        "flex w-full flex-col gap-[10px] rounded-[12px] border border-[#E9E0D4] bg-white p-[12px]",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-[10px]">
        {steps.map((stepLabel, index) => {
          const isCurrent = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const isReached = isCurrent || isPast;

          return (
            <div
              key={stepLabel}
              className="flex items-center gap-[8px]"
            >
              <span
                aria-hidden="true"
                className={clsx(
                  "h-[10px] w-[10px] shrink-0 rounded-full transition-colors",
                  isCurrent
                    ? activeDotClassName
                    : isPast
                      ? "bg-[#584A57]"
                      : "bg-[#E9E0D4]",
                )}
              />
              <span
                className={clsx(
                  "text-[12px] leading-[16px]",
                  isReached
                    ? "font-medium text-[#171717]"
                    : "font-normal text-[#716B67]",
                )}
              >
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
