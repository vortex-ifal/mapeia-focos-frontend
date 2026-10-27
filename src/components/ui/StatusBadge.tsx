type StatusBadgeProps = {
  label: string;
};

export function StatusBadge({ label }: StatusBadgeProps) {
  return (
    <span
      className="
        flex
        h-9
        w-fit
        items-center
        rounded-full
        bg-[#EEE8ED]
        px-3
        text-[12px]
        font-semibold
        text-[#584A57]
      "
    >
      {label}
    </span>
  );
}