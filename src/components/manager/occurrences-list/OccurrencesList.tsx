"use client";

import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState } from "react";

import { DesktopNavigationRail } from "@/components/manager/navigation/DesktopNavigationRail";
import { ManagerHomeShortcut } from "@/components/manager/navigation/ManagerHomeShortcut";
import { OccurrenceListItem } from "@/components/manager/occurrences-list/OccurrenceListItem";
import { OccurrencesEmptyState } from "@/components/manager/occurrences-list/OccurrencesEmptyState";
import { OccurrencesFilters } from "@/components/manager/occurrences-list/OccurrencesFilters";
import {
  filterOccurrences,
  getOccurrenceRegions,
  mapOccurrenceToListItem,
} from "@/controllers/manager/occurrences-list.controller";
import { getAllOccurrences } from "@/services/api/occurrences-list.service";
import type { OperationalPriority } from "@/types/operations";

export function OccurrencesList() {
  const [query, setQuery] = useState("");

  const [statusKey, setStatusKey] = useState<string | null>(null);

  const [region, setRegion] = useState<string | null>(null);

  const [priority, setPriority] = useState<OperationalPriority | null>(null);

  const deferredQuery = useDeferredValue(query);

  const occurrencesQuery = useQuery({
    queryKey: ["manager", "occurrences", "all"],
    queryFn: getAllOccurrences,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const occurrences = useMemo(
    () => (occurrencesQuery.data ?? []).map(mapOccurrenceToListItem),
    [occurrencesQuery.data],
  );

  const regions = useMemo(
    () => getOccurrenceRegions(occurrences),
    [occurrences],
  );

  const filteredOccurrences = useMemo(
    () =>
      filterOccurrences(occurrences, {
        query: deferredQuery,
        statusKey,
        region,
        priority,
      }),
    [occurrences, deferredQuery, statusKey, region, priority],
  );

  const filtersActive =
    Boolean(deferredQuery.trim()) ||
    Boolean(statusKey) ||
    Boolean(region) ||
    Boolean(priority);

  const errorMessage =
    occurrencesQuery.error instanceof Error
      ? occurrencesQuery.error.message
      : "Não foi possível carregar as ocorrências.";

  return (
    <main
      className="
        min-h-dvh
        overflow-x-hidden
        bg-[#FBF8F2]
        text-[#171717]
      "
    >
      <div
        className="
          mx-auto
          min-h-dvh
          w-full
          max-w-[1440px]
          px-5
          pb-5
          pt-[30px]
        "
      >
        <header
          className="
            flex
            h-14
            items-start
            gap-4
            lg:grid
            lg:grid-cols-[64px_minmax(0,1fr)]
            lg:gap-6
          "
        >
          <ManagerHomeShortcut className="ml-1" />

          <h1
            className="
              pt-2
              text-[30px]
              font-extrabold
              leading-[1.2]
              tracking-[-0.6px]
            "
          >
            Ocorrências
          </h1>
        </header>

        <div
          className="
            mt-6
            grid
            min-w-0
            grid-cols-1
            gap-4
            lg:grid-cols-[64px_minmax(0,1fr)]
            lg:gap-3
          "
        >
          <DesktopNavigationRail />

          <section
            aria-labelledby="occurrences-title"
            className="
              min-h-[600px]
              min-w-0
              rounded-[16px]
              border
              border-[#E9E0D4]
              bg-white
              p-[17px]
              lg:h-[calc(100dvh-132px)]
              lg:min-h-[600px]
              lg:max-h-[768px]
            "
          >
            <h2 id="occurrences-title" className="sr-only">
              Lista de ocorrências
            </h2>

            <OccurrencesFilters
              query={query}
              statusKey={statusKey}
              region={region}
              priority={priority}
              regions={regions}
              onQueryChange={setQuery}
              onStatusChange={setStatusKey}
              onRegionChange={setRegion}
              onPriorityChange={setPriority}
            />

            <div
              className="
                mt-[10px]
                flex
                min-h-0
                flex-col
                gap-[10px]
                lg:max-h-[calc(100%-99px)]
                lg:overflow-y-auto
                lg:pr-1
              "
            >
              {occurrencesQuery.isPending ? (
                <div
                  className="
                    rounded-[12px]
                    border
                    border-[#E9E0D4]
                    bg-[#FBF8F2]
                    px-6
                    py-12
                    text-center
                    text-[12px]
                    text-[#716B67]
                  "
                >
                  Carregando ocorrências...
                </div>
              ) : null}

              {occurrencesQuery.isError ? (
                <div
                  role="alert"
                  className="
                    rounded-[12px]
                    border
                    border-[#F8E3E0]
                    bg-[#F8E3E0]
                    px-5
                    py-5
                  "
                >
                  <p
                    className="
                      text-[12px]
                      leading-5
                      text-[#9D352D]
                    "
                  >
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      void occurrencesQuery.refetch();
                    }}
                    className="
                      mt-3
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

              {!occurrencesQuery.isPending &&
              !occurrencesQuery.isError &&
              filteredOccurrences.length === 0 ? (
                <OccurrencesEmptyState filtered={filtersActive} />
              ) : null}

              {!occurrencesQuery.isPending && !occurrencesQuery.isError
                ? filteredOccurrences.map((occurrence) => (
                    <OccurrenceListItem
                      key={occurrence.id}
                      occurrence={occurrence}
                    />
                  ))
                : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
