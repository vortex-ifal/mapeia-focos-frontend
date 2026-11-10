type OccurrencesEmptyStateProps = {
  filtered?: boolean;
};

export function OccurrencesEmptyState({
  filtered = false,
}: OccurrencesEmptyStateProps) {
  return (
    <div
      className="
        rounded-[12px]
        border
        border-dashed
        border-[#E9E0D4]
        bg-[#FBF8F2]
        px-6
        py-12
        text-center
      "
    >
      <p
        className="
          text-[13px]
          font-semibold
          text-[#171717]
        "
      >
        {filtered
          ? "Nenhuma ocorrência encontrada."
          : "Nenhuma ocorrência cadastrada."}
      </p>

      {filtered ? (
        <p
          className="
            mt-2
            text-[12px]
            text-[#716B67]
          "
        >
          Tente alterar os termos da busca ou os filtros selecionados.
        </p>
      ) : null}
    </div>
  );
}