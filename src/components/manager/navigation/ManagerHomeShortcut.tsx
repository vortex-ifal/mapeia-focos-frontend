import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type ManagerHomeShortcutProps = {
  className?: string;
};

export function ManagerHomeShortcut({ className }: ManagerHomeShortcutProps) {
  return (
    <Link
      href="/central-operacional"
      aria-label="Ir para a Central Operacional"
      className={clsx(
        `
          flex
          h-14
          w-14
          shrink-0
          items-center
          justify-center
          rounded-[14px]
          border
          border-[#E9E0D4]
          bg-white
          p-2
          transition-colors
          hover:bg-[#FBF8F2]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#C94F32]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[#FBF8F2]
        `,
        className,
      )}
    >
      <Image
        src="/brand/symbol.png"
        alt=""
        width={40}
        height={32}
        priority
        className="h-8 w-10 object-contain"
      />
    </Link>
  );
}