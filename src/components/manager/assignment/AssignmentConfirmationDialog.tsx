import { Button } from "@/components/ui/Button";
import type { AssignmentAgent } from "@/types/assignment";

type AssignmentConfirmationDialogProps = {
  agent: AssignmentAgent;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AssignmentConfirmationDialog({
  agent,
  saving,
  onCancel,
  onConfirm,
}: AssignmentConfirmationDialogProps) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/20
        px-4
      "
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-dialog-title"
        className="
          w-full
          max-w-[390px]
          rounded-[16px]
          border
          border-[#E9E0D4]
          bg-[#FBF8F2]
          p-[22px]
        "
      >
        <div
          className="
            rounded-[14px]
            border
            border-[#E9E0D4]
            bg-white
            p-5
          "
        >
          <h2
            id="assignment-dialog-title"
            className="
              text-[20px]
              font-bold
              text-[#171717]
            "
          >
            Confirmar atribuição?
          </h2>

          <p
            className="
              mt-3
              text-[13px]
              leading-5
              text-[#716B67]
            "
          >
            {agent.name} receberá esta ocorrência em sua fila de trabalho.
          </p>

          <div
            className="
              mt-5
              flex
              justify-end
              gap-2
            "
          >
            <Button
              variant="secondary"
              disabled={saving}
              onClick={onCancel}
              className="h-10"
            >
              Cancelar
            </Button>

            <Button loading={saving} onClick={onConfirm} className="h-10">
              Atribuir agente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}