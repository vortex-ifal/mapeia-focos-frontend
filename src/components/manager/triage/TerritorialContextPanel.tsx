import { TriageMap } from "@/components/manager/triage/TriageMap";
import type {
  TerritorialContextResponse,
  TriageOccurrence,
} from "@/types/triage";

type TerritorialContextPanelProps = {
  occurrence: TriageOccurrence;
  context: TerritorialContextResponse | null;
  loading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
};

export function TerritorialContextPanel({
  occurrence,
  context,
  loading,
  errorMessage,
  onRetry,
}: TerritorialContextPanelProps) {
  return (
    <section
      aria-labelledby="territorial-context-title"
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
        id="territorial-context-title"
        className="
          text-[18px]
          font-bold
          leading-[23px]
          text-[#171717]
        "
      >
        Contexto territorial
      </h2>

      <div className="mt-[10px]">
        <TriageMap
          occurrence={occurrence}
          context={context}
          variant="territorial"
          loading={loading}
          errorMessage={errorMessage}
        />
      </div>

      <div
        className="
          mt-[10px]
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-[12px]
            leading-[17px]
            text-[#716B67]
          "
        >
          Registros próximos ajudam na comparação sem expor dados pessoais.
        </p>

        {errorMessage ? (
          <button
            type="button"
            onClick={onRetry}
            className="
              shrink-0
              text-[12px]
              font-bold
              text-[#9D352D]
              underline
              underline-offset-2
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
            "
          >
            Tentar novamente
          </button>
        ) : null}
      </div>
    </section>
  );
}