"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChevronLeft, Map, Rows3 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DayPrioritiesMap } from "@/components/agent/DayPrioritiesMap";
import { DayPriorityCard } from "@/components/agent/DayPriorityCard";
import {
  mapAgentOccurrence,
  sortAgentPriorities,
} from "@/controllers/agent/day-priorities.controller";
import { getAgentWorklist } from "@/services/api/agent-worklist.service";
import type {
  AgentPrioritiesSort,
  AgentPrioritiesView,
} from "@/types/agent-priorities";

export function DayPriorities() {
  const [view, setView] = useState<AgentPrioritiesView>("list");

  const [sortBy, setSortBy] = useState<AgentPrioritiesSort>("default");

  const worklistQuery = useQuery({
    queryKey: ["agent", "priorities"],

    queryFn: getAgentWorklist,

    staleTime: 30_000,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  const occurrences = useMemo(
    () =>
      sortAgentPriorities(
        (worklistQuery.data ?? []).map(mapAgentOccurrence),
        sortBy,
      ),
    [worklistQuery.data, sortBy],
  );

  return (
    <main
      className="
        min-h-dvh
        bg-[#FBF8F2]
        text-[#171717]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[390px]
          px-[18px]
          pb-8
          pt-[18px]
          max-[360px]:px-4
        "
      >
        <header
          className="
            flex
            h-[52px]
            items-center
            gap-[10px]
          "
        >
          <Link
            href="/dia-em-campo"
            aria-label="Voltar para meu trabalho"
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
              transition-colors
              hover:bg-[#F4EFE6]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
            "
          >
            <ChevronLeft size={20} strokeWidth={1.8} aria-hidden="true" />
          </Link>

          <span
            className="
              text-[18px]
              font-bold
              leading-tight
            "
          >
            Meu trabalho
          </span>
        </header>

        <section
          className="
            mt-[14px]
          "
        >
          <h1
            className="
              text-[26px]
              font-extrabold
              leading-[31px]
              tracking-[-0.4px]
            "
          >
            Prioridades do dia
          </h1>

          <p
            className="
              mt-1
              text-[12px]
              leading-[17px]
              text-[#716B67]
            "
          >
            Veja suas ocorrências atribuídas e identifique o que precisa de
            atenção primeiro.
          </p>
        </section>

        <div
          className="
            mt-4
            flex
            h-[42px]
            w-fit
            items-center
            rounded-[12px]
            border
            border-[#E9E0D4]
            bg-white
            p-[5px]
          "
        >
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={clsx(
              `
                flex
                h-8
                items-center
                justify-center
                gap-[5px]
                rounded-[9px]
                px-3
                text-[12px]
                font-semibold
                transition-colors
              `,
              view === "list"
                ? `
                    bg-[#F4EFE6]
                    text-[#171717]
                  `
                : `
                    bg-transparent
                    text-[#716B67]
                  `,
            )}
          >
            <Rows3 size={14} strokeWidth={1.8} aria-hidden="true" />
            Lista
          </button>

          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
            className={clsx(
              `
                flex
                h-8
                items-center
                justify-center
                gap-[5px]
                rounded-[9px]
                px-3
                text-[12px]
                font-semibold
                transition-colors
              `,
              view === "map"
                ? `
                    bg-[#F4EFE6]
                    text-[#171717]
                  `
                : `
                    bg-transparent
                    text-[#716B67]
                  `,
            )}
          >
            <Map size={14} strokeWidth={1.8} aria-hidden="true" />
            Mapa
          </button>
        </div>

        <div className="mt-4">
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.06em]
              text-[#716B67]
            "
          >
            Ordenar por
          </p>

          <div
            className="
              mt-2
              flex
              gap-2
            "
          >
            <button
              type="button"
              aria-pressed={sortBy === "area"}
              onClick={() => setSortBy(sortBy === "area" ? "default" : "area")}
              className={clsx(
                `
                  flex
                  h-10
                  items-center
                  rounded-[12px]
                  border
                  px-[13px]
                  text-[12px]
                  font-semibold
                  transition-colors
                `,
                sortBy === "area"
                  ? `
                      border-[#C94F32]
                      bg-[#FAEBC8]
                      text-[#171717]
                    `
                  : `
                      border-[#E9E0D4]
                      bg-white
                      text-[#171717]
                    `,
              )}
            >
              Área
            </button>

            <button
              type="button"
              aria-pressed={sortBy === "status"}
              onClick={() =>
                setSortBy(sortBy === "status" ? "default" : "status")
              }
              className={clsx(
                `
                  flex
                  h-10
                  items-center
                  rounded-[12px]
                  border
                  px-[13px]
                  text-[12px]
                  font-semibold
                  transition-colors
                `,
                sortBy === "status"
                  ? `
                      border-[#C94F32]
                      bg-[#FAEBC8]
                      text-[#171717]
                    `
                  : `
                      border-[#E9E0D4]
                      bg-white
                      text-[#171717]
                    `,
              )}
            >
              Status
            </button>
          </div>
        </div>

        <section aria-label="Ocorrências atribuídas" className="mt-4">
          {worklistQuery.isPending ? (
            <div
              className="
                rounded-[12px]
                border
                border-[#E9E0D4]
                bg-white
                px-4
                py-10
                text-center
                text-[12px]
                text-[#716B67]
              "
            >
              Carregando prioridades...
            </div>
          ) : null}

          {worklistQuery.isError ? (
            <div
              role="alert"
              className="
                rounded-[12px]
                border
                border-[#F8E3E0]
                bg-[#F8E3E0]
                p-4
              "
            >
              <p
                className="
                  text-[12px]
                  leading-5
                  text-[#9D352D]
                "
              >
                {worklistQuery.error instanceof Error
                  ? worklistQuery.error.message
                  : "Não foi possível carregar as prioridades."}
              </p>

              <button
                type="button"
                onClick={() => {
                  void worklistQuery.refetch();
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

          {!worklistQuery.isPending &&
          !worklistQuery.isError &&
          occurrences.length === 0 ? (
            <div
              className="
                rounded-[12px]
                border
                border-[#E9E0D4]
                bg-white
                px-4
                py-10
                text-center
              "
            >
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-[#171717]
                "
              >
                Nenhuma ocorrência atribuída
              </p>

              <p
                className="
                  mt-1
                  text-[12px]
                  leading-5
                  text-[#716B67]
                "
              >
                Quando uma ocorrência for encaminhada para você, ela aparecerá
                aqui.
              </p>
            </div>
          ) : null}

          {!worklistQuery.isPending &&
          !worklistQuery.isError &&
          occurrences.length > 0 ? (
            view === "list" ? (
              <div
                className="
                  flex
                  flex-col
                  gap-[12px]
                "
              >
                {occurrences.map((occurrence) => (
                  <DayPriorityCard
                    key={occurrence.id}
                    occurrence={occurrence}
                  />
                ))}
              </div>
            ) : (
              <DayPrioritiesMap occurrences={occurrences} />
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}