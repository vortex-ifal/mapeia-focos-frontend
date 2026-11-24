"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { InspectionRegistrationStep } from "@/components/agent/inspection/InspectionRegistrationStep";
import {
  canStartInspection,
  getAgentOccurrenceDetailsPath,
  getLocationDetails,
} from "@/controllers/agent/agent-occurrence-details.controller";
import {
  clearLocalInspectionDraft,
  formatInspectionHeaderTitle,
  formatInspectionSummaryContext,
  getEmptyInspectionDraft,
  getLocalInspectionDraft,
  mergeRemoteWithLocalDraft,
  saveLocalInspectionDraft,
} from "@/controllers/agent/inspection.controller";
import {
  inspectionRegistrationSchema,
  type InspectionRegistrationFormData,
} from "@/schemas/inspection.schema";
import {
  getInspectionDraft,
  saveInspectionDraft,
} from "@/services/api/inspection.service";
import { getOccurrenceDetails } from "@/services/api/occurrence-details.service";
import type { InspectionDraft, InspectionStep } from "@/types/inspection";

type InspectionFlowProps = {
  occurrenceId: string;
};

export function InspectionFlow({ occurrenceId }: InspectionFlowProps) {
  const router = useRouter();

  const [step, setStep] = useState<InspectionStep>("register");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftLoadError, setDraftLoadError] = useState<string | null>(null);
  const [draftFetchTrigger, setDraftFetchTrigger] = useState(0);

  const hasLocalDraftRef = useRef(false);
  const hasHydratedRemoteRef = useRef(false);

  const occurrenceDetailsPath = getAgentOccurrenceDetailsPath(occurrenceId);

  const {
    register,
    handleSubmit,
    getValues,
    getFieldState,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<InspectionRegistrationFormData>({
    resolver: zodResolver(inspectionRegistrationSchema),
    defaultValues: getEmptyInspectionDraft(),
  });

  const occurrenceQuery = useQuery({
    queryKey: ["agent", "occurrence", occurrenceId],
    queryFn: () => getOccurrenceDetails(occurrenceId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const occurrence = occurrenceQuery.data;
  const canInspect = occurrence ? canStartInspection(occurrence.status) : true;

  // Hydrate from sessionStorage once on client mount to avoid SSR hydration mismatches.
  useEffect(() => {
    const localDraft = getLocalInspectionDraft(occurrenceId);
    if (localDraft !== null) {
      hasLocalDraftRef.current = true;
      reset(localDraft);
    }
  }, [occurrenceId, reset]);

  // Keep sessionStorage synced and clear saved-draft notice when user edits fields.
  const handleFormChange = useCallback(() => {
    const currentValues = getValues();
    hasLocalDraftRef.current = true;
    setIsDraftSaved(false);
    setDraftError(null);

    saveLocalInspectionDraft(occurrenceId, {
      condition: currentValues.condition ?? "",
      actionsTaken: currentValues.actionsTaken ?? "",
      notes: currentValues.notes ?? "",
    });
  }, [getValues, occurrenceId]);

  // Fetch remote draft once the occurrence is confirmed eligible for inspection.
  useEffect(() => {
    if (!occurrence || !canInspect || hasHydratedRemoteRef.current) {
      return;
    }

    let cancelled = false;

    getInspectionDraft(occurrenceId)
      .then((remote) => {
        if (cancelled) {
          return;
        }

        setDraftLoadError(null);
        hasHydratedRemoteRef.current = true;

        if (!remote || hasLocalDraftRef.current) {
          return;
        }

        const merged = mergeRemoteWithLocalDraft(null, remote);

        if (!getFieldState("condition").isDirty && merged.condition) {
          setValue("condition", merged.condition, { shouldDirty: false });
        }
        if (!getFieldState("actionsTaken").isDirty && merged.actionsTaken) {
          setValue("actionsTaken", merged.actionsTaken, { shouldDirty: false });
        }
        if (!getFieldState("notes").isDirty && merged.notes) {
          setValue("notes", merged.notes, { shouldDirty: false });
        }

        const hasRemoteContent = Boolean(
          merged.condition || merged.actionsTaken || merged.notes,
        );
        if (
          hasRemoteContent &&
          !getFieldState("condition").isDirty &&
          !getFieldState("actionsTaken").isDirty &&
          !getFieldState("notes").isDirty
        ) {
          setIsDraftSaved(true);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setDraftLoadError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o rascunho salvo.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [
    occurrence,
    canInspect,
    occurrenceId,
    draftFetchTrigger,
    getFieldState,
    setValue,
  ]);

  const handleRetryDraftLoad = useCallback(() => {
    setDraftLoadError(null);
    hasHydratedRemoteRef.current = false;
    setDraftFetchTrigger((previous) => previous + 1);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    if (isSavingDraft) {
      return;
    }

    const currentValues = getValues();
    const hasAnyValue =
      currentValues.condition.trim().length > 0 ||
      currentValues.actionsTaken.trim().length > 0 ||
      currentValues.notes.trim().length > 0;

    if (!hasAnyValue) {
      toast.info("Preencha ao menos um campo antes de salvar o rascunho.");
      return;
    }

    setDraftError(null);
    setIsSavingDraft(true);

    const draftPayload: InspectionDraft = {
      condition: currentValues.condition,
      actionsTaken: currentValues.actionsTaken,
      notes: currentValues.notes,
    };

    hasLocalDraftRef.current = true;
    saveLocalInspectionDraft(occurrenceId, draftPayload);

    try {
      await saveInspectionDraft(occurrenceId, draftPayload);
      setIsDraftSaved(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o rascunho na API.";
      setIsDraftSaved(false);
      setDraftError(message);
    } finally {
      setIsSavingDraft(false);
    }
  }, [getValues, isSavingDraft, occurrenceId]);

  const handleDiscardDraft = useCallback(() => {
    clearLocalInspectionDraft(occurrenceId);
    hasLocalDraftRef.current = false;
    hasHydratedRemoteRef.current = true;
    setIsDraftSaved(false);
    setDraftError(null);
    setDraftLoadError(null);
    reset(getEmptyInspectionDraft());
    toast.info("Rascunho descartado.");
  }, [occurrenceId, reset]);

  const handleProceedToOutcome = useCallback(
    (values: InspectionRegistrationFormData) => {
      setDraftError(null);
      const validatedDraft: InspectionDraft = {
        condition: values.condition.trim(),
        actionsTaken: values.actionsTaken.trim(),
        notes: values.notes.trim(),
      };
      saveLocalInspectionDraft(occurrenceId, validatedDraft);
      setStep("outcome_placeholder");
    },
    [occurrenceId],
  );

  function handleHeaderBack() {
    setDraftError(null);

    if (step === "outcome_placeholder") {
      setStep("register");
      return;
    }

    router.push(occurrenceDetailsPath);
  }

  const headerTitle =
    step === "register"
      ? occurrenceQuery.isPending
        ? "Carregando vistoria..."
        : formatInspectionHeaderTitle(occurrence?.protocol)
      : "Definir desfecho";

  const street = occurrence
    ? getLocationDetails(occurrence).street
    : "Endereço não informado";
  const summaryContext = occurrence
    ? formatInspectionSummaryContext(occurrence)
    : "Localização da ocorrência";

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-[18px] pb-8 pt-4 max-[360px]:px-4">
        <header className="flex h-12 items-center gap-3">
          <button
            type="button"
            onClick={handleHeaderBack}
            aria-label="Voltar"
            title="Voltar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white text-[#171717] shadow-sm transition-colors hover:bg-[#F4EFE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] focus-visible:ring-offset-2"
          >
            <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <h1 className="text-[18px] font-extrabold leading-tight tracking-[-0.2px] text-[#171717]">
            {headerTitle}
          </h1>
        </header>

        {occurrenceQuery.isPending ? (
          <div className="mt-5 rounded-[14px] border border-[#E9E0D4] bg-white p-6 text-center text-[13px] text-[#716B67]">
            Carregando informações da ocorrência...
          </div>
        ) : null}

        {occurrenceQuery.isError ? (
          <div
            role="alert"
            className="mt-5 rounded-[14px] border border-[#F8E3E0] bg-[#F8E3E0] p-4 text-left"
          >
            <p className="text-[13px] leading-5 text-[#9D352D]">
              {occurrenceQuery.error instanceof Error
                ? occurrenceQuery.error.message
                : "Não foi possível carregar os dados da ocorrência."}
            </p>

            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  void occurrenceQuery.refetch();
                }}
                className="text-[12px] font-bold text-[#9D352D] underline underline-offset-2"
              >
                Tentar novamente
              </button>

              <Link
                href={occurrenceDetailsPath}
                className="text-[12px] font-semibold text-[#716B67] underline underline-offset-2"
              >
                Voltar aos detalhes
              </Link>
            </div>
          </div>
        ) : null}

        {occurrence && !canInspect ? (
          <div
            role="alert"
            className="mt-5 rounded-[14px] border border-[#E9E0D4] bg-white p-5"
          >
            <h2 className="text-[15px] font-bold text-[#171717]">
              Vistoria indisponível
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#716B67]">
              A vistoria só pode ser registrada quando a ocorrência estiver
              encaminhada para vistoria.
            </p>
            <Link
              href={occurrenceDetailsPath}
              className="mt-4 flex h-[48px] w-full items-center justify-center rounded-[14px] border border-[#E9E0D4] bg-white px-4 text-[14px] font-bold text-[#171717] no-underline transition hover:bg-[#F4EFE6]"
            >
              Voltar aos detalhes
            </Link>
          </div>
        ) : null}

        {occurrence && canInspect ? (
          <div className="mt-4 flex flex-1 flex-col">
            {step === "register" ? (
              <InspectionRegistrationStep
                street={street}
                summaryContext={summaryContext}
                register={register}
                control={control}
                errors={errors}
                isSavingDraft={isSavingDraft}
                isDraftSaved={isDraftSaved}
                draftError={draftError}
                draftLoadError={draftLoadError}
                onRetryDraftLoad={handleRetryDraftLoad}
                onSaveDraft={() => {
                  void handleSaveDraft();
                }}
                onDiscardDraft={handleDiscardDraft}
                onFormChange={handleFormChange}
                onSubmit={handleSubmit(handleProceedToOutcome)}
              />
            ) : (
              <section
                aria-label="Etapa de desfecho em desenvolvimento"
                className="flex flex-1 flex-col justify-between gap-4"
              >
                <div className="rounded-[14px] border border-[#E9E0D4] bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EFE6] text-[#C94F32]">
                    <Wrench size={20} aria-hidden="true" />
                  </div>

                  <h2 className="mt-3 text-[17px] font-extrabold text-[#171717]">
                    Em desenvolvimento
                  </h2>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#716B67]">
                    A seleção e a confirmação do desfecho da vistoria estão em
                    desenvolvimento e serão implementadas na continuação deste
                    fluxo.
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("register")}
                    className="flex h-[50px] w-full items-center justify-center rounded-[14px] bg-[#C94F32] px-4 text-center text-[15px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] focus-visible:ring-offset-2"
                  >
                    Voltar ao registro
                  </button>

                  <Link
                    href={occurrenceDetailsPath}
                    className="flex h-[50px] w-full items-center justify-center rounded-[14px] border border-[#E9E0D4] bg-white px-4 text-center text-[15px] font-bold text-[#171717] no-underline transition hover:bg-[#F4EFE6]"
                  >
                    Voltar aos detalhes
                  </Link>
                </div>
              </section>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
