"use client";

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  DEFAULT_TIMELINE_STEPS,
  OccurrenceTimeline,
  REJECTED_TIMELINE_STEPS,
} from "./OccurrenceTimeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  getQueriedOccurrenceStatusSnapshot,
  searchOccurrenceByProtocol,
  subscribeToQueriedOccurrenceStatus,
} from "@/controllers/citizen/occurrence.controller";
import type {
  OccurrenceStatusKey,
  OccurrenceStatusResponse,
} from "@/types/occurrence";

export interface OccurrenceStatusProps {
  protocol: string;
  initialData?: OccurrenceStatusResponse;
  statusOverride?: OccurrenceStatusKey | string;
}

export interface StatusVisualConfig {
  steps: readonly string[];
  stepIndex: number;
  badgeLabel: string;
  badgeClass: string;
  dotClass: string;
  title: string;
  description: string;
}

export function resolveStatusConfig(
  statusKey?: OccurrenceStatusKey | string,
): StatusVisualConfig {
  const normalized = (statusKey || "").toLowerCase().trim();

  switch (normalized) {
    case "under_review":
      return {
        steps: DEFAULT_TIMELINE_STEPS,
        stepIndex: 1,
        badgeLabel: "Em análise",
        badgeClass: "bg-[#FAEBC8] text-[#9A6510]",
        dotClass: "bg-[#9A6510]",
        title: "Em análise",
        description:
          "A equipe está verificando localização, evidências e contexto.",
      };

    case "forwarded_for_inspection":
    case "accepted":
      return {
        steps: DEFAULT_TIMELINE_STEPS,
        stepIndex: 2,
        badgeLabel: "Vistoria prevista",
        badgeClass: "bg-[#EEE8ED] text-[#584A57]",
        dotClass: "bg-[#584A57]",
        title: "Vistoria prevista",
        description:
          "A ocorrência avançou para atendimento em campo. A forma exata de agendamento depende da operação local.",
      };

    case "resolved":
      return {
        steps: DEFAULT_TIMELINE_STEPS,
        stepIndex: 3,
        badgeLabel: "Resolvida",
        badgeClass: "bg-[#EBF3EF] text-[#236B4D]",
        dotClass: "bg-[#236B4D]",
        title: "Resolvida",
        description: "A equipe registrou a conclusão do atendimento.",
      };

    case "rejected":
      return {
        steps: REJECTED_TIMELINE_STEPS,
        stepIndex: 2,
        badgeLabel: "Reprovada",
        badgeClass: "bg-[#FDF0ED] text-[#C94F32]",
        dotClass: "bg-[#C94F32]",
        title: "Reprovada",
        description:
          "A ocorrência foi avaliada pela equipe e concluída sem necessidade de intervenção.",
      };

    case "registered":
    default:
      return {
        steps: DEFAULT_TIMELINE_STEPS,
        stepIndex: 0,
        badgeLabel: "Registrada",
        badgeClass: "bg-[#EEE8ED] text-[#584A57]",
        dotClass: "bg-[#584A57]",
        title: "Registrada",
        description: "Seu registro foi recebido e aguarda análise.",
      };
  }
}

export function OccurrenceStatus({
  protocol,
  initialData,
  statusOverride,
}: OccurrenceStatusProps) {
  const router = useRouter();

  const statusSnapshot = useSyncExternalStore(
    subscribeToQueriedOccurrenceStatus,
    getQueriedOccurrenceStatusSnapshot,
    () => null,
  );

  const cachedData = useMemo<OccurrenceStatusResponse | null>(() => {
    if (!statusSnapshot) {
      return null;
    }
    try {
      const parsed = JSON.parse(statusSnapshot) as OccurrenceStatusResponse;
      if (parsed.protocol.toLowerCase() === protocol.toLowerCase()) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, [statusSnapshot, protocol]);

  const [fetchedData, setFetchedData] =
    useState<OccurrenceStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData && !statusOverride);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const data = initialData ?? cachedData ?? fetchedData;
  const showLoading = !data && !statusOverride && !errorMessage && isLoading;

  useEffect(() => {
    if (statusOverride || initialData || cachedData) {
      return;
    }

    let isMounted = true;

    searchOccurrenceByProtocol(protocol)
      .then((result) => {
        if (isMounted) {
          setFetchedData(result);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage("Não foi possível carregar o status da ocorrência.");
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [protocol, initialData, statusOverride, cachedData]);

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/acompanhar-referencia");
    }
  }

  const activeKey = statusOverride || data?.statusKey || "registered";
  const statusConfig = resolveStatusConfig(activeKey);
  const formattedProtocol = (data?.protocol || protocol).toUpperCase();

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div
        className="
          mx-auto
          flex
          min-h-dvh
          w-full
          flex-col
          gap-[14px]
          px-[18px]
          pb-[22px]
          pt-[18px]
          md:max-w-[760px]
          md:px-8
          max-[360px]:px-4
        "
      >
        {/* Header */}
        <header className="flex h-[52px] items-center gap-[10px]">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar para busca de ocorrência"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white transition hover:bg-[#FDFCFA] active:scale-[0.98]"
          >
            <ArrowLeft size={20} className="text-[#171717]" />
          </button>

          <h1 className="text-[18px] font-bold leading-[23px] text-[#171717]">
            Acompanhar ocorrência
          </h1>
        </header>

        {showLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-[#716B67]">
            <Loader2 size={32} className="animate-spin text-[#C94F32]" />
            <p className="text-[14px] font-medium">Carregando andamento...</p>
          </div>
        ) : errorMessage ? (
          <section className="mt-2 flex flex-col gap-[14px]">
            <div
              role="alert"
              className="flex items-start gap-3 rounded-[12px] border border-[#F2C2B8] bg-[#FDF0ED] p-[16px] text-[#C94F32]"
            >
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] font-semibold">{errorMessage}</p>
                <p className="mt-1 text-[13px] text-[#A83820]">
                  Verifique o código ou tente novamente mais tarde.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBack}
              className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99]"
            >
              Fazer nova busca
            </button>
          </section>
        ) : (
          <>
            {/* Field: Código de referência */}
            <div className="flex w-full flex-col gap-[6px] rounded-[12px] border border-[#E9E0D4] bg-white p-[12px]">
              <span className="text-[12px] font-semibold leading-[16px] text-[#716B67]">
                Código de referência
              </span>
              <p className="text-[14px] font-normal leading-[18px] text-[#171717]">
                {formattedProtocol}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex">
              <StatusBadge
                label={statusConfig.badgeLabel}
                className={statusConfig.badgeClass}
              />
            </div>

            {/* Timeline dinâmica com passos de acordo com o fluxo do status */}
            <OccurrenceTimeline
              steps={statusConfig.steps}
              currentStepIndex={statusConfig.stepIndex}
              activeDotClassName={statusConfig.dotClass}
            />

            {/* Tracking Result: Bloco com título e descrição condicional */}
            <div className="flex w-full flex-col gap-[8px] rounded-[16px] border border-[#E9E0D4] bg-white p-[16px]">
              <h2 className="text-[17px] font-bold leading-[22px] text-[#171717]">
                {statusConfig.title}
              </h2>
              <p className="text-[13px] font-normal leading-[17px] text-[#716B67]">
                {statusConfig.description}
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
