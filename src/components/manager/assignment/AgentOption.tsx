import { getAgentMetadata } from "@/controllers/manager/assignment.controller";
import type { AssignmentAgent } from "@/types/assignment";

type AgentOptionProps = {
  agent: AssignmentAgent;
  selected: boolean;
  disabled?: boolean;
  onSelect: (agentId: string) => void;
};

export function AgentOption({
  agent,
  selected,
  disabled = false,
  onSelect,
}: AgentOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(agent.id)}
      className={`
        flex
        min-h-[78px]
        w-full
        items-center
        gap-3
        rounded-[12px]
        border
        px-3
        text-left
        transition
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#C94F32]
        focus-visible:ring-offset-2
        ${
          selected
            ? "border-[#C94F32] bg-[#FBF8F2]"
            : "border-[#E9E0D4] bg-white hover:bg-[#FBF8F2]"
        }
        ${disabled ? "cursor-default" : "cursor-pointer"}
      `}
    >
      <span
        aria-hidden="true"
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#EEE8ED]
        "
      />

      <span className="min-w-0 flex-1">
        <span
          className="
            block
            truncate
            text-[13px]
            font-bold
            text-[#171717]
          "
        >
          {agent.name}
        </span>

        <span
          className="
            mt-1
            block
            truncate
            text-[11px]
            text-[#716B67]
          "
        >
          {getAgentMetadata(agent)}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={`
          flex
          h-[18px]
          w-[18px]
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${selected ? "border-[#C94F32]" : "border-[#E9E0D4]"}
        `}
      >
        {selected ? (
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-[#C94F32]
            "
          />
        ) : null}
      </span>
    </button>
  );
}