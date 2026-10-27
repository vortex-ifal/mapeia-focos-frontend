"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getQueriedOccurrenceStatus,
  searchOccurrenceByProtocol,
} from "@/controllers/citizen/occurrence.controller";
import type { OccurrenceStatusResponse } from "@/types/occurrence";

interface OccurrenceStatusProps {
  protocol: string;
}

const statusDescriptions: Record<string, string> = {
  registered:
    "Sua ocorrência foi registrada e aguarda análise da equipe responsável.",
  under_review:
    "A ocorrência está sendo avaliada pelos agentes de saúde e vigilância.",
  accepted:
    "A ocorrência foi aceita e direcionada para a programação das equipes.",
  forwarded_for_inspection:
    "Equipe técnica encaminhada para vistoria no local informado.",
  resolved:
    "Ações de controle de focos concluídas com sucesso no endereço informado.",
  rejected:
    "A ocorrência foi avaliada pela equipe e concluída sem necessidade de intervenção.",
};

export function OccurrenceStatus({ protocol }: OccurrenceStatusProps) {
  const router = useRouter();

  const [data, setData] = useState<OccurrenceStatusResponse | null>(() => {
    const cached = getQueriedOccurrenceStatus();
    if (cached && cached.protocol.toLowerCase() === protocol.toLowerCase()) {
      return cached;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(!data);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStatus() {
      if (data && data.protocol.toLowerCase() === protocol.toLowerCase()) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await searchOccurrenceByProtocol(protocol);
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage("Não foi possível carregar o status da ocorrência.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [protocol, data]);

  function handleBack() {
    router.push("/acompanhar-referencia");
  }

  const formattedProtocol = (data?.protocol || protocol).toUpperCase();
  const description =
    (data && statusDescriptions[data.statusKey]) ||
    "A ocorrência entra em análise. Atualizações registradas pela equipe aparecerão no acompanhamento.";

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

        {isLoading ? (
          <div className="mt-[32px] flex flex-col items-center justify-center gap-3 py-12 text-[#716B67]">
            <Loader2 size={32} className="animate-spin text-[#C94F32]" />
            <p className="text-[14px] font-medium">Carregando status...</p>
          </div>
        ) : errorMessage ? (
          <section className="mt-[20px]">
            <div
              role="alert"
              className="flex items-start gap-3 rounded-[14px] border border-[#F2C2B8] bg-[#FDF0ED] p-[16px] text-[#C94F32]"
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
              className="mt-[16px] flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99]"
            >
              Fazer nova busca
            </button>
          </section>
        ) : (
          <section className="mt-[20px] flex flex-col gap-[14px]">
            {/* Card com Código da Referência */}
            <div className="rounded-[16px] border border-[#E9E0D4] bg-white p-[16px]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[12px] font-semibold text-[#716B67]">
                    Referência para acompanhamento
                  </span>
                  <p className="mt-[4px] text-[24px] font-extrabold uppercase tracking-wide text-[#171717]">
                    {formattedProtocol}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F4EFE6] text-[#716B67]">
                  <FileText size={20} />
                </div>
              </div>
            </div>

            {/* Card com Status Atual */}
            <div className="rounded-[16px] border border-[#E9E0D4] bg-white p-[16px]">
              <span className="block text-[12px] font-semibold text-[#716B67]">
                Situação atual
              </span>
              <div className="mt-[8px] flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF3EF] px-3 py-1 text-[13px] font-bold text-[#236B4D]">
                  <CheckCircle2 size={15} />
                  {data?.statusName || "Registrada"}
                </span>
              </div>
              <p className="mt-[10px] text-[13px] leading-[1.45] text-[#716B67]">
                {description}
              </p>
            </div>

            {/* Banner Informativo */}
            <div className="flex min-h-[72px] items-center rounded-[12px] border border-[#E9E0D4] bg-[#EEE8ED] px-[14px] py-[12px]">
              <p className="text-[12px] font-medium leading-[1.4] text-[#584A57]">
                A ocorrência está no fluxo de atendimento. Novas atualizações
                registradas pela equipe responsável aparecerão nesta página.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="mt-[8px] flex flex-col gap-[10px]">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#C94F32] px-4 text-center text-[14px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99]"
              >
                Buscar outra ocorrência
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex h-[48px] w-full items-center justify-center rounded-[14px] border border-[#E9E0D4] bg-white px-4 text-center text-[14px] font-bold text-[#171717] transition hover:bg-[#F4EFE6] active:scale-[0.99]"
              >
                Voltar para o início
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
