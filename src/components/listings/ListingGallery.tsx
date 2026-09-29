import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mainImage = images[activeIndex] ?? images[0];
  const extraCount = Math.max(0, images.length - 4);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const showPrev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setLightboxIndex((i) => (i + 1) % images.length);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => openLightbox(activeIndex)}
        className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted border border-border block w-full"
      >
        <img src={mainImage} alt={title} className="w-full h-full object-cover" />
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {images.slice(0, 4).map((img, i) => {
            const isLastWithExtra = i === 3 && extraCount > 0;
            return (
              <button
                key={img}
                type="button"
                onClick={() => (isLastWithExtra ? openLightbox(3) : setActiveIndex(i))}
                className={cn(
                  "relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
                  activeIndex === i
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40",
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {isLastWithExtra && (
                  <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                    +{extraCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 overflow-hidden bg-black border-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-black">
            <img
              src={images[lightboxIndex]}
              alt={`${title} - foto ${lightboxIndex + 1} de ${images.length}`}
              className="w-full h-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Foto siguiente"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 text-white text-xs px-2.5 py-1">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
