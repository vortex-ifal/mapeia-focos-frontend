"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { INSPECTION_CONDITION_OPTIONS } from "@/controllers/agent/inspection.controller";
import {
  inspectionRegistrationSchema,
  type InspectionRegistrationFormData,
} from "@/schemas/inspection.schema";
import type { InspectionApiResponse, InspectionDraft } from "@/types/inspection";

type InspectionRegistrationStepProps = {
  street: string;
  summaryContext: string;
  draft: InspectionDraft;
  remoteDraft: InspectionApiResponse | null;
  isSavingDraft: boolean;
  draftError: string | null;
  draftSavedAtMessage: string | null;
  onDraftFieldsChange: (values: InspectionRegistrationFormData) => void;
  onSaveDraft: (values: InspectionRegistrationFormData) => Promise<void>;
  onProceedToOutcome: (values: InspectionRegistrationFormData) => void;
};

export function InspectionRegistrationStep({
  street,
  summaryContext,
  draft,
  remoteDraft,
  isSavingDraft,
  draftError,
  draftSavedAtMessage,
  onDraftFieldsChange,
  onSaveDraft,
  onProceedToOutcome,
}: InspectionRegistrationStepProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm<InspectionRegistrationFormData>({
    resolver: zodResolver(inspectionRegistrationSchema),
    defaultValues: {
      condition: draft.condition,
      actionsTaken: draft.actionsTaken,
      notes: draft.notes,
    },
  });

  // Merge remote draft values into fields that the agent has not edited locally.
  useEffect(() => {
    if (!remoteDraft) {
      return;
    }

    const currentValues = getValues();

    if (
      !dirtyFields.condition &&
      !currentValues.condition &&
      remoteDraft.condition
    ) {
      setValue("condition", remoteDraft.condition, { shouldDirty: false });
    }

    if (
      !dirtyFields.actionsTaken &&
      !currentValues.actionsTaken &&
      remoteDraft.actionsTaken
    ) {
      setValue("actionsTaken", remoteDraft.actionsTaken, {
        shouldDirty: false,
      });
    }

    if (!dirtyFields.notes && !currentValues.notes && remoteDraft.notes) {
      setValue("notes", remoteDraft.notes, { shouldDirty: false });
    }
  }, [remoteDraft, dirtyFields, getValues, setValue]);

  const watchedValues = useWatch({ control });
  const selectedCondition = watchedValues.condition ?? "";

  useEffect(() => {
    onDraftFieldsChange({
      condition: watchedValues.condition ?? "",
      actionsTaken: watchedValues.actionsTaken ?? "",
      notes: watchedValues.notes ?? "",
    });
  }, [
    watchedValues.condition,
    watchedValues.actionsTaken,
    watchedValues.notes,
    onDraftFieldsChange,
  ]);

  const conditionOptions = useMemo(() => {
    const baseOptions: string[] = [...INSPECTION_CONDITION_OPTIONS];
    if (
      selectedCondition &&
      !baseOptions.includes(selectedCondition)
    ) {
      return [selectedCondition, ...baseOptions];
    }
    return baseOptions;
  }, [selectedCondition]);

  function handleSaveDraftClick() {
    const current = getValues();
    void onSaveDraft({
      condition: current.condition ?? "",
      actionsTaken: current.actionsTaken ?? "",
      notes: current.notes ?? "",
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onProceedToOutcome)}
      className="flex flex-1 flex-col gap-3.5"
    >
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
            className={`w-full appearance-none bg-transparent pr-7 text-[14px] outline-none ${
              selectedCondition ? "text-[#171717]" : "text-[#716B67]"
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

      {draftSavedAtMessage ? (
        <p role="status" className="text-center text-[12px] text-[#716B67]">
          {draftSavedAtMessage}
        </p>
      ) : null}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <button
          type="button"
          disabled={isSavingDraft}
          aria-busy={isSavingDraft || undefined}
          onClick={handleSaveDraftClick}
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
      </div>
    </form>
  );
}
