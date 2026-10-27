import { ImageIcon } from "lucide-react";

import { LocationSummary } from "@/components/manager/operations/LocationSummary";
import { MediaThumbnail } from "@/components/manager/operations/MediaThumbnail";
import { TriageMap } from "@/components/manager/triage/TriageMap";
import {
  getLocationContext,
  getOccurrenceDescription,
} from "@/controllers/manager/triage.controller";
import type {
  TerritorialContextResponse,
  TriageOccurrence,
} from "@/types/triage";

type OccurrenceDetailsPanelProps = {
  occurrence: TriageOccurrence;
  territorialContext: TerritorialContextResponse | null;
  territorialLoading: boolean;
  territorialErrorMessage: string | null;
};

export function OccurrenceDetailsPanel({
  occurrence,
  territorialContext,
  territorialLoading,
  territorialErrorMessage,
}: OccurrenceDetailsPanelProps) {
  return (
    <section
      aria-labelledby="triage-occurrence-title"
      className="
        h-full
        min-h-[620px]
        w-full
        min-w-0
        overflow-y-auto
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[17px]
      "
    >
      <h2
        id="triage-occurrence-title"
        className="
          text-[25px]
          font-extrabold
          leading-[31px]
          tracking-[-0.4px]
          text-[#171717]
        "
      >
        {occurrence.displayCode}
      </h2>

      <LocationSummary
        address={occurrence.address}
        context={getLocationContext(occurrence)}
        className="
          mt-[10px]
          min-h-[88px]
        "
      />

      <div className="mt-[10px]">
        <TriageMap
          occurrence={occurrence}
          context={territorialContext}
          variant="detail"
          loading={territorialLoading}
          errorMessage={territorialErrorMessage}
        />
      </div>

      <div
        aria-label="Evidências da ocorrência"
        className="
          mt-[10px]
          flex
          min-h-[72px]
          gap-2
        "
      >
        {occurrence.evidence.length > 0 ? (
          occurrence.evidence.slice(0, 2).map((evidence) => (
            <a
              key={evidence.id}
              href={evidence.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir ${evidence.alt}`}
              className="
                  rounded-[10px]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#C94F32]
                  focus-visible:ring-offset-2
                "
            >
              <MediaThumbnail alt={evidence.alt} />
            </a>
          ))
        ) : (
          <div
            className="
              flex
              h-[72px]
              w-[192px]
              items-center
              gap-2
              rounded-[10px]
              border
              border-dashed
              border-[#E9E0D4]
              bg-[#FBF8F2]
              px-3
              text-[#716B67]
            "
          >
            <ImageIcon size={20} strokeWidth={1.6} aria-hidden="true" />

            <span
              className="
                text-[11px]
                leading-[1.35]
              "
            >
              Mídias não disponíveis nesta listagem.
            </span>
          </div>
        )}
      </div>

      <p
        className="
          mt-[10px]
          text-[12px]
          leading-[17px]
          text-[#716B67]
        "
      >
        {getOccurrenceDescription(occurrence)}
      </p>
    </section>
  );
}