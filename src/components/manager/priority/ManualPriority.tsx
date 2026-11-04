"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { DesktopNavigationRail } from "@/components/manager/navigation/DesktopNavigationRail";
import { ManagerHomeShortcut } from "@/components/manager/navigation/ManagerHomeShortcut";
import { PriorityActionPanel } from "@/components/manager/priority/PriorityActionPanel";
import { PriorityContextPanel } from "@/components/manager/priority/PriorityContextPanel";
import {
  canDefineOccurrencePriority,
  mapOccurrenceToPriority,
} from "@/controllers/manager/priority.controller";
import {
  getOccurrenceForPriority,
  updateOccurrencePriority,
} from "@/services/api/priority.service";
import type { OperationalPriority } from "@/types/operations";
import type { PriorityOccurrenceResponse } from "@/types/priority";

type PrioritySelectionOverride = {
  occurrenceId: string;
  priority: OperationalPriority;
};

export function ManualPriority() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const occurrenceId = searchParams.get("occurrenceId")?.trim() || null;

  const [selectionOverride, setSelectionOverride] =
    useState<PrioritySelectionOverride | null>(null);

  const occurrenceQuery = useQuery({
    queryKey: ["priority", "occurrence", occurrenceId],
    queryFn: () => getOccurrenceForPriority(occurrenceId as string),
    enabled: Boolean(occurrenceId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const occurrence = occurrenceQuery.data
    ? mapOccurrenceToPriority(occurrenceQuery.data)
    : null;

  const selectedPriority =
    occurrence &&
    occurrenceId &&
    selectionOverride?.occurrenceId === occurrenceId
      ? selectionOverride.priority
      : (occurrence?.priority ?? null);

  const priorityAllowed = occurrence
    ? canDefineOccurrencePriority(occurrence)
    : false;

  const priorityMutation = useMutation({
    mutationFn: (priority: OperationalPriority) =>
      updateOccurrencePriority(occurrenceId as string, priority),

    onSuccess: (_, priority) => {
      queryClient.setQueryData<PriorityOccurrenceResponse>(
        ["priority", "occurrence", occurrenceId],
        (currentOccurrence) => {
          if (!currentOccurrence) {
            return currentOccurrence;
          }

          return {
            ...currentOccurrence,
            priority,
          };
        },
      );

      toast.success("Prioridade definida com sucesso.");

      router.push("/central-operacional");
    },
  });

  const mutationError =
    priorityMutation.error instanceof Error
      ? priorityMutation.error.message
      : null;

  function handleSelectPriority(priority: OperationalPriority) {
    if (!occurrenceId) {
      return;
    }

    setSelectionOverride({
      occurrenceId,
      priority,
    });
  }

  function handleSubmit() {
    if (
      !occurrenceId ||
      !selectedPriority ||
      !priorityAllowed ||
      priorityMutation.isPending
    ) {
      return;
    }

    priorityMutation.mutate(selectedPriority);
  }

  if (!occurrenceId) {
    return (
      <PriorityPageState
        message="Nenhuma ocorrência foi selecionada para definição de prioridade."
        error
      />
    );
  }

  if (occurrenceQuery.isPending) {
    return <PriorityPageState message="Carregando ocorrência..." />;
  }

  if (occurrenceQuery.isError) {
    const message =
      occurrenceQuery.error instanceof Error
        ? occurrenceQuery.error.message
        : "Não foi possível carregar a ocorrência.";

    return <PriorityPageState message={message} error />;
  }

  if (!occurrence) {
    return (
      <PriorityPageState
        message="A ocorrência selecionada não foi encontrada."
        error
      />
    );
  }

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
            lg:gap-3
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
            Priority / Set
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

          <div
            className="
              grid
              min-w-0
              grid-cols-1
              gap-4

              md:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.95fr)]

              lg:h-[calc(100dvh-132px)]
              lg:min-h-[620px]
              lg:max-h-[768px]
              lg:grid-cols-[minmax(420px,720px)_minmax(360px,560px)]
            "
          >
            <PriorityContextPanel occurrence={occurrence} />

            <PriorityActionPanel
              selectedPriority={selectedPriority}
              saving={priorityMutation.isPending}
              disabled={!priorityAllowed}
              errorMessage={
                !priorityAllowed
                  ? "A prioridade só pode ser definida para uma ocorrência validada."
                  : mutationError
              }
              onSelect={handleSelectPriority}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

type PriorityPageStateProps = {
  message: string;
  error?: boolean;
};

function PriorityPageState({ message, error = false }: PriorityPageStateProps) {
  return (
    <main
      className="
        min-h-dvh
        bg-[#FBF8F2]
        px-5
        py-[30px]
        text-[#171717]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1440px]
        "
      >
        <header className="flex items-center gap-4">
          <ManagerHomeShortcut />

          <h1
            className="
              text-[30px]
              font-extrabold
              tracking-[-0.6px]
            "
          >
            Priority / Set
          </h1>
        </header>

        <div
          className="
            mt-6
            max-w-[520px]
            rounded-[16px]
            border
            border-[#E9E0D4]
            bg-white
            p-5
          "
        >
          <p
            className={
              error
                ? "text-[14px] text-[#9D352D]"
                : "text-[14px] text-[#716B67]"
            }
          >
            {message}
          </p>
        </div>
      </div>
    </main>
  );
}