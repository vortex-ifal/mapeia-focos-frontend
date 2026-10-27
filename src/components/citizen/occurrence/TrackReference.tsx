"use client";

import { ArrowLeft, CircleAlert, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";

import {
  searchOccurrenceByProtocol,
  OccurrenceNotFoundError,
  OccurrenceValidationError,
  OccurrenceServerError,
} from "@/controllers/citizen/occurrence.controller";

export function TrackReference() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialReference = (
    searchParams.get("referencia") ||
    searchParams.get("codigo") ||
    ""
  ).toUpperCase();

  const [reference, setReference] = useState(initialReference);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setReference(event.target.value.toUpperCase());
    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = reference.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await searchOccurrenceByProtocol(trimmed);
      router.push(
        `/acompanhar-referencia/${encodeURIComponent(result.protocol)}`,
      );
    } catch (error: unknown) {
      if (error instanceof OccurrenceNotFoundError) {
        setErrorMessage(
          "Protocolo não encontrado. Verifique o código digitado.",
        );
      } else if (error instanceof OccurrenceValidationError) {
        setErrorMessage(error.message);
      } else if (error instanceof OccurrenceServerError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Não foi possível realizar a consulta. Tente novamente mais tarde.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isButtonDisabled = !reference.trim() || isLoading;

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div
        className="
          mx-auto
          flex
          min-h-dvh
          w-full
          flex-col
          px-[18px]
          pb-[22px]
          pt-[18px]
          md:max-w-[760px]
          md:px-8
          max-[360px]:px-4
        "
      >
        <header className="flex h-[52px] items-center">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white transition hover:bg-[#FDFCFA] active:scale-[0.98]"
          >
            <ArrowLeft size={20} className="text-[#171717]" />
          </button>

          <h1 className="ml-[10px] text-[18px] font-bold text-[#171717]">
            Acompanhar ocorrência
          </h1>
        </header>

        <section className="mt-[20px]">
          <p className="text-[14px] leading-[1.4] text-[#716B67]">
            Consulte o andamento pelo código de referência.
          </p>

          <form onSubmit={handleSubmit} className="mt-[16px]">
            <label className="relative block rounded-[14px] border border-[#E9E0D4] bg-white px-[14px] py-[10px] shadow-sm transition focus-within:border-[#C94F32] focus-within:ring-1 focus-within:ring-[#C94F32]">
              <span className="block text-[12px] font-semibold text-[#716B67]">
                Referência
              </span>

              <input
                id="reference-input"
                type="text"
                value={reference}
                onChange={handleChange}
                placeholder="MF-0248"
                disabled={isLoading}
                autoComplete="off"
                className="mt-[4px] w-full bg-transparent text-[15px] font-semibold text-[#171717] outline-none placeholder:text-[#A39B95] disabled:opacity-60"
              />
            </label>

            {errorMessage && (
              <div
                role="alert"
                className="mt-[14px] flex items-start gap-2 rounded-[12px] border border-[#F2C2B8] bg-[#FDF0ED] px-[14px] py-[12px] text-[13px] font-medium text-[#C94F32]"
              >
                <CircleAlert
                  size={18}
                  className="mt-0.5 shrink-0 text-[#C94F32]"
                />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isButtonDisabled}
              className="mt-[16px] flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#C94F32] px-4 text-center text-[14px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#C94F32]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Buscando ocorrência...</span>
                </span>
              ) : (
                "Buscar ocorrência"
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
