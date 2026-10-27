import type { ReactNode } from "react";
import clsx from "clsx";

type FeedbackAlertProps = {
  children: ReactNode;
  className?: string;
};

export function FeedbackAlert({ children, className }: FeedbackAlertProps) {
  return (
    <div
      className={clsx(
        `
          flex
          min-h-[78px]
          w-full
          items-center
          rounded-[10px]
          bg-[#EEE8ED]
          px-[13px]
          py-3
        `,
        className,
      )}
    >
      <p
        className="
          text-[12px]
          leading-[1.45]
          text-[#584A57]
        "
      >
        {children}
      </p>
    </div>
  );
}