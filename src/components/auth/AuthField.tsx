import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type AuthFieldProps = {
  id: string;
  label: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function AuthField({
  id,
  label,
  error,
  className,
  ...inputProps
}: AuthFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <div
        className={clsx(
          `
            flex
            min-h-[72px]
            flex-col
            justify-center
            rounded-[10px]
            border
            bg-white
            px-[13px]
            py-[10px]
            transition
            focus-within:border-[#C94F32]
            focus-within:ring-1
            focus-within:ring-[#C94F32]/15
          `,
          error ? "border-[#9D352D]" : "border-[#E9E0D4]",
          className,
        )}
      >
        <label
          htmlFor={id}
          className="mb-1 text-[11px] leading-4 text-[#584A57]"
        >
          {label}
        </label>

        <input
          {...inputProps}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="
            min-h-[22px]
            w-full
            border-0
            bg-transparent
            p-0
            text-[12px]
            leading-[18px]
            text-[#171717]
            outline-none
            placeholder:text-[#716B67]
          "
        />
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1 text-[11px] leading-4 text-[#9D352D]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}