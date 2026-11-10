import { AgentOption } from "@/components/manager/assignment/AgentOption";
import { Button } from "@/components/ui/Button";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import type { AssignmentAgent, AssignmentSuccess } from "@/types/assignment";

type AssignmentActionPanelProps = {
  agents: AssignmentAgent[];
  selectedAgentId: string | null;
  assignment: AssignmentSuccess | null;
  loading: boolean;
  saving: boolean;
  errorMessage: string | null;
  disabled?: boolean;
  onSelect: (agentId: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
};

export function AssignmentActionPanel({
  agents,
  selectedAgentId,
  assignment,
  loading,
  saving,
  errorMessage,
  disabled = false,
  onSelect,
  onSubmit,
  onRetry,
}: AssignmentActionPanelProps) {
  return (
    <section
      className="
        min-h-[360px]
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
          leading-[26px]
        "
      >
        Responsável
      </h2>

      {loading ? (
        <p
          className="
            mt-[10px]
            text-[13px]
            text-[#716B67]
          "
        >
          Carregando agentes...
        </p>
      ) : null}

      {!loading && errorMessage ? (
        <div
          className="
            mt-[10px]
            rounded-[10px]
            bg-[#F8E3E0]
            p-3
          "
        >
          <p
            className="
              text-[12px]
              text-[#9D352D]
            "
          >
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="
              mt-2
              text-[12px]
              font-bold
              text-[#9D352D]
              underline
            "
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!loading && !errorMessage ? (
        <div
          role="radiogroup"
          aria-label="Selecionar responsável"
          className="
            mt-[10px]
            flex
            flex-col
            gap-[10px]
          "
        >
          {agents.map((agent) => (
            <AgentOption
              key={agent.id}
              agent={agent}
              selected={selectedAgentId === agent.id}
              disabled={Boolean(assignment) || disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}

      {!assignment && !loading && !errorMessage ? (
        <Button
          disabled={!selectedAgentId || disabled}
          loading={saving}
          onClick={onSubmit}
          className="
            mt-[10px]
            w-[220px]
          "
        >
          Atribuir agente
        </Button>
      ) : null}

      {assignment ? (
        <FeedbackAlert className="mt-[10px]">
          {assignment.agent.name} foi atribuída a esta ocorrência.
        </FeedbackAlert>
      ) : null}
    </section>
  );
}