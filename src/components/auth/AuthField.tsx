"use client";

import { useState, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

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
  type,
  ...inputProps
}: AuthFieldProps) {
  const errorId = `${id}-error`;
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

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

        <div className="flex items-center justify-between gap-2">
          <input
            {...inputProps}
            id={id}
            type={inputType}
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

          {isPasswordField ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded
                text-[#716B67]
                transition-colors
                hover:text-[#171717]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
              "
            >
              {showPassword ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
            </button>
          ) : null}
        </div>
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
