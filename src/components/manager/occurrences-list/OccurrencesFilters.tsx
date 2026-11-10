"use client";

import { Search } from "lucide-react";

import type { OperationalPriority } from "@/types/operations";

type OccurrencesFiltersProps = {
  query: string;
  statusKey: string | null;
  region: string | null;
  priority: OperationalPriority | null;
  regions: string[];
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  onRegionChange: (value: string | null) => void;
  onPriorityChange: (value: OperationalPriority | null) => void;
};

const selectClasses = `
  h-[50px]
  shrink-0
  appearance-none
  cursor-pointer
  rounded-[12px]
  border
  border-[#E9E0D4]
  bg-white
  px-4
  pr-10
  text-[12px]
  font-semibold
  text-[#171717]
  outline-none
  transition-colors
  hover:bg-[#FBF8F2]
  focus:ring-2
  focus:ring-[#C94F32]
  focus:ring-offset-1
`;

export function OccurrencesFilters({
  query,
  statusKey,
  region,
  priority,
  regions,
  onQueryChange,
  onStatusChange,
  onRegionChange,
  onPriorityChange,
}: OccurrencesFiltersProps) {
  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-2
        sm:flex-row
        sm:flex-wrap
        sm:items-center
      "
    >
      <label
        className="
          flex
          h-[50px]
          w-full
          items-center
          gap-3
          rounded-[12px]
          border
          border-[#E9E0D4]
          bg-white
          px-3
          sm:w-[420px]
          sm:shrink-0
        "
      >
        <Search
          size={20}
          strokeWidth={1.8}
          className="
            shrink-0
            text-[#171717]
          "
          aria-hidden="true"
        />

        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Código, bairro ou referência"
          aria-label="Buscar ocorrência"
          className="
            min-w-0
            flex-1
            bg-transparent
            text-[12px]
            text-[#171717]
            outline-none
            placeholder:text-[#716B67]
          "
        />
      </label>

      <select
        aria-label="Filtrar por status"
        value={statusKey ?? ""}
        onChange={(event) => onStatusChange(event.target.value || null)}
        className={`
          ${selectClasses}
          w-full
          sm:min-w-[96px]
          sm:w-auto
        `}
      >
        <option value="">Status</option>

        <option value="registered">Nova</option>

        <option value="under_review">Em análise</option>

        <option value="rejected">Reprovada</option>

        <option value="accepted">Validada</option>

        <option value="forwarded_for_inspection">
          Encaminhada para vistoria
        </option>

        <option value="resolved">Resolvida</option>
      </select>

      <select
        aria-label="Filtrar por região"
        value={region ?? ""}
        onChange={(event) => onRegionChange(event.target.value || null)}
        className={`
          ${selectClasses}
          w-full
          sm:min-w-[96px]
          sm:w-auto
        `}
      >
        <option value="">Região</option>

        {regions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por prioridade"
        value={priority ?? ""}
        onChange={(event) => {
          const value = event.target.value;

          onPriorityChange(value ? (value as OperationalPriority) : null);
        }}
        className={`
          ${selectClasses}
          w-full
          sm:min-w-[124px]
          sm:w-auto
        `}
      >
        <option value="">Prioridade</option>

        <option value="low">Baixa</option>

        <option value="medium">Média</option>

        <option value="high">Alta</option>
      </select>
    </div>
  );
}