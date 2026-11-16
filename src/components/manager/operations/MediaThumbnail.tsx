/* eslint-disable @next/next/no-img-element */

import { ImageIcon } from "lucide-react";
import clsx from "clsx";

type MediaThumbnailProps = {
  alt: string;
  src?: string | null;
  mimeType?: string | null;
  className?: string;
};

export function MediaThumbnail({
  alt,
  src = null,
  mimeType = null,
  className,
}: MediaThumbnailProps) {
  const isImage = Boolean(src) && Boolean(mimeType?.startsWith("image/"));

  return (
    <div
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
      {isImage && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="
            h-full
            w-full
            object-cover
          "
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
          "
        >
          <ImageIcon size={20} strokeWidth={1.6} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}