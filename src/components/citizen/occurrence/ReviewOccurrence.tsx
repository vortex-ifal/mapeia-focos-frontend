"use client";

import { ArrowLeft, ChevronDown, ImageIcon, Layers3 } from "lucide-react";

import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  getOccurrenceDraftSnapshot,
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
      <div className="absolute left-[-40px] top-[28px] h-[11px] w-[470px] rotate-[3deg] bg-white" />

      <div className="absolute left-[-40px] top-[67px] h-[9px] w-[470px] -rotate-[1deg] bg-white" />

      <div className="absolute left-[-40px] top-[108px] h-[11px] w-[470px] rotate-[2deg] bg-white" />

      <div className="absolute left-[-40px] top-[148px] h-[9px] w-[470px] -rotate-[2deg] bg-white" />

      <div className="absolute left-[63px] top-[-30px] h-[270px] w-[10px] -rotate-[3deg] bg-white" />

      <div className="absolute left-[148px] top-[-30px] h-[270px] w-[10px] rotate-[2deg] bg-white" />

      <div className="absolute left-[236px] top-[-30px] h-[270px] w-[10px] -rotate-[4deg] bg-white" />

      <div className="absolute left-[320px] top-[-30px] h-[270px] w-[10px] rotate-[2deg] bg-white" />

      <div className="absolute left-[66%] top-[42%] flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#C94F32]/40 bg-[#FBF8F2]/70">
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

  useEffect(() => {
    if (!draftSnapshot) {
      router.replace("/nova-ocorrencia");
    }
  }, [draftSnapshot, router]);

  async function handleSend() {
    if (!occurrence) {
      return;
    }

    try {
      setIsSubmitting(true);

      await submitOccurrence(occurrence);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit() {
    router.push("/nova-ocorrencia");
  }

  if (!occurrence) {
    return null;
  }

  const hasContact = Boolean(occurrence.contato?.trim());

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto w-full max-w-[390px] px-[18px] pb-[22px] pt-[18px]">
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

        <div className="mt-[14px]">
          <ReviewMap />
        </div>

        <div className="mt-[14px] h-[88px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
          <p className="text-[14px] font-bold">{occurrence.endereco}</p>

          <p className="mt-1 text-[12px] text-[#716B67]">
            Centro · terreno ao lado da praça
          </p>
        </div>

        <section className="mt-[14px]">
          <h2 className="text-[20px] font-bold">Evidências</h2>

          <div className="mt-[14px] flex h-[82px] w-[318px] items-start gap-3">
            <div className="flex h-[82px] w-[104px] shrink-0 items-center justify-center rounded-[10px] border border-[#E9E0D4] bg-[#F4EFE6]">
              <ImageIcon size={20} />
            </div>

            <div>
              <p className="text-[14px] text-[#716B67]">
                {occurrence.evidencia_nome || "Nenhuma mídia selecionada"}
              </p>

              {occurrence.evidencia_nome && (
                <p className="mt-1 text-[13px] leading-[18px] text-[#716B67]">
                  Imagem selecionada · 1 arquivo
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-[14px]">
          <h2 className="text-[20px] font-bold">Situação observada</h2>

          <div className="mt-[14px] h-[150px] w-[224px] rounded-[14px] border border-[#E9E0D4] bg-white p-[15px]">
            <p className="text-[14px] font-bold leading-[18px]">
              {situationLabels[occurrence.tipo_situacao] ??
                occurrence.tipo_situacao}
            </p>

            <p className="mt-[6px] text-[13px] leading-[17px] text-[#716B67]">
              {occurrence.descricao}
            </p>
          </div>
        </section>

        <div className="mt-[14px] flex h-[48px] w-full items-center rounded-[12px] border border-[#E9E0D4] bg-white px-[10px]">
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
      </div>
    </main>
  );
}