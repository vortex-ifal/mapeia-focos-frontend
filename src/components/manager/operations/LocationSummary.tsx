import clsx from "clsx";

type LocationSummaryProps = {
  address: string;
  context: string;
  className?: string;
};

export function LocationSummary({
  address,
  context,
  className,
}: LocationSummaryProps) {
  return (
    <div
      className={clsx(
        `
          min-h-[61px]
          w-full
          rounded-[12px]
          border
          border-[#E9E0D4]
          bg-white
          px-3
          py-[10px]
        `,
        className,
      )}
    >
      <p
        className="
          text-[15px]
          font-bold
          leading-[20px]
          text-[#171717]
        "
      >
        {address}
      </p>

      <p
        className="
          mt-[3px]
          text-[12px]
          leading-4
          text-[#716B67]
        "
      >
        {context}
      </p>
    </div>
  );
}