import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

export function Button({
  children,
  variant = "primary",
  href,
  disabled = false,
  loading = false,
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = clsx(
    `
      flex
      h-12
      items-center
      justify-center
      rounded-[12px]
      px-4
      text-center
      text-[14px]
      font-bold
      no-underline
      transition
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-[#C94F32]
      focus-visible:ring-offset-2
    `,
    variant === "primary"
      ? `
          bg-[#C94F32]
          text-white
          hover:bg-[#B9472E]
          active:scale-[0.99]
        `
      : `
          border
          border-[#E9E0D4]
          bg-white
          text-[#171717]
          hover:bg-[#F4EFE6]
          active:scale-[0.99]
        `,
    isDisabled && "cursor-not-allowed opacity-50",
    className,
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  if (href && isDisabled) {
    return (
      <span
        aria-disabled="true"
        aria-busy={loading || undefined}
        className={classes}
      >
        {loading ? "Carregando..." : children}
      </span>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={classes}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}