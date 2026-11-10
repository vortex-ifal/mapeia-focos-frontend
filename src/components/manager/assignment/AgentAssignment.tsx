"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { AssignmentActionPanel } from "@/components/manager/assignment/AssignmentActionPanel";
import { AssignmentConfirmationDialog } from "@/components/manager/assignment/AssignmentConfirmationDialog";
import { AssignmentContextPanel } from "@/components/manager/assignment/AssignmentContextPanel";
import { DesktopNavigationRail } from "@/components/manager/navigation/DesktopNavigationRail";
import { ManagerHomeShortcut } from "@/components/manager/navigation/ManagerHomeShortcut";
import {
  canAssignOccurrence,
  mapAgentToAssignment,
  mapOccurrenceToAssignment,
} from "@/controllers/manager/assignment.controller";
import {
  assignOccurrenceToAgent,
  getAgentsForAssignment,
  getOccurrenceForAssignment,
} from "@/services/api/assignment.service";
import type { AssignmentSuccess } from "@/types/assignment";

export function AgentAssignment() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const occurrenceId = searchParams.get("occurrenceId")?.trim() || null;

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [assignment, setAssignment] = useState<AssignmentSuccess | null>(null);

  const occurrenceQuery = useQuery({
    queryKey: ["assignment", "occurrence", occurrenceId],
    queryFn: () => getOccurrenceForAssignment(occurrenceId as string),
    enabled: Boolean(occurrenceId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const agentsQuery = useQuery({
    queryKey: ["assignment", "agents"],
    queryFn: getAgentsForAssignment,
    enabled: Boolean(occurrenceId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const occurrence = occurrenceQuery.data
    ? mapOccurrenceToAssignment(occurrenceQuery.data)
    : null;

  const agents = useMemo(
    () => (agentsQuery.data ?? []).map(mapAgentToAssignment),
    [agentsQuery.data],
  );

  const selectedAgent =
    agents.find((agent) => agent.id === selectedAgentId) ?? null;

  const assignmentAllowed = occurrence
    ? canAssignOccurrence(occurrence)
    : false;

  const assignmentMutation = useMutation({
    mutationFn: ({ agentId }: { agentId: string }) =>
      assignOccurrenceToAgent(occurrenceId as string, agentId),

    onSuccess: () => {
      if (!selectedAgent || !occurrenceId) {
        return;
      }

      setAssignment({
        agent: selectedAgent,
        assignedAt: Date.now(),
      });

      setConfirmationOpen(false);

      /*
       * The backend changes the occurrence status to
       * forwarded_for_inspection during assignment.
       *
       * Invalidating the related queries prevents stale data when the
       * manager returns to the occurrence details or operational center.
       */
      void queryClient.invalidateQueries({
        queryKey: ["manager", "occurrence", occurrenceId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["assignment", "occurrence", occurrenceId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["operations", "triage-queue"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["occurrences"],
      });

      toast.success("Agente atribuído com sucesso.");
    },
  });

  const mutationError =
    assignmentMutation.error instanceof Error
      ? assignmentMutation.error.message
      : null;

  function handleSelectAgent(agentId: string) {
    if (assignment) {
      return;
    }

    setSelectedAgentId(agentId);
  }

  function handleSubmit() {
    if (
      !selectedAgent ||
      !assignmentAllowed ||
      assignmentMutation.isPending ||
      assignment
    ) {
      return;
    }

    setConfirmationOpen(true);
  }

  function handleConfirm() {
    if (
      !selectedAgent ||
      !occurrenceId ||
      !assignmentAllowed ||
      assignmentMutation.isPending
    ) {
      return;
    }

    assignmentMutation.mutate({
      agentId: selectedAgent.id,
    });
  }

  function handleCancelConfirmation() {
    if (assignmentMutation.isPending) {
      return;
    }

    setConfirmationOpen(false);
  }

  if (!occurrenceId) {
    return (
      <AssignmentPageState
        message="Nenhuma ocorrência foi selecionada para atribuição."
        error
      />
    );
  }

  if (occurrenceQuery.isPending) {
    return <AssignmentPageState message="Carregando ocorrência..." />;
  }

  if (occurrenceQuery.isError) {
    const message =
      occurrenceQuery.error instanceof Error
        ? occurrenceQuery.error.message
        : "Não foi possível carregar a ocorrência.";

    return <AssignmentPageState message={message} error />;
  }

  if (!occurrence) {
    return (
      <AssignmentPageState
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
            grid
            h-14
            grid-cols-[64px_minmax(0,1fr)]
            gap-3
          "
        >
          <ManagerHomeShortcut className="ml-1" />

          <div
            className="
              flex
              items-center
              gap-3
              pt-1
            "
          >
            <Link
              href={`/central-operacional/ocorrencias/${encodeURIComponent(
                occurrenceId,
              )}`}
              aria-label="Voltar para detalhes da ocorrência"
              title="Voltar"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[10px]
                text-[#584A57]
                transition-colors
                hover:bg-[#F4EFE6]
                hover:text-[#C94F32]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
              "
            >
              <ChevronLeft size={24} strokeWidth={1.8} aria-hidden="true" />
            </Link>

            <h1
              className="
                text-[30px]
                font-extrabold
                leading-[1.2]
                tracking-[-0.6px]
              "
            >
              Atribuir agente
            </h1>
          </div>
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

              md:grid-cols-[minmax(0,1fr)_minmax(360px,1fr)]

              lg:h-[calc(100dvh-132px)]
              lg:min-h-[620px]
              lg:max-h-[768px]
              lg:grid-cols-[minmax(420px,650px)_minmax(420px,630px)]
            "
          >
            <AssignmentContextPanel
              occurrence={occurrence}
              assignment={assignment}
            />

            <AssignmentActionPanel
              agents={agents}
              selectedAgentId={selectedAgentId}
              assignment={assignment}
              loading={agentsQuery.isPending}
              saving={assignmentMutation.isPending}
              disabled={!assignmentAllowed}
              errorMessage={
                agentsQuery.isError
                  ? agentsQuery.error instanceof Error
                    ? agentsQuery.error.message
                    : "Não foi possível carregar os agentes."
                  : !assignmentAllowed
                    ? "A ocorrência precisa estar validada e possuir prioridade antes da atribuição."
                    : mutationError
              }
              onSelect={handleSelectAgent}
              onSubmit={handleSubmit}
              onRetry={() => {
                void agentsQuery.refetch();
              }}
            />
          </div>
        </div>
      </div>

      {confirmationOpen && selectedAgent ? (
        <AssignmentConfirmationDialog
          agent={selectedAgent}
          saving={assignmentMutation.isPending}
          onCancel={handleCancelConfirmation}
          onConfirm={handleConfirm}
        />
      ) : null}
    </main>
  );
}

type AssignmentPageStateProps = {
  message: string;
  error?: boolean;
};

function AssignmentPageState({
  message,
  error = false,
}: AssignmentPageStateProps) {
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
            Atribuir agente
          </h1>
        </header>

        <div
          className={`
            mt-6
            max-w-[520px]
            rounded-[16px]
            border
            border-[#E9E0D4]
            bg-white
            p-5
            text-[14px]
            ${error ? "text-[#9D352D]" : "text-[#716B67]"}
          `}
        >
          {message}
        </div>
      </div>
    </main>
  );
}