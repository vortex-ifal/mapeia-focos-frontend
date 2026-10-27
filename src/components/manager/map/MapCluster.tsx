type MapClusterProps = {
  count: number;
};

export function MapCluster({ count }: MapClusterProps) {
  return (
    <div
      aria-label={`${count} ocorrências agrupadas`}
      className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        border-4
        border-white
        bg-[#C94F32]
        text-[13px]
        font-bold
        text-white
        shadow-sm
      "
    >
      {count}
    </div>
  );
}