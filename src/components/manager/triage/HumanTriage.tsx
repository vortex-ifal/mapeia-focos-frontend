"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { DesktopNavigationRail } from "@/components/manager/navigation/DesktopNavigationRail";
import { ManagerHomeShortcut } from "@/components/manager/navigation/ManagerHomeShortcut";
import { OccurrenceDetailsPanel } from "@/components/manager/triage/OccurrenceDetailsPanel";
import { TerritorialContextPanel } from "@/components/manager/triage/TerritorialContextPanel";
import { TriageReviewPanel } from "@/components/manager/triage/TriageReviewPanel";
import {
  getInitialTriagePhase,
  mapOccurrenceToTriage,
} from "@/controllers/manager/triage.controller";
import {
  getOccurrenceForTriage,
  getTerritorialContext,
  updateOccurrenceStatus,
} from "@/services/api/triage.service";
import type { OccurrenceListItemResponse, TriagePhase } from "@/types/triage";

type PhaseOverride = {
  occurrenceId: string;
  phase: TriagePhase;
};

export function HumanTriage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const occurrenceId = searchParams.get("occurrenceId")?.trim() || null;

  const [phaseOverride, setPhaseOverride] = useState<PhaseOverride | null>(
    null,
  );

  const occurrenceQuery = useQuery({
    queryKey: ["triage", "occurrence", occurrenceId],
    queryFn: () => getOccurrenceForTriage(occurrenceId as string),
    enabled: Boolean(occurrenceId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const occurrence = occurrenceQuery.data
    ? mapOccurrenceToTriage(occurrenceQuery.data)
    : null;

  const phase: TriagePhase =
    occurrence && occurrenceId && phaseOverride?.occurrenceId === occurrenceId
      ? phaseOverride.phase
      : occurrence
        ? getInitialTriagePhase(occurrence.status.key)
        : "review";

  const territorialQuery = useQuery({
    queryKey: ["triage", "territorial-context", occurrenceId, 500],
    queryFn: () => getTerritorialContext(occurrenceId as string, 500, 50),
    enabled:
      Boolean(occurrenceId) &&
      occurrence?.latitude !== null &&
      occurrence?.latitude !== undefined &&
      occurrence?.longitude !== null &&
      occurrence?.longitude !== undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const validationMutation = useMutation({
    mutationFn: () =>
      updateOccurrenceStatus(occurrenceId as string, "accepted"),

    onSuccess: () => {
      queryClient.setQueryData<OccurrenceListItemResponse>(
        ["triage", "occurrence", occurrenceId],
        (currentOccurrence) => {
          if (!currentOccurrence) {
            return currentOccurrence;
          }

          return {
            ...currentOccurrence,
            status: {
              key: "accepted",
              name: "Aceita",
            },
          };
        },
      );

      if (occurrenceId) {
        setPhaseOverride({
          occurrenceId,
          phase: "validated",
        });
      }

      toast.success("Ocorrência validada com sucesso.");
    },
  });

  const rejectionMutation = useMutation({
    mutationFn: () =>
      updateOccurrenceStatus(occurrenceId as string, "rejected"),

    onSuccess: () => {
      toast.success("Ocorrência sinalizada como problema.");

      router.push("/central-operacional");
    },
  });

  const mutationError =
    validationMutation.error instanceof Error
      ? validationMutation.error.message
      : rejectionMutation.error instanceof Error
        ? rejectionMutation.error.message
        : null;

  const territorialErrorMessage =
    territorialQuery.error instanceof Error
      ? territorialQuery.error.message
      : territorialQuery.isError
        ? "Não foi possível carregar o contexto territorial."
        : null;

  function handleRequestValidation() {
    if (!occurrenceId) {
      return;
    }

    setPhaseOverride({
      occurrenceId,
      phase: "confirm-validation",
    });
  }

  function handleDefinePriority() {
    // TODO: connect this action to the manual priority flow when its route is implemented.
    toast.info(
      "O fluxo de definição de prioridade será conectado na próxima etapa.",
    );
  }

  if (!occurrenceId) {
    return (
      <TriagePageState message="Nenhuma ocorrência foi selecionada para triagem." />
    );
  }

  if (occurrenceQuery.isPending) {
    return <TriagePageState message="Carregando ocorrência..." />;
  }

  if (occurrenceQuery.isError) {
    const message =
      occurrenceQuery.error instanceof Error
        ? occurrenceQuery.error.message
        : "Não foi possível carregar a ocorrência.";

    return <TriagePageState message={message} error />;
  }

  if (!occurrence) {
    return (
      <TriagePageState
        message="A ocorrência selecionada não foi encontrada."
        error
      />
    );
  }

  const territorialLoading =
    territorialQuery.isPending && territorialQuery.fetchStatus !== "idle";

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
              text-[#171717]
            "
          >
            Triagem
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

              md:grid-cols-2

              lg:h-[calc(100dvh-132px)]
              lg:min-h-[620px]
              lg:max-h-[768px]
              lg:grid-cols-[minmax(300px,420px)_minmax(300px,430px)_minmax(320px,442px)]
            "
          >
            <OccurrenceDetailsPanel
              occurrence={occurrence}
              territorialContext={territorialQuery.data ?? null}
              territorialLoading={territorialLoading}
              territorialErrorMessage={territorialErrorMessage}
            />

            <TriageReviewPanel
              phase={phase}
              validating={validationMutation.isPending}
              rejecting={rejectionMutation.isPending}
              errorMessage={mutationError}
              onRequestValidation={handleRequestValidation}
              onConfirmValidation={() => {
                validationMutation.mutate();
              }}
              onReject={() => {
                rejectionMutation.mutate();
              }}
              onDefinePriority={handleDefinePriority}
            />

            <div
              className="
                md:col-span-2
                lg:col-span-1
                lg:h-full
              "
            >
              <TerritorialContextPanel
                occurrence={occurrence}
                context={territorialQuery.data ?? null}
                loading={territorialLoading}
                errorMessage={territorialErrorMessage}
                onRetry={() => {
                  void territorialQuery.refetch();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type TriagePageStateProps = {
  message: string;
  error?: boolean;
};

function TriagePageState({ message, error = false }: TriagePageStateProps) {
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
        <header
          className="
            flex
            items-center
            gap-4
          "
        >
          <ManagerHomeShortcut />

          <h1
            className="
              text-[30px]
              font-extrabold
              tracking-[-0.6px]
            "
          >
            Triagem
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