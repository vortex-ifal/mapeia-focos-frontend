"use client";

import {
  ArrowLeft,
  ChevronDown,
  CircleCheck,
  ImageIcon,
  Layers3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  getOccurrenceDraftSnapshot,
  getPendingFiles,
  hasPendingMediaUpload,
  discardPendingMediaAndFinish,
  subscribeToOccurrenceDraft,
  submitOccurrence,
} from "@/controllers/citizen/occurrence.controller";

import type { OccurrenceFormData } from "@/types/occurrence";

const situationLabels: Record<string, string> = {
  recipientes_agua_parada: "Recipientes com água parada",
  agua_acumulada_terreno: "Água acumulada em terreno",
  reservatorio_destampado: "Reservatório destampado",
};

function ReviewMap() {
  return (
    <div className="relative h-[190px] w-full overflow-hidden rounded-[18px] border border-[#E9E0D4] bg-[#F4EFE6]">
      {/* Ruas horizontais */}
      <div className="absolute left-[-5%] top-[15%] h-[11px] w-[110%] rotate-[3deg] bg-white" />

      <div className="absolute left-[-5%] top-[35%] h-[9px] w-[110%] -rotate-[1deg] bg-white" />

      <div className="absolute left-[-5%] top-[57%] h-[11px] w-[110%] rotate-[2deg] bg-white" />

      <div className="absolute left-[-5%] top-[78%] h-[9px] w-[110%] -rotate-[2deg] bg-white" />

      {/* Ruas verticais */}
      <div className="absolute left-[18%] top-[-16%] h-[142%] w-[10px] -rotate-[3deg] bg-white" />

      <div className="absolute left-[42%] top-[-16%] h-[142%] w-[10px] rotate-[2deg] bg-white" />

      <div className="absolute left-[67%] top-[-16%] h-[142%] w-[10px] -rotate-[4deg] bg-white" />

      <div className="absolute left-[90%] top-[-16%] h-[142%] w-[10px] rotate-[2deg] bg-white" />

      {/* Localização selecionada */}
      <div className="absolute left-[66%] top-[42%] flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full border border-[#C94F32]/40 bg-[#FBF8F2]/70">
        <span className="h-[14px] w-[14px] rounded-full border-[3px] border-white bg-[#C94F32] shadow-sm" />
      </div>

      {/* Legenda */}
      <div className="absolute bottom-3 left-3 right-3 flex h-[44px] items-center justify-between rounded-[12px] border border-[#E9E0D4] bg-white px-3 text-[10px]">
        <div className="flex items-center gap-3 text-[#716B67]">
          <span className="flex items-center gap-1">
            <span className="h-[7px] w-[7px] rounded-full bg-[#584A57]" />
            ocorrência
          </span>

          <span className="flex items-center gap-1">
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-[#C94F32]/40">
              <span className="h-[6px] w-[6px] rounded-full bg-[#C94F32]" />
            </span>
            selecionada
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
          <Layers3 size={16} />
          Camadas
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

export function ReviewOccurrence() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const draftSnapshot = useSyncExternalStore(
    subscribeToOccurrenceDraft,
    getOccurrenceDraftSnapshot,
    () => null,
  );

  const occurrence = useMemo<OccurrenceFormData | null>(() => {
    if (!draftSnapshot) {
      return null;
    }

    try {
      return JSON.parse(draftSnapshot) as OccurrenceFormData;
    } catch {
      return null;
    }
  }, [draftSnapshot]);

  const [submitted, setSubmitted] = useState(false);

  const pendingFiles = getPendingFiles();

  const mediaNames = pendingFiles.map((file) => file.name);

  const hasMedia = mediaNames.length > 0;

  const lostMedia = !hasMedia && Boolean(occurrence?.evidencia_nomes?.length);

  const [previewUrls] = useState<string[]>(() => {
    return typeof window !== "undefined"
      ? getPendingFiles().map((file) => URL.createObjectURL(file))
      : [];
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (!draftSnapshot && !submitted) {
      router.replace("/nova-ocorrencia");
    }
  }, [draftSnapshot, submitted, router]);

  const [hasPendingMedia, setHasPendingMedia] = useState(() =>
    hasPendingMediaUpload(),
  );

  async function handleSend() {
    if (!occurrence) {
      return;
    }

    try {
      setIsSubmitting(true);

      await submitOccurrence(occurrence);

      if (hasPendingMediaUpload()) {
        setHasPendingMedia(true);
        return;
      }

      setSubmitted(true);

      router.push("/");
    } catch {
      if (hasPendingMediaUpload()) {
        setHasPendingMedia(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDiscardAndFinish() {
    discardPendingMediaAndFinish();

    setSubmitted(true);

    router.push("/");
  }

  function handleEdit() {
    router.push("/nova-ocorrencia");
  }

  if (!occurrence) {
    return null;
  }

  const hasContact = Boolean(
    occurrence.nome?.trim() ||
    occurrence.email?.trim() ||
    occurrence.telefone?.trim(),
  );

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto w-full px-[18px] pb-[22px] pt-[18px] md:max-w-[760px] md:px-8">
        <header className="flex h-[52px] items-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Voltar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="ml-[10px] text-[18px] font-bold">
            Revisar ocorrência
          </h1>
        </header>

        <section className="mt-[14px]">
          <h2 className="text-[20px] font-bold">Localização</h2>

          <div className="mt-[14px]">
            <ReviewMap />
          </div>

          <div className="mt-[14px] min-h-[88px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
            <p className="text-[14px] font-bold">{occurrence.endereco}</p>

            <p className="mt-1 text-[12px] text-[#716B67]">
              {occurrence.localizacao_contexto ?? "Localização definida"}
            </p>
          </div>
        </section>

        <section className="mt-[14px]">
          <h2 className="text-[20px] font-bold">Evidências</h2>

          {lostMedia ? (
            <div className="mt-[14px] rounded-[12px] border border-[#E9E0D4] bg-[#F4EFE6] p-[14px] text-[13px] text-[#716B67]">
              <p className="font-semibold text-[#171717]">
                Mídias precisam ser selecionadas novamente
              </p>

              <p className="mt-1 leading-[18px]">
                A página foi recarregada e os arquivos em memória não estão mais
                disponíveis.
              </p>

              <button
                type="button"
                onClick={handleEdit}
                className="mt-2 text-[12px] font-bold text-[#C94F32] underline"
              >
                Voltar e selecionar fotos
              </button>
            </div>
          ) : hasMedia ? (
            <>
              <div className="mt-[14px] flex h-[56px] items-center justify-center gap-2 rounded-[12px] border border-[#E9E0D4] bg-white">
                <CircleCheck size={20} className="text-[#236B4D]" />

                <span className="text-[14px] font-semibold text-[#236B4D]">
                  Mídia adicionada
                </span>
              </div>

              <div className="mt-[14px] space-y-[10px]">
                {mediaNames.map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <div className="relative flex h-[82px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#E9E0D4] bg-[#F4EFE6]">
                      {previewUrls[index] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrls[index]}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>

                    <div className="min-w-0 pt-1">
                      <p className="break-words text-[14px] text-[#716B67]">
                        {name}
                      </p>

                      <p className="mt-1 text-[13px] leading-[18px] text-[#716B67]">
                        Imagem selecionada · {index + 1} de {mediaNames.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-[14px] flex h-[82px] items-start gap-3">
              <div className="flex h-[82px] w-[104px] shrink-0 items-center justify-center rounded-[10px] border border-[#E9E0D4] bg-[#F4EFE6]">
                <ImageIcon size={20} />
              </div>

              <div className="pt-1">
                <p className="text-[14px] text-[#716B67]">
                  Nenhuma mídia selecionada
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="mt-[14px]">
          <h2 className="text-[20px] font-bold">Situação observada</h2>

          <div className="mt-[14px] min-h-[150px] w-[224px] max-w-full rounded-[14px] border border-[#E9E0D4] bg-white p-[15px]">
            <p className="text-[14px] font-bold leading-[18px]">
              {situationLabels[occurrence.tipo_situacao] ??
                occurrence.tipo_situacao}
            </p>

            <p className="mt-[6px] text-[13px] leading-[17px] text-[#716B67]">
              {occurrence.descricao}
            </p>
          </div>
        </section>

        <div className="mt-[14px] flex min-h-[48px] w-full items-center rounded-[12px] border border-[#E9E0D4] bg-white px-[10px] py-2">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              hasContact ? "border-[#C94F32]" : "border-[#E9E0D4] bg-[#F4EFE6]"
            }`}
          >
            {hasContact && (
              <span className="h-2 w-2 rounded-full bg-[#C94F32]" />
            )}
          </span>

          <span className="ml-2 text-[13px] font-medium">
            Informar dados de contato (opcional)
          </span>
        </div>

        {hasPendingMedia ? (
          <>
            <div className="mt-[14px] rounded-[12px] border border-[#C94F32]/30 bg-[#FBF2EF] p-[14px] text-[13px] text-[#716B67]">
              <p className="font-semibold text-[#C94F32]">
                Ocorrência registrada, fotos pendentes
              </p>

              <p className="mt-1 leading-[18px]">
                Sua ocorrência já foi salva no sistema, mas houve um problema ao
                enviar as fotos. Você pode tentar reenviá-las agora ou concluir
                sem as fotos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={isSubmitting}
              className="mt-[14px] h-[52px] w-full rounded-[12px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Reenviando fotos..." : "Tentar reenviar fotos"}
            </button>

            <button
              type="button"
              onClick={handleDiscardAndFinish}
              disabled={isSubmitting}
              className="mt-[14px] h-[48px] w-full rounded-[12px] border border-[#E9E0D4] bg-white px-4 text-[14px] font-bold text-[#716B67] transition hover:bg-[#F4EFE6]"
            >
              Concluir sem fotos
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSend}
              disabled={isSubmitting}
              className="mt-[14px] h-[52px] w-full rounded-[12px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Enviar ocorrência"}
            </button>

            <button
              type="button"
              onClick={handleEdit}
              className="mt-[14px] h-[48px] w-full rounded-[12px] border border-[#E9E0D4] bg-white px-4 text-[14px] font-bold text-[#171717]"
            >
              Voltar e editar
            </button>
          </>
        )}
      </div>
    </main>
  );
}