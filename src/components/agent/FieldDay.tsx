"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";

import {
  formatCardNumber,
  formatWaitingTime,
  getSavedOfflineSurveySnapshot,
  handleResumeSavedSurvey,
  handleViewDayPriorities,
  mapOccurrencesToFieldDayData,
  subscribeToSavedOfflineSurvey,
} from "@/controllers/agent/field-day.controller";
import { getFieldDayOccurrences } from "@/services/api/field-day.service";

export function FieldDay() {
  const surveySnapshot = useSyncExternalStore(
    subscribeToSavedOfflineSurvey,
    getSavedOfflineSurveySnapshot,
    () => "empty",
  );

  const hasSavedSurvey = surveySnapshot === "saved";

  const occurrencesQuery = useQuery({
    queryKey: ["agent", "field-day", "occurrences"],
    queryFn: getFieldDayOccurrences,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const data = useMemo(() => {
    return mapOccurrencesToFieldDayData(occurrencesQuery.data);
  }, [occurrencesQuery.data]);

  const { stats, nextPriority } = data;

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div
        className="
          mx-auto
          flex
          min-h-dvh
          w-full
          max-w-[420px]
          flex-col
          px-[18px]
          pb-8
          pt-6
          max-[360px]:px-4
        "
      >
        <header className="flex items-center gap-2">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Mapeia Focos"
            width={128}
            height={30}
            className="h-auto w-[128px]"
            priority
          />
          <span
            className="
              text-[13px]
              font-bold
              tracking-wider
              text-[#C94F32]
            "
          >
            / AGENTE
          </span>
        </header>

        <section className="mt-6">
          <h1
            className="
              text-[28px]
              font-extrabold
              leading-[1.25]
              tracking-[-0.6px]
              text-[#171717]
              max-[360px]:text-[25px]
            "
          >
            Seu dia em campo
          </h1>

          <p
            className="
              mt-1.5
              text-[14px]
              leading-[1.4]
              text-[#716B67]
            "
          >
            Acompanhe o que precisa de atenção e retome suas atividades.
          </p>
        </section>

        {occurrencesQuery.isError ? (
          <div
            role="alert"
            className="
              mt-4
              rounded-[14px]
              border
              border-[#F8E3E0]
              bg-[#F8E3E0]
              p-4
              text-left
            "
          >
            <p className="text-[12px] leading-5 text-[#9D352D]">
              {occurrencesQuery.error instanceof Error
                ? occurrencesQuery.error.message
                : "Não foi possível carregar as atividades do dia da API."}
            </p>
            <button
              type="button"
              onClick={() => {
                void occurrencesQuery.refetch();
              }}
              className="
                mt-2
                text-[12px]
                font-bold
                text-[#9D352D]
                underline
                underline-offset-2
              "
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        {occurrencesQuery.isPending ? (
          <div
            className="
              mt-4
              rounded-[14px]
              border
              border-[#E9E0D4]
              bg-white
              p-4
              text-center
              text-[13px]
              text-[#716B67]
            "
          >
            Carregando informações do dia...
          </div>
        ) : null}

        <section
          aria-label="Resumo numérico de atividades"
          className="mt-6 grid grid-cols-3 gap-2.5 max-[360px]:gap-2"
        >
          <div
            className="
              flex
              min-h-[88px]
              flex-col
              justify-between
              rounded-[16px]
              border
              border-[#E9E0D4]
              bg-white
              p-3
              max-[360px]:p-2.5
            "
          >
            <span
              className="
                text-[26px]
                font-bold
                leading-none
                tracking-tight
                text-[#171717]
              "
            >
              {occurrencesQuery.isPending
                ? "—"
                : formatCardNumber(stats.assignedActivitiesCount)}
            </span>
            <span
              className="
                mt-2
                text-[11px]
                leading-[1.3]
                text-[#716B67]
              "
            >
              atividades atribuídas
            </span>
          </div>

          <div
            className="
              flex
              min-h-[88px]
              flex-col
              justify-between
              rounded-[16px]
              border
              border-[#E9E0D4]
              bg-white
              p-3
              max-[360px]:p-2.5
            "
          >
            <span
              className="
                text-[26px]
                font-bold
                leading-none
                tracking-tight
                text-[#171717]
              "
            >
              {occurrencesQuery.isPending
                ? "—"
                : formatCardNumber(stats.highPriorityCount)}
            </span>
            <span
              className="
                mt-2
                text-[11px]
                leading-[1.3]
                text-[#716B67]
              "
            >
              prioridade alta
            </span>
          </div>

          <div
            className="
              flex
              min-h-[88px]
              flex-col
              justify-between
              rounded-[16px]
              border
              border-[#E9E0D4]
              bg-white
              p-3
              max-[360px]:p-2.5
            "
          >
            <span
              className="
                text-[26px]
                font-bold
                leading-none
                tracking-tight
                text-[#171717]
              "
            >
              {occurrencesQuery.isPending
                ? "—"
                : formatCardNumber(stats.indicatedInspectionsCount)}
            </span>
            <span
              className="
                mt-2
                text-[11px]
                leading-[1.3]
                text-[#716B67]
              "
            >
              vistoria indicada
            </span>
          </div>
        </section>

        <section
          aria-labelledby="next-priority-title"
          className="mt-6"
        >
          <div className="flex items-center justify-between">
            <h2
              id="next-priority-title"
              className="
                text-[18px]
                font-bold
                leading-tight
                text-[#171717]
              "
            >
              Próxima prioridade
            </h2>

            {nextPriority ? (
              <span
                className="
                  flex
                  h-7
                  items-center
                  rounded-full
                  bg-[#FAEBC8]
                  px-3
                  text-[12px]
                  font-semibold
                  text-[#171717]
                "
              >
                Prioridade alta
              </span>
            ) : null}
          </div>

          {nextPriority ? (
            <div
              className="
                mt-3
                rounded-[16px]
                border-2
                border-[#C94F32]
                bg-[#FAEBC8]
                p-4
                text-left
              "
            >
              <p
                className="
                  text-[14px]
                  font-bold
                  leading-tight
                  text-[#171717]
                "
              >
                {nextPriority.displayCode}
              </p>

              <p
                className="
                  mt-1
                  text-[13px]
                  font-semibold
                  leading-tight
                  text-[#171717]
                "
              >
                {nextPriority.statusName} · {nextPriority.neighborhood}
              </p>

              <p
                className="
                  mt-1
                  text-[12px]
                  leading-tight
                  text-[#716B67]
                "
              >
                {formatWaitingTime(nextPriority.waitingMinutes)} · próxima ação:{" "}
                {nextPriority.nextAction}
              </p>
            </div>
          ) : !occurrencesQuery.isPending ? (
            <div
              className="
                mt-3
                rounded-[16px]
                border
                border-[#E9E0D4]
                bg-white
                p-4
                text-center
                text-[13px]
                text-[#716B67]
              "
            >
              Nenhuma ocorrência prioritária atribuída no momento.
            </div>
          ) : null}
        </section>

        <section
          aria-label="Ações do agente"
          className="mt-6 flex flex-col gap-3"
        >
          <button
            type="button"
            onClick={handleViewDayPriorities}
            className="
              flex
              h-[52px]
              w-full
              items-center
              justify-center
              rounded-[14px]
              bg-[#C94F32]
              px-4
              text-center
              text-[14px]
              font-bold
              text-white
              transition
              duration-150
              hover:bg-[#B9472E]
              active:scale-[0.99]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
            "
          >
            Ver prioridades do dia
          </button>

          <Link
            href="/nova-ocorrencia"
            className="
              flex
              h-[52px]
              w-full
              items-center
              justify-center
              rounded-[14px]
              border
              border-[#E9E0D4]
              bg-white
              px-4
              text-center
              text-[14px]
              font-bold
              text-[#171717]
              no-underline
              transition
              duration-150
              hover:bg-[#F4EFE6]
              active:scale-[0.99]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
            "
          >
            Registrar ocorrência
          </Link>

          <button
            type="button"
            disabled={!hasSavedSurvey}
            aria-disabled={!hasSavedSurvey}
            onClick={handleResumeSavedSurvey}
            className={clsx(
              `
                mt-1
                self-center
                border-0
                bg-transparent
                p-0
                text-[14px]
                font-semibold
                underline
                underline-offset-2
                transition
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
              `,
              hasSavedSurvey
                ? `
                    cursor-pointer
                    text-[#C94F32]
                    decoration-[#C94F32]
                    hover:opacity-80
                    active:scale-[0.99]
                  `
                : `
                    cursor-not-allowed
                    text-[#A8A29E]
                    decoration-[#A8A29E]
                    opacity-60
                  `,
            )}
          >
            Retomar vistoria salva
          </button>
        </section>
      </div>
    </main>
  );
}
