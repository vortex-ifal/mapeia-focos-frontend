"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Image as LucideImage, X } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

import { AgentOccurrenceMap } from "@/components/agent/AgentOccurrenceMap";
import {
  canStartInspection,
  formatProtocolDisplay,
  getAgentOccurrencePriorityPresentation,
  getAgentOccurrenceStatusPresentation,
  getAgentPrioritiesPath,
  getLocationDetails,
  handleStartInspection,
} from "@/controllers/agent/agent-occurrence-details.controller";
import { getOccurrenceDetails } from "@/services/api/occurrence-details.service";
import type { OccurrenceDetailMedia } from "@/types/occurrence-details";

type AgentOccurrenceDetailsProps = {
  occurrenceId: string;
};

export function AgentOccurrenceDetails({
  occurrenceId,
}: AgentOccurrenceDetailsProps) {
  const [selectedMedia, setSelectedMedia] =
    useState<OccurrenceDetailMedia | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const occurrenceQuery = useQuery({
    queryKey: ["agent", "occurrence", occurrenceId],
    queryFn: () => getOccurrenceDetails(occurrenceId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const occurrence = occurrenceQuery.data;

  const priorityPresentation = getAgentOccurrencePriorityPresentation(
    occurrence?.priority,
  );
  const statusPresentation = getAgentOccurrenceStatusPresentation(
    occurrence?.status,
  );
  const location = occurrence
    ? getLocationDetails(occurrence)
    : { street: "", context: "" };
  const protocolTitle = formatProtocolDisplay(occurrence?.protocol);
  const canStart = occurrence ? canStartInspection(occurrence.status) : false;

  const mediaList = occurrence?.media ?? [];
  const displayMediaSlots: (OccurrenceDetailMedia | null)[] = [
    mediaList[0] ?? null,
    mediaList[1] ?? null,
    mediaList[2] ?? null,
  ];

  const handleOpenEvidenceViewer = () => {
    if (mediaList.length === 0) {
      toast.info("Nenhuma imagem anexada a esta ocorrência.");
      return;
    }
    setSelectedMedia(mediaList[0]);
    setIsViewerOpen(true);
  };

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div
        className="
          mx-auto
          flex
          min-h-dvh
          w-full
          max-w-[390px]
          flex-col
          px-[18px]
          pb-8
          pt-4
          max-[360px]:px-4
        "
      >
        {/* Header */}
        <header className="flex h-12 items-center gap-3">
          <Link
            href={getAgentPrioritiesPath()}
            aria-label="Voltar para prioridades do dia"
            title="Voltar"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[12px]
              border
              border-[#E9E0D4]
              bg-white
              text-[#171717]
              shadow-sm
              transition-colors
              hover:bg-[#F4EFE6]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
            "
          >
            <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
          </Link>

          <h1
            className="
              text-[18px]
              font-extrabold
              leading-tight
              tracking-[-0.2px]
              text-[#171717]
            "
          >
            {occurrenceQuery.isPending ? "Carregando ocorrência..." : protocolTitle}
          </h1>
        </header>

        {/* Loading state */}
        {occurrenceQuery.isPending ? (
          <div
            className="
              mt-6
              rounded-[14px]
              border
              border-[#E9E0D4]
              bg-white
              p-6
              text-center
              text-[13px]
              text-[#716B67]
            "
          >
            Carregando informações da ocorrência...
          </div>
        ) : null}

        {/* Error state */}
        {occurrenceQuery.isError ? (
          <div
            role="alert"
            className="
              mt-6
              rounded-[14px]
              border
              border-[#F8E3E0]
              bg-[#F8E3E0]
              p-4
              text-left
            "
          >
            <p className="text-[13px] leading-5 text-[#9D352D]">
              {occurrenceQuery.error instanceof Error
                ? occurrenceQuery.error.message
                : "Não foi possível carregar os detalhes da ocorrência."}
            </p>

            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  void occurrenceQuery.refetch();
                }}
                className="
                  text-[12px]
                  font-bold
                  text-[#9D352D]
                  underline
                  underline-offset-2
                "
              >
                Tentar novamente
              </button>

              <Link
                href={getAgentPrioritiesPath()}
                className="
                  text-[12px]
                  font-semibold
                  text-[#716B67]
                  underline
                  underline-offset-2
                "
              >
                Voltar às prioridades
              </Link>
            </div>
          </div>
        ) : null}

        {/* Occurrence content */}
        {occurrence ? (
          <div className="mt-3 flex flex-1 flex-col">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`
                  flex
                  h-8
                  items-center
                  rounded-full
                  px-3
                  text-[12px]
                  font-semibold
                  ${priorityPresentation.className}
                `}
              >
                {priorityPresentation.label}
              </span>

              <span
                className={`
                  flex
                  h-8
                  items-center
                  rounded-full
                  px-3
                  text-[12px]
                  font-semibold
                  ${statusPresentation.className}
                `}
              >
                {statusPresentation.label}
              </span>
            </div>

            {/* Map */}
            <div className="mt-3.5">
              <AgentOccurrenceMap
                latitude={occurrence.latitude}
                longitude={occurrence.longitude}
                displayCode={occurrence.protocol}
              />
            </div>

            {/* Address Card */}
            <section
              aria-label="Localização da ocorrência"
              className="
                mt-3.5
                rounded-[14px]
                border
                border-[#E9E0D4]
                bg-white
                px-4
                py-3.5
              "
            >
              <h2
                className="
                  text-[15px]
                  font-extrabold
                  leading-snug
                  text-[#171717]
                "
              >
                {location.street}
              </h2>

              <p
                className="
                  mt-1
                  text-[12px]
                  leading-relaxed
                  text-[#716B67]
                "
              >
                {location.context}
              </p>
            </section>

            {/* Evidências Section */}
            <section aria-label="Evidências" className="mt-5">
              <h3
                className="
                  text-[16px]
                  font-extrabold
                  leading-tight
                  text-[#171717]
                "
              >
                Evidências
              </h3>

              <div
                className="
                  mt-2.5
                  grid
                  grid-cols-3
                  gap-2.5
                "
              >
                {displayMediaSlots.map((item, index) => {
                  const hasImage = Boolean(item?.url);

                  return (
                    <div
                      key={item?.id ?? `placeholder-${index}`}
                      className="
                        relative
                        aspect-square
                        w-full
                        overflow-hidden
                        rounded-[12px]
                        border
                        border-[#E9E0D4]
                        bg-[#F4EFE6]
                        select-none
                      "
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ WebkitTouchCallout: "none" }}
                    >
                      {hasImage && item?.url ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={`Evidência ${index + 1}`}
                            loading="lazy"
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            className="
                              pointer-events-none
                              h-full
                              w-full
                              select-none
                              object-cover
                            "
                          />

                          {/* Transparent protective layer to block native touch-callout and camera roll saves */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMedia(item);
                              setIsViewerOpen(true);
                            }}
                            aria-label={`Visualizar miniatura da evidência ${index + 1}`}
                            className="
                              absolute
                              inset-0
                              cursor-pointer
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-[#C94F32]
                            "
                          />
                        </>
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            text-[#716B67]
                          "
                        >
                          <LucideImage
                            size={24}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleOpenEvidenceViewer}
                className="
                  mt-2.5
                  inline-block
                  text-[13px]
                  font-semibold
                  text-[#C94F32]
                  underline
                  underline-offset-2
                  transition
                  hover:opacity-80
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#C94F32]
                "
              >
                Visualizar evidências
              </button>
            </section>

            {/* Footer action button */}
            <div className="mt-auto pt-6">
              {canStart ? (
                <button
                  type="button"
                  onClick={handleStartInspection}
                  className="
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[#C94F32]
                    px-4
                    text-center
                    text-[15px]
                    font-bold
                    text-white
                    transition-all
                    hover:bg-[#B9472E]
                    active:scale-[0.99]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#C94F32]
                    focus-visible:ring-offset-2
                  "
                >
                  Iniciar vistoria
                </button>
              ) : (
                <div>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="A vistoria só pode ser iniciada para ocorrências validadas ou encaminhadas para vistoria."
                    className="
                      flex
                      h-[50px]
                      w-full
                      cursor-not-allowed
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-[#E9E0D4]
                      bg-[#F4EFE6]
                      px-4
                      text-center
                      text-[15px]
                      font-bold
                      text-[#A8A29E]
                      opacity-60
                    "
                  >
                    Iniciar vistoria
                  </button>

                  <p
                    className="
                      mt-1.5
                      text-center
                      text-[11px]
                      leading-normal
                      text-[#716B67]
                    "
                  >
                    A vistoria só pode ser iniciada quando a ocorrência estiver
                    validada ou pronta para atendimento.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Evidence Viewer Modal (with anti-save privacy protection) */}
        {isViewerOpen && selectedMedia ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Visualizador de evidências"
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/75
              p-4
            "
            onClick={() => setIsViewerOpen(false)}
          >
            <div
              className="
                relative
                flex
                w-full
                max-w-[400px]
                flex-col
                overflow-hidden
                rounded-[16px]
                bg-white
                p-4
                shadow-2xl
              "
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
              style={{ WebkitTouchCallout: "none", userSelect: "none" }}
            >
              <div className="flex items-center justify-between pb-3">
                <p className="text-[14px] font-bold text-[#171717]">
                  Evidência registrada
                </p>

                <button
                  type="button"
                  onClick={() => setIsViewerOpen(false)}
                  aria-label="Fechar visualizador"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    text-[#716B67]
                    hover:bg-[#F4EFE6]
                    hover:text-[#171717]
                  "
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              <div
                className="
                  relative
                  flex
                  min-h-[220px]
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[12px]
                  bg-[#F4EFE6]
                  select-none
                "
                onContextMenu={(e) => e.preventDefault()}
              >
                {selectedMedia.url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedMedia.url}
                      alt="Evidência ampliada"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      className="
                        pointer-events-none
                        max-h-[360px]
                        w-full
                        select-none
                        object-contain
                      "
                    />

                    {/* Transparent anti-save overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-auto"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8 text-[#716B67]">
                    <LucideImage size={32} strokeWidth={1.5} />
                    <p className="text-[12px]">Foto não disponível</p>
                  </div>
                )}
              </div>

              {mediaList.length > 1 ? (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {mediaList.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMedia(m)}
                      aria-label={`Ver imagem ${idx + 1}`}
                      className={`
                        h-12
                        w-12
                        shrink-0
                        overflow-hidden
                        rounded-[8px]
                        border
                        transition-colors
                        ${
                          selectedMedia.id === m.id
                            ? "border-[#C94F32] ring-2 ring-[#C94F32]"
                            : "border-[#E9E0D4] opacity-70"
                        }
                      `}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt={`Miniatura ${idx + 1}`}
                        className="pointer-events-none h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setIsViewerOpen(false)}
                className="
                  mt-4
                  h-10
                  w-full
                  rounded-[10px]
                  border
                  border-[#E9E0D4]
                  bg-white
                  text-[13px]
                  font-bold
                  text-[#171717]
                  hover:bg-[#F4EFE6]
                "
              >
                Fechar
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
