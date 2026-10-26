import clsx from "clsx";

type MapMarkerProps = {
  selected?: boolean;
  size?: "map" | "legend";
};

export function MapMarker({ selected = false, size = "map" }: MapMarkerProps) {
  const isLegend = size === "legend";

  if (selected) {
    return (
      <span
        aria-hidden="true"
        className={clsx(
          `
            relative
            flex
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#C94F32]
          `,
          isLegend ? "h-6 w-6" : "h-[52px] w-[52px] border-2",
        )}
      >
        <span
          className={clsx(
            `
              rounded-full
              border-white
              bg-[#C94F32]
            `,
            isLegend ? "h-2 w-2 border-2" : "h-[18px] w-[18px] border-4",
          )}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(
        `
          block
          shrink-0
          rounded-full
          border-white
          bg-[#584A57]
        `,
        isLegend ? "h-[10px] w-[10px] border-2" : "h-[18px] w-[18px] border-4",
      )}
    />
  );
}