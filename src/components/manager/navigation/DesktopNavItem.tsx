import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

type DesktopNavItemProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  href?: string;
};

export function DesktopNavItem({
  label,
  icon: Icon,
  active = false,
  href,
}: DesktopNavItemProps) {
  const classes = clsx(
    `
      flex
      h-12
      w-12
      shrink-0
      items-center
      justify-center
      rounded-[12px]
      text-[#584A57]
      transition-colors
      focus-visible:outline-none
    `,
    active
      ? `
          bg-[#F8E3E0]
          text-[#C94F32]
        `
      : href
        ? `
            border
            border-[#E9E0D4]
            bg-white
            hover:border-transparent
            hover:bg-[#F4EFE6]
            focus-visible:ring-2
            focus-visible:ring-[#C94F32]
          `
        : `
            cursor-default
            border
            border-[#E9E0D4]
            bg-white
          `,
  );

  const content = <Icon size={20} strokeWidth={1.8} aria-hidden="true" />;

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        title={label}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-label={label}
      title={`${label} — indisponível nesta entrega`}
      className={classes}
    >
      {content}
    </button>
  );
}