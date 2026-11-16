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
  TriageEvidence,
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

      <EvidenceSection evidence={occurrence.evidence} />

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

type EvidenceSectionProps = {
  evidence: TriageEvidence[];
};

function EvidenceSection({ evidence }: EvidenceSectionProps) {
  if (evidence.length === 0) {
    return (
      <div
        aria-label="Evidências da ocorrência"
        className="
          mt-[10px]
          flex
          min-h-[72px]
          gap-2
        "
      >
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
            Nenhuma mídia anexada a esta ocorrência.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Evidências da ocorrência"
      className="
        mt-[10px]
        flex
        min-h-[72px]
        flex-wrap
        gap-2
      "
    >
      {evidence.slice(0, 3).map((item) => {
        if (!item.url) {
          return (
            <div key={item.id} title="Não foi possível carregar esta mídia.">
              <MediaThumbnail alt={item.alt} mimeType={item.mimeType} />
            </div>
          );
        }

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir ${item.alt}`}
            title="Abrir evidência"
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
            <MediaThumbnail
              alt={item.alt}
              src={item.url}
              mimeType={item.mimeType}
            />
          </a>
        );
      })}
    </div>
  );
}