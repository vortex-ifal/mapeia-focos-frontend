"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { OccurrenceHistory } from "@/components/manager/occurrence-details/OccurrenceHistory";
import { OccurrenceArchiveAction } from "@/components/manager/occurrence-details/OccurrenceArchiveAction";
import { DesktopNavigationRail } from "@/components/manager/navigation/DesktopNavigationRail";
import { ManagerHomeShortcut } from "@/components/manager/navigation/ManagerHomeShortcut";
import { MediaThumbnail } from "@/components/manager/operations/MediaThumbnail";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  canAssignOccurrenceAgent,
  canManageOccurrencePriority,
  getLocationContext,
  getOccurrenceAssignmentPath,
  getOccurrencePriorityLabel,
  getOccurrencePriorityPath,
  getOccurrenceStatusLabel,
  getOccurrenceTriagePath,
  isOccurrenceClosed,
  needsOccurrenceTriage,
} from "@/controllers/manager/occurrence-details.controller";
import {
  getOccurrenceDetails,
  getOccurrenceHistory,
} from "@/services/api/occurrence-details.service";
import type {
  OccurrenceDetail,
  OccurrenceDetailMedia,
  OccurrenceHistoryItem,
} from "@/types/occurrence-details";
import { formatRelativeElapsedTime } from "@/utils/occurrence.utils";

type OccurrenceDetailsProps = {
  occurrenceId: string;
};

