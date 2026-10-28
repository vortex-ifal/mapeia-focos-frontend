import clsx from "clsx";

type StatusBadgeProps = {
  label: string;
  className?: string;
};

export function StatusBadge({ label, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "flex h-9 w-fit items-center rounded-full bg-[#EEE8ED] px-3 text-[12px] font-semibold text-[#584A57]",
        className,
      )}
    >
      {label}
    </span>
  );
}
