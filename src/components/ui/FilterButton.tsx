import clsx from "clsx";

type FilterButtonProps = {
  label?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function FilterButton({
  label = "Filtro",
  active = false,
  disabled = false,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        `
          flex
          h-10
          w-fit
          shrink-0
          items-center
          justify-center
          rounded-[12px]
          border
          border-[#E9E0D4]
          px-3
          text-[12px]
          font-semibold
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#C94F32]
          focus-visible:ring-offset-2
        `,
        active ? "bg-[#F4EFE6] text-[#584A57]" : "bg-white text-[#171717]",
        disabled ? "cursor-default" : "hover:bg-[#F4EFE6]",
      )}
    >
      {label}
    </button>
  );
}