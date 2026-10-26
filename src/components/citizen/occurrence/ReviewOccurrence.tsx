"use client";

import {
  ArrowLeft,
  ChevronDown,
  CircleCheck,
  ImageIcon,
  Layers3,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  discardPendingMediaAndFinish,
  getOccurrenceDraftSnapshot,
  getPendingFiles,
  hasPendingMediaUpload,
  subscribeToOccurrenceDraft,
  submitOccurrence,
} from "@/controllers/citizen/occurrence.controller";

import type { OccurrenceFormData } from "@/types/occurrence";

export const situationLabelsExamples: Record<string, string> = {
  standingWaterContainers: "Recipientes com água parada",
  accumulatedWaterTerrain: "Água acumulada em terreno",
  uncoveredReservoir: "Reservatório destampado",
};

type SubmitView = "review" | "submitting" | "success";

function FlowHeader({
  title,
  onBack,
  disabled = false,
}: {
  title: string;
  onBack: () => void;
  disabled?: boolean;
}) {
  return (
    <header className="flex h-[52px] items-center">
      <button
        type="button"
        onClick={onBack}
        disabled={disabled}
        aria-label="Voltar"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white disabled:cursor-default"
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="ml-[10px] text-[18px] font-bold">{title}</h1>
    </header>
  );
}

function ReviewMap() {
  return (
    <div className="relative aspect-[354/190] w-full overflow-hidden rounded-[18px] border border-[#E9E0D4] bg-[#F4EFE6] md:aspect-auto md:h-[280px]">
      <div className="absolute left-[-5%] top-[15%] h-[11px] w-[110%] rotate-[3deg] bg-white" />

      <div className="absolute left-[-5%] top-[35%] h-[9px] w-[110%] -rotate-[1deg] bg-white" />

      <div className="absolute left-[-5%] top-[57%] h-[11px] w-[110%] rotate-[2deg] bg-white" />

      <div className="absolute left-[-5%] top-[78%] h-[9px] w-[110%] -rotate-[2deg] bg-white" />

      <div className="absolute left-[18%] top-[-16%] h-[142%] w-[10px] -rotate-[3deg] bg-white" />

      <div className="absolute left-[42%] top-[-16%] h-[142%] w-[10px] rotate-[2deg] bg-white" />

      <div className="absolute left-[67%] top-[-16%] h-[142%] w-[10px] -rotate-[4deg] bg-white" />

      <div className="absolute left-[90%] top-[-16%] h-[142%] w-[10px] rotate-[2deg] bg-white" />

      <div className="absolute left-[66%] top-[42%] flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full border border-[#C94F32]/40 bg-[#FBF8F2]/70">
        <span className="h-[14px] w-[14px] rounded-full border-[3px] border-white bg-[#C94F32] shadow-sm" />
      </div>

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

function SubmittingOccurrence() {
  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto w-full px-[18px] pb-[22px] pt-[18px] md:max-w-[760px] md:px-8">
        <FlowHeader title="Enviando ocorrência" onBack={() => {}} disabled />

        <div className="mt-[14px] flex h-[220px] w-full animate-pulse flex-col gap-[10px] rounded-[12px] border border-[#E9E0D4] bg-white p-[12px]">
          <div className="h-[20px] w-[51%] rounded-[8px] bg-[#F4EFE6]" />

          <div className="h-[28px] w-[82%] rounded-[8px] bg-[#F4EFE6]" />

          <div className="h-[28px] w-[82%] rounded-[8px] bg-[#F4EFE6]" />

          <div className="h-[28px] w-[82%] rounded-[8px] bg-[#F4EFE6]" />
        </div>

        <p className="mt-[14px] text-[14px] font-medium text-[#716B67]">
          Enviando localização, informações e evidências...
        </p>
      </div>
    </main>
  );
}

function SuccessOccurrence({
  reference,
  onRegisterAnother,
}: {
  reference: string;
  onRegisterAnother: () => void;
}) {
  const isLongReference = reference.length > 16;

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto w-full px-[18px] pb-[22px] pt-[18px] md:max-w-[760px] md:px-8">
        <FlowHeader title="Ocorrência registrada" onBack={onRegisterAnother} />

        <h2 className="mt-[14px] text-[28px] font-extrabold leading-normal">
          Registro enviado com sucesso
        </h2>

        <div className="mt-[14px] flex min-h-[120px] w-[219px] max-w-full flex-col gap-[5px] rounded-[16px] border border-[#E9E0D4] bg-white p-[16px]">
          <p className="text-[12px] font-medium text-[#716B67]">
            Referência para acompanhamento
          </p>

          <p
            className={`break-all font-extrabold leading-normal text-[#171717] ${
              isLongReference ? "text-[16px]" : "text-[24px]"
            }`}
          >
            {reference}
          </p>
        </div>

        <div className="mt-[14px] flex min-h-[86px] w-full items-center rounded-[12px] border border-[#E9E0D4] bg-[#EEE8ED] px-[12px]">
          <p className="text-[12px] font-medium leading-normal text-[#584A57]">
            A ocorrência entra em análise. Atualizações registradas pela equipe
            aparecerão no acompanhamento.
          </p>
        </div>

        <Link
          href={`/acompanhar-referencia${
            reference && reference !== "Referência indisponível"
              ? `?referencia=${encodeURIComponent(reference)}`
              : ""
          }`}
          className="mt-[14px] flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#C94F32] px-[16px] text-center text-[14px] font-bold text-white no-underline transition hover:bg-[#B9472E] active:scale-[0.99]"
        >
          Acompanhar ocorrência
        </Link>

        <button
          type="button"
          onClick={onRegisterAnother}
          className="mt-[14px] flex h-[48px] w-full items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white px-[16px] text-[14px] font-bold text-[#171717] transition hover:bg-[#F4EFE6] active:scale-[0.99]"
        >
          Registrar outra
        </button>
      </div>
    </main>
  );
}

