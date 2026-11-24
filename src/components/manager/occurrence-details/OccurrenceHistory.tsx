import type { OccurrenceHistoryItem } from "@/types/occurrence-details";

type OccurrenceHistoryProps = {
  history: OccurrenceHistoryItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function OccurrenceHistory({
  history,
  isLoading = false,
  error = null,
  onRetry,
}: OccurrenceHistoryProps) {
  if (isLoading) {
    return (
      <HistoryContainer>
        <div
          className="
            mt-3
            rounded-[10px]
            bg-[#F4EFE6]
            px-3
            py-4
          "
        >
          <p
            className="
              text-[13px]
              text-[#716B67]
            "
          >
            Carregando histórico...
          </p>
        </div>
      </HistoryContainer>
    );
  }

  if (error) {
    return (
      <HistoryContainer>
        <div
          role="alert"
          className="
            mt-3
            rounded-[10px]
            border
            border-[#F8E3E0]
            bg-[#F8E3E0]
            px-3
            py-4
          "
        >
          <p
            className="
              text-[13px]
              leading-[1.45]
              text-[#9D352D]
            "
          >
            {error}
          </p>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="
                mt-2
                text-[12px]
                font-bold
                text-[#9D352D]
                underline
                underline-offset-2
              "
            >
              Tentar novamente
            </button>
          ) : null}
        </div>
      </HistoryContainer>
    );
  }

  if (history.length === 0) {
    return (
      <HistoryContainer>
        <div
          className="
            mt-3
            rounded-[10px]
            bg-[#F4EFE6]
            px-3
            py-4
          "
        >
          <p
            className="
              text-[13px]
              text-[#716B67]
            "
          >
            Nenhum evento foi registrado para esta ocorrência.
          </p>
        </div>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <ol
        className="
          mt-4
          flex
          flex-col
        "
      >
        {history.map((event, index) => {
          const isLast = index === history.length - 1;

          return (
            <li
              key={event.id}
              className="
                relative
                grid
                grid-cols-[22px_minmax(0,1fr)]
                gap-3
              "
            >
              <div
                className="
                  relative
                  flex
                  justify-center
                "
              >
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-0
                      top-[17px]
                      w-px
                      bg-[#E9E0D4]
                    "
                  />
                ) : null}

                <span
                  aria-hidden="true"
                  className="
                    relative
                    z-10
                    mt-[3px]
                    h-[13px]
                    w-[13px]
                    shrink-0
                    rounded-full
                    border-[3px]
                    border-white
                    bg-[#C94F32]
                    ring-1
                    ring-[#C94F32]
                  "
                />
              </div>

              <div className={isLast ? "pb-1" : "pb-5"}>
                <p
                  className="
                    text-[13px]
                    font-bold
                    leading-[1.4]
                    text-[#171717]
                  "
                >
                  {event.eventDescription}
                </p>

                <time
                  dateTime={event.createdAt}
                  className="
                    mt-1
                    block
                    text-[12px]
                    leading-[1.4]
                    text-[#716B67]
                  "
                >
                  {formatHistoryDate(event.createdAt)}
                </time>

                <p
                  className="
                    mt-[2px]
                    text-[12px]
                    leading-[1.4]
                    text-[#584A57]
                  "
                >
                  Por{" "}
                  <span className="font-semibold">
                    {event.author?.name ?? "Sistema"}
                  </span>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </HistoryContainer>
  );
}

type HistoryContainerProps = {
  children: React.ReactNode;
};

function HistoryContainer({ children }: HistoryContainerProps) {
  return (
    <section
      aria-labelledby="occurrence-history-title"
      className="
        mt-[10px]
        rounded-[12px]
        border
        border-[#E9E0D4]
        px-[14px]
        py-[14px]
      "
    >
      <div>
        <h3
          id="occurrence-history-title"
          className="
            text-[14px]
            font-bold
            text-[#171717]
          "
        >
          Linha do tempo
        </h3>

        <p
          className="
            mt-1
            text-[12px]
            leading-[1.4]
            text-[#716B67]
          "
        >
          Histórico completo das ações realizadas nesta ocorrência.
        </p>
      </div>

      {children}
    </section>
  );
}

function formatHistoryDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}