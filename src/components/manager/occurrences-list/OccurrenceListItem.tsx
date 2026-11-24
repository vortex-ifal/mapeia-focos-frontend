import Link from "next/link";

import { formatElapsedDuration } from "@/utils/occurrence.utils";
import {
  getOccurrenceDetailsPath,
} from "@/controllers/manager/occurrences-list.controller";
import type { OccurrenceListItem as OccurrenceListItemType } from "@/types/occurrences-list";

type OccurrenceListItemProps = {
  occurrence: OccurrenceListItemType;
};

export function OccurrenceListItem({ occurrence }: OccurrenceListItemProps) {
  return (
    <Link
      href={getOccurrenceDetailsPath(occurrence.id)}
      aria-label={`${occurrence.displayCode}${occurrence.isArchived ? ", arquivada" : ""}: abrir detalhes`}
      className="
        block
        h-auto
        min-h-[94px]
        shrink-0
        rounded-[12px]
        border
        border-[#E9E0D4]
        bg-white
        px-[15px]
        py-[13px]
        transition-colors
        hover:bg-[#FBF8F2]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#C94F32]
        focus-visible:ring-offset-2
      "
    >
      <p
        className="
          text-[13px]
          font-extrabold
          leading-[17px]
          text-[#171717]
        "
      >
        {occurrence.displayCode}
      </p>

      {occurrence.isArchived ? (
        <span className="mt-[7px] inline-flex items-center rounded-full border border-[#D2CBC5] bg-[#F4EFE6] px-3 py-1 text-[11px] font-bold text-[#584A57]">
          Arquivada
        </span>
      ) : null}

      <p
        className="
          mt-[5px]
          text-[12px]
          leading-4
          text-[#171717]
        "
      >
        {occurrence.statusLabel}
        {" · "}
        {occurrence.region}
      </p>

      <p
        className="
          mt-[5px]
          text-[11px]
          leading-[14px]
          text-[#716B67]
        "
      >
        {formatElapsedDuration(occurrence.elapsedMinutes)}
        {" · "}
        <span className="underline underline-offset-2">abrir detalhes</span>
      </p>
    </Link>
  );
}