import {
  formatAssignedElapsed,
  getOccurrenceAssignmentContext,
} from "@/controllers/manager/assignment.controller";
import type {
  AssignmentOccurrence,
  AssignmentSuccess,
} from "@/types/assignment";

type AssignmentContextPanelProps = {
  occurrence: AssignmentOccurrence;
  assignment: AssignmentSuccess | null;
};

export function AssignmentContextPanel({
  occurrence,
  assignment,
}: AssignmentContextPanelProps) {
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
          text-[26px]
          font-extrabold
          leading-[33px]
          tracking-[-0.4px]
        "
      >
        {occurrence.displayCode}
      </h2>

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
            text-[11px]
            text-[#716B67]
          "
        >
          {getOccurrenceAssignmentContext(occurrence)}
        </p>
      </div>

      {assignment ? (
        <div
          className="
            mt-[10px]
            min-h-[96px]
            rounded-[12px]
            border
            border-[#E9E0D4]
            px-3
            py-[11px]
          "
        >
          <p
            className="
              text-[11px]
              text-[#716B67]
            "
          >
            Responsável
          </p>

          <p
            className="
              mt-1
              text-[13px]
              font-bold
            "
          >
            {assignment.agent.name}
          </p>

          <p
            className="
              mt-2
              text-[11px]
              text-[#716B67]
            "
          >
            {formatAssignedElapsed(assignment.assignedAt)}
          </p>
        </div>
      ) : null}
    </section>
  );
}