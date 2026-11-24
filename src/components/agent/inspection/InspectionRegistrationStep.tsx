"use client";

import { ChevronDown } from "lucide-react";
import type { FormEventHandler } from "react";
import { useMemo } from "react";
import {
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { INSPECTION_CONDITION_OPTIONS } from "@/controllers/agent/inspection.controller";
import type { InspectionRegistrationFormData } from "@/schemas/inspection.schema";

type InspectionRegistrationStepProps = {
  street: string;
  summaryContext: string;
  register: UseFormRegister<InspectionRegistrationFormData>;
  control: Control<InspectionRegistrationFormData>;
  errors: FieldErrors<InspectionRegistrationFormData>;
  isSavingDraft: boolean;
  isDraftSaved: boolean;
  draftError: string | null;
  draftLoadError: string | null;
  onRetryDraftLoad: () => void;
  onSaveDraft: () => void;
  onDiscardDraft: () => void;
  onFormChange: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function InspectionRegistrationStep({
  street,
  summaryContext,
  register,
  control,
  errors,
  isSavingDraft,
  isDraftSaved,
  draftError,
  draftLoadError,
  onRetryDraftLoad,
  onSaveDraft,
  onDiscardDraft,
  onFormChange,
  onSubmit,
}: InspectionRegistrationStepProps) {
  const selectedCondition =
    useWatch({
      control,
      name: "condition",
    }) ?? "";

  const conditionOptions = useMemo(() => {
    const baseOptions: string[] = [...INSPECTION_CONDITION_OPTIONS];
    if (selectedCondition && !baseOptions.includes(selectedCondition)) {
      return [selectedCondition, ...baseOptions];
    }
    return baseOptions;
  }, [selectedCondition]);

  return (
    <form
      noValidate
      onChange={onFormChange}
      onSubmit={onSubmit}
      className="flex flex-1 flex-col gap-3.5"
    >
      {draftLoadError ? (
        <div
          role="alert"
          className="rounded-[12px] bg-[#F8E3E0] px-3.5 py-2.5 text-[12px] text-[#9D352D]"
        >
          <p>{draftLoadError}</p>
          <button
            type="button"
            onClick={onRetryDraftLoad}
            className="mt-1.5 text-[12px] font-bold text-[#9D352D] underline underline-offset-2"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {/* Occurrence summary card */}
      <section
        aria-label="Resumo da ocorrência"
        className="min-h-[88px] rounded-[14px] border border-[#E9E0D4] bg-white px-4 py-3.5"
      >
        <h2 className="text-[15px] font-extrabold leading-snug text-[#171717]">
          {street}
        </h2>
        <p className="mt-1 text-[12px] leading-relaxed text-[#716B67]">
          {summaryContext}
        </p>
      </section>

      {/* Condition select field */}
      <div className="rounded-[14px] border border-[#E9E0D4] bg-white px-4 py-3">
        <label
          htmlFor="inspection-condition"
          className="block text-[12px] font-semibold text-[#716B67]"
        >
          Condição encontrada
        </label>

        <div className="relative mt-2 flex items-center">
          <select
            id="inspection-condition"
            {...register("condition")}
            aria-invalid={Boolean(errors.condition)}
            aria-describedby={
              errors.condition ? "inspection-condition-error" : undefined
            }
            className={`w-full appearance-none bg-transparent pr-7 text-[14px] outline-none ${selectedCondition ? "text-[#171717]" : "text-[#716B67]"
              }`}
          >
            <option value="" disabled>
              Escolha uma opção
            </option>
            {conditionOptions.map((option) => (
              <option key={option} value={option} className="text-[#171717]">
                {option}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 text-[#171717]"
          />
        </div>

        {errors.condition ? (
          <p
            id="inspection-condition-error"
            role="alert"
            className="mt-2 text-[12px] text-[#9D352D]"
          >
            {errors.condition.message}
          </p>
        ) : null}
      </div>

      {/* Actions taken textarea */}
      <div className="rounded-[14px] border border-[#E9E0D4] bg-white px-4 py-3">
        <label
          htmlFor="inspection-actions"
          className="block text-[12px] font-semibold text-[#716B67]"
        >
          Ações realizadas
        </label>

        <textarea
          id="inspection-actions"
          rows={3}
          maxLength={1000}
          {...register("actionsTaken")}
          placeholder="Registre as ações executadas"
          aria-invalid={Boolean(errors.actionsTaken)}
          aria-describedby={
            errors.actionsTaken ? "inspection-actions-error" : undefined
          }
          className="mt-2 min-h-[76px] w-full resize-none bg-transparent text-[14px] leading-relaxed text-[#171717] outline-none placeholder:text-[#716B67]"
        />

        {errors.actionsTaken ? (
          <p
            id="inspection-actions-error"
            role="alert"
            className="mt-1.5 text-[12px] text-[#9D352D]"
          >
            {errors.actionsTaken.message}
          </p>
        ) : null}
      </div>

      {/* Notes textarea */}
      <div className="rounded-[14px] border border-[#E9E0D4] bg-white px-4 py-3">
        <label
          htmlFor="inspection-notes"
          className="block text-[12px] font-semibold text-[#716B67]"
        >
          Observações
        </label>

        <textarea
          id="inspection-notes"
          rows={3}
          maxLength={1000}
          {...register("notes")}
          placeholder="Adicione observações relevantes"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={
            errors.notes ? "inspection-notes-error" : undefined
          }
          className="mt-2 min-h-[76px] w-full resize-none bg-transparent text-[14px] leading-relaxed text-[#171717] outline-none placeholder:text-[#716B67]"
        />

        {errors.notes ? (
          <p
            id="inspection-notes-error"
            role="alert"
            className="mt-1.5 text-[12px] text-[#9D352D]"
          >
            {errors.notes.message}
          </p>
        ) : null}
      </div>

      {draftError ? (
        <p
          role="alert"
          className="rounded-[12px] bg-[#F8E3E0] px-3.5 py-2.5 text-[12px] text-[#9D352D]"
        >
          {draftError}
        </p>
      ) : null}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <button
          type="button"
          disabled={isSavingDraft}
          aria-busy={isSavingDraft || undefined}
          onClick={onSaveDraft}
          className="flex h-[50px] w-full items-center justify-center rounded-[14px] border border-[#E9E0D4] bg-white px-4 text-center text-[15px] font-bold text-[#171717] transition hover:bg-[#F4EFE6] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSavingDraft ? "Salvando rascunho..." : "Salvar rascunho"}
        </button>

        <button
          type="submit"
          className="flex h-[50px] w-full items-center justify-center rounded-[14px] bg-[#C94F32] px-4 text-center text-[15px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] focus-visible:ring-offset-2"
        >
          Definir desfecho
        </button>

        {isDraftSaved ? (
          <FeedbackAlert className="mt-0.5">
            <span className="block">
              Rascunho salvo. Você pode continuar antes da conclusão.
            </span>
            <button
              type="button"
              onClick={onDiscardDraft}
              className="mt-1.5 inline-block text-[12px] font-bold text-[#9D352D] underline underline-offset-2 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32]"
            >
              Descartar rascunho
            </button>
          </FeedbackAlert>
        ) : null}
      </div>
    </form>
  );
}