export function ReviewOccurrence() {
  const router = useRouter();

  const submitLockRef = useRef(false);

  const [view, setView] = useState<SubmitView>("review");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reference, setReference] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [activeOccurrence, setActiveOccurrence] =
    useState<OccurrenceFormData | null>(null);

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

  const reviewOccurrence = occurrence ?? activeOccurrence;

  const pendingFiles = getPendingFiles();

  const mediaNames = pendingFiles.map((file) => file.name);

  const hasMedia = mediaNames.length > 0;

  const lostMedia =
    !hasMedia && Boolean(reviewOccurrence?.evidenceNames?.length);

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
    if (!draftSnapshot && view === "review" && !activeOccurrence) {
      router.replace("/nova-ocorrencia");
    }
  }, [draftSnapshot, view, activeOccurrence, router]);

  const [hasPendingMedia, setHasPendingMedia] = useState(() =>
    hasPendingMediaUpload(),
  );

  async function handleSend() {
    const data = occurrence ?? activeOccurrence;

    if (!data || submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    setSubmitError(null);
    setActiveOccurrence(data);
    setIsSubmitting(true);
    setView("submitting");

    try {
      const result = await submitOccurrence(data);

      const generatedReference =
        result.protocol?.trim().toUpperCase() ||
        result.protocolo?.trim().toUpperCase() ||
        result.id?.trim() ||
        "Referência indisponível";

      setReference(generatedReference);

      setView("success");
    } catch {
      if (hasPendingMediaUpload()) {
        setHasPendingMedia(true);
      } else {
        setSubmitError(
          "Não foi possível concluir o envio. Revise sua conexão e tente novamente.",
        );
      }

      setView("review");
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  }

  function handleDiscardAndFinish() {
    discardPendingMediaAndFinish();

    setActiveOccurrence(null);

    router.push("/");
  }

  function handleEdit() {
    router.push("/nova-ocorrencia");
  }

  function handleRegisterAnother() {
    discardPendingMediaAndFinish();

    setReference("");
    setActiveOccurrence(null);
    setSubmitError(null);

    router.push("/");
  }

  if (view === "submitting") {
    return <SubmittingOccurrence />;
  }

  if (view === "success") {
    return (
      <SuccessOccurrence
        reference={reference}
        onRegisterAnother={handleRegisterAnother}
      />
    );
  }

  if (!reviewOccurrence) {
    return null;
  }

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto w-full px-[18px] pb-[22px] pt-[18px] md:max-w-[760px] md:px-8">
        <FlowHeader title="Revisar ocorrência" onBack={() => router.back()} />

        <section className="mt-[14px]">
          <ReviewMap />

          <div className="mt-[14px] min-h-[88px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
            <p className="text-[14px] font-bold">{reviewOccurrence.address}</p>

            <p className="mt-1 text-[12px] text-[#716B67]">
              {reviewOccurrence.locationContext ?? "Localização definida"}
            </p>
          </div>
        </section>

        <section className="mt-[14px]">
          <h2 className="text-[18px] font-bold">Evidências</h2>

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
          <h2 className="text-[18px] font-bold">Situação observada</h2>

          <div className="mt-[14px] min-h-[150px] w-[63%] min-w-[224px] max-w-[320px] rounded-[14px] border border-[#E9E0D4] bg-white p-[15px]">
            <p className="text-[14px] font-bold leading-[18px]">
              {situationLabelsExamples[reviewOccurrence.situationType] ??
                reviewOccurrence.situationType}
            </p>

            <p className="mt-[6px] text-[13px] leading-[17px] text-[#716B67]">
              {reviewOccurrence.description}
            </p>
          </div>
        </section>

        {submitError && (
          <div className="mt-[14px] flex min-h-[86px] w-full items-center rounded-[12px] border border-[#E9E0D4] bg-[#F8E3E0] px-[12px]">
            <p className="text-[12px] font-medium leading-normal text-[#9D352D]">
              {submitError}
            </p>
          </div>
        )}

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
              onClick={() => void handleSend()}
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
              onClick={() => void handleSend()}
              disabled={isSubmitting}
              className="mt-[14px] h-[52px] w-full rounded-[12px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitError ? "Tentar novamente" : "Enviar ocorrência"}
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