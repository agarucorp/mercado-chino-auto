import { cn } from "@/lib/utils";
import { useState } from "react";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex] ?? images[0];
  const extraCount = Math.max(0, images.length - 4);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted border border-border">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
                activeIndex === i
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40",
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {i === 3 && extraCount > 0 && (
                <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                  +{extraCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
