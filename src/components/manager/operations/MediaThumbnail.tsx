import { ImageIcon } from "lucide-react";
import clsx from "clsx";

type MediaThumbnailProps = {
  alt: string;
  className?: string;
};

export function MediaThumbnail({ alt, className }: MediaThumbnailProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={clsx(
        `
          flex
          h-[72px]
          w-[92px]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-[10px]
          border
          border-[#E9E0D4]
          bg-[#F4EFE6]
          text-[#584A57]
        `,
        className,
      )}
    >
      <ImageIcon size={20} strokeWidth={1.6} aria-hidden="true" />
    </div>
  );
}