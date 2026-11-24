"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { InspectionRegistrationStep } from "@/components/agent/inspection/InspectionRegistrationStep";
import {
  canStartInspection,
  getAgentOccurrenceDetailsPath,
  getLocationDetails,
} from "@/controllers/agent/agent-occurrence-details.controller";
import {
  formatInspectionHeaderTitle,
  formatInspectionSummaryContext,
  getLocalInspectionDraft,
  mergeRemoteWithLocalDraft,
  saveLocalInspectionDraft,
} from "@/controllers/agent/inspection.controller";
import type { InspectionRegistrationFormData } from "@/schemas/inspection.schema";
import {
  getInspectionDraft,
  saveInspectionDraft,
} from "@/services/api/inspection.service";
import { getOccurrenceDetails } from "@/services/api/occurrence-details.service";
import type {
  InspectionApiResponse,
  InspectionDraft,
  InspectionStep,
} from "@/types/inspection";

type InspectionFlowProps = {
  occurrenceId: string;
};

export function InspectionFlow({ occurrenceId }: InspectionFlowProps) {
  const router = useRouter();

  const [step, setStep] = useState<InspectionStep>("register");
  const [draft, setDraft] = useState<InspectionDraft>(() =>
    getLocalInspectionDraft(occurrenceId),
  );
  const [remoteDraft, setRemoteDraft] = useState<InspectionApiResponse | null>(
    null,
  );
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftSavedAtMessage, setDraftSavedAtMessage] = useState<string | null>(
    null,
  );

  const occurrenceDetailsPath = getAgentOccurrenceDetailsPath(occurrenceId);

  const occurrenceQuery = useQuery({
    queryKey: ["agent", "occurrence", occurrenceId],
    queryFn: () => getOccurrenceDetails(occurrenceId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    let cancelled = false;

    getInspectionDraft(occurrenceId)
      .then((remote) => {
        if (cancelled || !remote) {
          return;
        }
        setRemoteDraft(remote);
        setDraft((previous) => mergeRemoteWithLocalDraft(previous, remote));
      })
      .catch(() => {
        // Remote draft lookup is non-blocking; local session draft remains available.
      });

    return () => {
      cancelled = true;
    };
  }, [occurrenceId]);

  useEffect(() => {
    saveLocalInspectionDraft(occurrenceId, draft);
  }, [draft, occurrenceId]);

  const handleDraftFieldsChange = useCallback(
    (values: InspectionRegistrationFormData) => {
      setDraft((previous) => {
        if (
          previous.condition === values.condition &&
          previous.actionsTaken === values.actionsTaken &&
          previous.notes === values.notes
        ) {
          return previous;
        }
        return {
          condition: values.condition,
          actionsTaken: values.actionsTaken,
          notes: values.notes,
        };
      });
    },
    [],
  );

  const handleSaveDraft = useCallback(
    async (values: InspectionRegistrationFormData) => {
      if (isSavingDraft) {
        return;
      }

      const hasAnyValue =
        values.condition.trim().length > 0 ||
        values.actionsTaken.trim().length > 0 ||
        values.notes.trim().length > 0;

      if (!hasAnyValue) {
        toast.info("Preencha ao menos um campo antes de salvar o rascunho.");
        return;
      }

      setDraftError(null);
      setDraftSavedAtMessage(null);
      setIsSavingDraft(true);

      const updatedDraft: InspectionDraft = {
        condition: values.condition,
        actionsTaken: values.actionsTaken,
        notes: values.notes,
      };
      setDraft(updatedDraft);
      saveLocalInspectionDraft(occurrenceId, updatedDraft);

      try {
        const saved = await saveInspectionDraft(occurrenceId, updatedDraft);
        setRemoteDraft(saved);
        setDraftSavedAtMessage("Rascunho salvo com sucesso.");
        toast.success("Rascunho salvo com sucesso.");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível salvar o rascunho na API.";
        setDraftError(message);
        toast.error(message);
      } finally {
        setIsSavingDraft(false);
      }
    },
    [isSavingDraft, occurrenceId],
  );

  const handleProceedToOutcome = useCallback(
    (values: InspectionRegistrationFormData) => {
      setDraftError(null);
      const updatedDraft: InspectionDraft = {
        condition: values.condition.trim(),
        actionsTaken: values.actionsTaken.trim(),
        notes: values.notes.trim(),
      };
      setDraft(updatedDraft);
      saveLocalInspectionDraft(occurrenceId, updatedDraft);
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

  const occurrence = occurrenceQuery.data;
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

  const canInspect = occurrence ? canStartInspection(occurrence.status) : true;

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
              validada ou pronta para atendimento.
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
                draft={draft}
                remoteDraft={remoteDraft}
                isSavingDraft={isSavingDraft}
                draftError={draftError}
                draftSavedAtMessage={draftSavedAtMessage}
                onDraftFieldsChange={handleDraftFieldsChange}
                onSaveDraft={handleSaveDraft}
                onProceedToOutcome={handleProceedToOutcome}
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