export function OccurrenceDetails({ occurrenceId }: OccurrenceDetailsProps) {
  const occurrenceQuery = useQuery({
    queryKey: ["manager", "occurrence", occurrenceId],

    queryFn: () => getOccurrenceDetails(occurrenceId),

    staleTime: 30_000,

    refetchOnWindowFocus: false,
  });

  const historyQuery = useQuery({
    queryKey: ["manager", "occurrence", occurrenceId, "history"],

    queryFn: () => getOccurrenceHistory(occurrenceId),

    enabled: occurrenceQuery.isSuccess,

    staleTime: 30_000,

    refetchOnWindowFocus: false,
  });

  const occurrence = occurrenceQuery.data;

  const historyError = historyQuery.isError
    ? historyQuery.error instanceof Error
      ? historyQuery.error.message
      : "Não foi possível carregar o histórico da ocorrência."
    : null;

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
              href="/central-operacional/ocorrencias"
              aria-label="Voltar para ocorrências"
              title="Voltar para ocorrências"
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
              Detalhe da Ocorrência
            </h1>
          </div>
        </header>

        <div
          className="
            mt-6
            grid
            min-w-0
            grid-cols-1
            lg:grid-cols-[64px_minmax(0,1fr)]
            lg:gap-3
          "
        >
          <DesktopNavigationRail />

          {occurrenceQuery.isPending ? (
            <OccurrenceState>
              Carregando detalhes da ocorrência...
            </OccurrenceState>
          ) : null}

          {occurrenceQuery.isError ? (
            <OccurrenceState error>
              {occurrenceQuery.error instanceof Error
                ? occurrenceQuery.error.message
                : "Não foi possível carregar a ocorrência."}
            </OccurrenceState>
          ) : null}

          {occurrence ? (
            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-4
                lg:h-[calc(100dvh-132px)]
                lg:min-h-[560px]
                lg:max-h-[768px]
                lg:grid-cols-[minmax(0,720px)_minmax(0,560px)]
              "
            >
              <OccurrenceMainPanel
                occurrence={occurrence}
                history={historyQuery.data ?? []}
                historyLoading={historyQuery.isPending}
                historyError={historyError}
                onHistoryRetry={() => {
                  void historyQuery.refetch();
                }}
              />

              <OperationalDetailsPanel occurrence={occurrence} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

type OccurrenceMainPanelProps = {
  occurrence: OccurrenceDetail;
  history: OccurrenceHistoryItem[];
  historyLoading: boolean;
  historyError: string | null;
  onHistoryRetry: () => void;
};

function OccurrenceMainPanel({
  occurrence,
  history,
  historyLoading,
  historyError,
  onHistoryRetry,
}: OccurrenceMainPanelProps) {
  const statusLabel = getOccurrenceStatusLabel(occurrence.status);

  const locationContext = getLocationContext(
    occurrence.address,
    occurrence.latitude,
    occurrence.longitude,
  );

  return (
    <section
      aria-labelledby="occurrence-code"
      className="
        min-w-0
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[17px]
        lg:h-full
        lg:min-h-0
        lg:overflow-y-auto
      "
    >
      <h2
        id="occurrence-code"
        className="
          text-[25px]
          font-extrabold
          leading-[1.3]
          tracking-[-0.4px]
        "
      >
        #{occurrence.protocol.toUpperCase()}
      </h2>

      <div
        className="
          mt-[10px]
          flex
          flex-wrap
          gap-2
        "
      >
        {occurrence.priority ? (
          <PriorityBadge value={occurrence.priority} />
        ) : (
          <span
            className="
              flex
              h-9
              items-center
              rounded-full
              bg-[#FAEBC8]
              px-3
              text-[12px]
              font-semibold
            "
          >
            Sem prioridade
          </span>
        )}

        <StatusBadge label={statusLabel} />
        {occurrence.isArchived ? (
          <span className="inline-flex h-9 items-center rounded-full border border-[#D2CBC5] bg-[#F4EFE6] px-3 text-[12px] font-semibold text-[#584A57]">Arquivada</span>
        ) : null}
      </div>

      <div
        className="
          mt-[10px]
          min-h-[88px]
          rounded-[12px]
          border
          border-[#E9E0D4]
          px-3
          py-[11px]
        "
      >
        <p
          className="
            text-[13px]
            font-bold
          "
        >
          {occurrence.address}
        </p>

        <p
          className="
            mt-1
            text-[12px]
            text-[#716B67]
          "
        >
          {locationContext}
        </p>
      </div>

      <EvidenceSection
        media={occurrence.media}
        protocol={occurrence.protocol}
      />

      <section
        className="
          mt-[10px]
          rounded-[12px]
          border
          border-[#E9E0D4]
          px-[14px]
          py-[14px]
        "
      >
        <h3
          className="
            text-[14px]
            font-bold
          "
        >
          Descrição da ocorrência
        </h3>

        <p
          className="
            mt-2
            text-[13px]
            leading-[1.45]
          "
        >
          {occurrence.description}
        </p>
      </section>

      <OccurrenceHistory
        history={history}
        isLoading={historyLoading}
        error={historyError}
        onRetry={onHistoryRetry}
      />
    </section>
  );
}

type EvidenceSectionProps = {
  media: OccurrenceDetailMedia[];
  protocol: string;
};

function EvidenceSection({ media, protocol }: EvidenceSectionProps) {
  if (media.length === 0) {
    return (
      <p
        className="
          mt-[10px]
          text-[13px]
          text-[#716B67]
        "
      >
        Nenhuma evidência anexada a esta ocorrência.
      </p>
    );
  }

  return (
    <section
      aria-labelledby="occurrence-evidence-title"
      className="
        mt-[10px]
        rounded-[12px]
        border
        border-[#E9E0D4]
        px-[14px]
        py-[14px]
      "
    >
      <h3
        id="occurrence-evidence-title"
        className="
          text-[14px]
          font-bold
        "
      >
        Evidências
      </h3>

      <div
        className="
          mt-3
          flex
          flex-wrap
          gap-2
        "
      >
        {media.slice(0, 3).map((item, index) => {
          const alt = `Evidência ${index + 1} da ocorrência ${protocol.toUpperCase()}`;

          if (!item.url) {
            return (
              <div
                key={item.id}
                title="Não foi possível carregar esta evidência."
              >
                <MediaThumbnail alt={alt} type={item.type} />
              </div>
            );
          }

          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title="Abrir evidência"
              aria-label={`Abrir ${alt}`}
              className="
                    rounded-[10px]
                    transition
                    hover:opacity-90
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#C94F32]
                    focus-visible:ring-offset-2
                  "
            >
              <MediaThumbnail alt={alt} src={item.url} type={item.type} />
            </a>
          );
        })}
      </div>

      <p
        className="
          mt-[10px]
          text-[13px]
          text-[#716B67]
        "
      >
        {media.length}{" "}
        {media.length === 1 ? "evidência registrada" : "evidências registradas"}{" "}
        nesta ocorrência.
      </p>
    </section>
  );
}

type OperationalDetailsPanelProps = {
  occurrence: OccurrenceDetail;
};

function OperationalDetailsPanel({ occurrence }: OperationalDetailsPanelProps) {
  const statusLabel = getOccurrenceStatusLabel(occurrence.status);

  const priorityLabel = getOccurrencePriorityLabel(occurrence.priority);

  const canManagePriority = !occurrence.isArchived && canManageOccurrencePriority(occurrence.status);

  const canAssignAgent = !occurrence.isArchived && canAssignOccurrenceAgent(
    occurrence.status,
    occurrence.priority,
  );

  const needsTriage = !occurrence.isArchived && needsOccurrenceTriage(occurrence.status);

  const occurrenceClosed = occurrence.isArchived || isOccurrenceClosed(occurrence.status);

  const priorityActionLabel = occurrence.priority
    ? "Editar prioridade"
    : "Definir prioridade";

  return (
    <aside
      className="
        min-w-0
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[17px]
        lg:h-full
        lg:min-h-0
        lg:overflow-y-auto
      "
    >
      <h2
        className="
          text-[20px]
          font-bold
        "
      >
        Detalhes operacionais
      </h2>

      <div
        className="
          mt-[10px]
          min-h-[52px]
          rounded-[10px]
          bg-[#EEE8ED]
          px-3
          py-[10px]
        "
      >
        <p
          className="
            text-[12px]
            leading-[1.45]
            text-[#584A57]
          "
        >
          Consulte localização, evidências, status e histórico antes de agir.
        </p>
      </div>

      {occurrenceClosed ? (
        <div
          role="status"
          className="
            mt-[10px]
            rounded-[10px]
            border
            border-[#E9E0D4]
            bg-[#F4EFE6]
            px-3
            py-3
          "
        >
          <p
            className="
              text-[12px]
              font-semibold
              leading-[1.45]
              text-[#716B67]
            "
          >
            {occurrence.isArchived
              ? "Esta ocorrência está arquivada. Restaure-a para voltar a gerenciá-la."
              : "Esta ocorrência está encerrada. As ações de edição, prioridade e despacho estão bloqueadas."}
          </p>
        </div>
      ) : null}

      <div
        className="
          mt-[10px]
          overflow-hidden
          rounded-[12px]
          border
          border-[#E9E0D4]
          px-[14px]
          py-[10px]
        "
      >
        <OperationalRow
          label="Status atual"
          value={<StatusBadge label={statusLabel} />}
        />

        <OperationalDivider />

        <OperationalRow
          label="Prioridade"
          value={
            occurrence.priority ? (
              <PriorityBadge value={occurrence.priority} />
            ) : (
              <span
                className="
                  rounded-full
                  bg-[#FAEBC8]
                  px-3
                  py-2
                  text-[12px]
                  font-semibold
                "
              >
                {priorityLabel}
              </span>
            )
          }
        />

        <OperationalDivider />

        <OperationalRow
          label="Responsável"
          value={
            occurrence.assignedAgent ? (
              <span
                className="
                  font-semibold
                  text-[#171717]
                "
              >
                {occurrence.assignedAgent.name}
              </span>
            ) : (
              <span
                className="
                  font-semibold
                  text-[#716B67]
                "
              >
                Não atribuído
              </span>
            )
          }
        />

        <OperationalDivider />

        <OperationalRow
          label="Última atualização"
          value={
            <span className="font-semibold">
              {formatRelativeElapsedTime(occurrence.updatedAt)}
            </span>
          }
        />

        <OperationalDivider />

        <OperationalRow
          label="Protocolo"
          value={
            <span className="font-semibold">
              {occurrence.protocol.toUpperCase()}
            </span>
          }
        />
      </div>

      <section
        aria-labelledby="occurrence-actions-title"
        className="
          mt-[14px]
        "
      >
        <h3
          id="occurrence-actions-title"
          className="
            text-[13px]
            font-bold
            text-[#171717]
          "
        >
          Ações
        </h3>

        <div
          className="
            mt-[10px]
            flex
            flex-col
            gap-[10px]
          "
        >
          {needsTriage ? (
            <Link
              href={getOccurrenceTriagePath(occurrence.id)}
              className="
                flex
                h-11
                items-center
                justify-center
                rounded-[12px]
                bg-[#C94F32]
                text-[13px]
                font-bold
                text-white
                transition-colors
                hover:bg-[#B9472E]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
              "
            >
              Revisar ocorrência
            </Link>
          ) : (
            <DisabledActionButton>Revisar ocorrência</DisabledActionButton>
          )}

          {canManagePriority ? (
            <Link
              href={getOccurrencePriorityPath(occurrence.id)}
              className="
                flex
                h-11
                items-center
                justify-center
                rounded-[12px]
                border
                border-[#E9E0D4]
                bg-white
                text-[13px]
                font-bold
                text-[#171717]
                transition-colors
                hover:bg-[#F4EFE6]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
              "
            >
              {priorityActionLabel}
            </Link>
          ) : (
            <DisabledActionButton>{priorityActionLabel}</DisabledActionButton>
          )}

          {canAssignAgent ? (
            <Link
              href={getOccurrenceAssignmentPath(occurrence.id)}
              className="
                flex
                h-11
                items-center
                justify-center
                rounded-[12px]
                bg-[#C94F32]
                text-[13px]
                font-bold
                text-white
                transition-colors
                hover:bg-[#B9472E]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
              "
            >
              Atribuir agente
            </Link>
          ) : (
            <DisabledActionButton>Atribuir agente</DisabledActionButton>
          )}

          <OccurrenceArchiveAction
            occurrenceId={occurrence.id}
            protocol={occurrence.protocol}
            isArchived={occurrence.isArchived}
            isClosed={isOccurrenceClosed(occurrence.status)}
          />
        </div>
      </section>
    </aside>
  );
}

type DisabledActionButtonProps = {
  children: React.ReactNode;
};

function DisabledActionButton({ children }: DisabledActionButtonProps) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="
        flex
        h-11
        w-full
        cursor-not-allowed
        items-center
        justify-center
        rounded-[12px]
        border
        border-[#E9E0D4]
        bg-[#F4EFE6]
        text-[13px]
        font-bold
        text-[#A8A29E]
      "
    >
      {children}
    </button>
  );
}

type OperationalRowProps = {
  label: string;
  value: React.ReactNode;
};

function OperationalRow({ label, value }: OperationalRowProps) {
  return (
    <div
      className="
        flex
        min-h-[46px]
        items-center
        justify-between
        gap-4
      "
    >
      <span
        className="
          text-[13px]
          text-[#716B67]
        "
      >
        {label}
      </span>

      <div className="text-[13px]">{value}</div>
    </div>
  );
}

function OperationalDivider() {
  return (
    <div
      aria-hidden="true"
      className="
        h-px
        w-full
        bg-[#E9E0D4]
      "
    />
  );
}

type OccurrenceStateProps = {
  children: React.ReactNode;
  error?: boolean;
};

function OccurrenceState({ children, error = false }: OccurrenceStateProps) {
  return (
    <div
      className={`
        rounded-[16px]
        border
        p-5
        text-[13px]
        ${
          error
            ? "border-[#F8E3E0] bg-[#F8E3E0] text-[#9D352D]"
            : "border-[#E9E0D4] bg-white text-[#716B67]"
        }
      `}
    >
      {children}
    </div>
  );
}