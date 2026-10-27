import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { Button } from "@/components/ui/Button";
import type { TriagePhase } from "@/types/triage";

type TriageReviewPanelProps = {
  phase: TriagePhase;
  validating: boolean;
  rejecting: boolean;
  errorMessage: string | null;
  onRequestValidation: () => void;
  onConfirmValidation: () => void;
  onReject: () => void;
  onDefinePriority: () => void;
};

function getFeedbackMessage(phase: TriagePhase): string {
  if (phase === "confirm-validation") {
    return "A ocorrência pode seguir para priorização e despacho.";
  }

  if (phase === "validated") {
    return "Ocorrência validada. Agora defina prioridade e responsável.";
  }

  return "Revise evidências, localização e descrição antes de decidir.";
}

export function TriageReviewPanel({
  phase,
  validating,
  rejecting,
  errorMessage,
  onRequestValidation,
  onConfirmValidation,
  onReject,
  onDefinePriority,
}: TriageReviewPanelProps) {
  const busy = validating || rejecting;

  return (
    <section
      aria-labelledby="triage-review-title"
      className="
        h-full
        min-h-[620px]
        w-full
        min-w-0
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[17px]
      "
    >
      <h2
        id="triage-review-title"
        className="
          text-[20px]
          font-bold
          leading-[26px]
          text-[#171717]
        "
      >
        Revisão
      </h2>

      <FeedbackAlert className="mt-[10px]">
        {getFeedbackMessage(phase)}
      </FeedbackAlert>

      {phase === "review" ? (
        <div
          className="
            mt-[10px]
            flex
            flex-col
            items-start
            gap-[10px]
          "
        >
          <Button
            onClick={onRequestValidation}
            disabled={busy}
            className="w-[220px]"
          >
            Validar ocorrência
          </Button>

          <Button
            variant="secondary"
            onClick={onReject}
            loading={rejecting}
            disabled={validating}
            className="
              w-[220px]
              !h-11
            "
          >
            Sinalizar problema
          </Button>
        </div>
      ) : null}

      {phase === "confirm-validation" ? (
        <div className="mt-[10px]">
          <Button
            onClick={onConfirmValidation}
            loading={validating}
            disabled={rejecting}
            className="w-[220px]"
          >
            Validar ocorrência
          </Button>
        </div>
      ) : null}

      {phase === "validated" ? (
        <div className="mt-[10px]">
          <Button onClick={onDefinePriority} className="w-[220px]">
            Definir prioridade
          </Button>
        </div>
      ) : null}

      {errorMessage ? (
        <p
          role="alert"
          className="
            mt-3
            max-w-[398px]
            text-[12px]
            leading-[1.45]
            text-[#9D352D]
          "
        >
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}