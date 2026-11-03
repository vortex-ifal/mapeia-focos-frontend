import clsx from "clsx";

type StatusBadgeProps = {
  label: string;
  className?: string;
};

export function StatusBadge({ label, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "flex h-9 w-fit items-center rounded-full px-3 text-[12px] font-semibold",
        className ?? "bg-[#EEE8ED] text-[#584A57]",
      )}
    >
      {label}
    </span>
  );
}
