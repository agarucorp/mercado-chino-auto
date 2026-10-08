import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";

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

  // Flechas del teclado: la galería es el uso principal de esta pantalla
  // mientras el lightbox está abierto, así que no compite con otro atajo.
  useEffect(() => {
    if (!lightboxOpen || images.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => openLightbox(activeIndex)}
        className="group relative rounded-xl overflow-hidden bg-white border border-border block w-full"
      >
        <img
          key={mainImage}
          src={mainImage}
          alt={title}
          className="w-full max-h-[28rem] object-contain animate-in fade-in duration-300 mx-auto"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full bg-background/90 p-2.5 shadow-sm">
            <Maximize2 className="h-4 w-4 text-foreground" aria-hidden />
          </span>
        </div>
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 text-white type-meta px-2.5 py-1">
            {activeIndex + 1} / {images.length}
          </span>
        )}
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
                  "relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-200",
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
        <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 overflow-hidden bg-black border-none sm:rounded-xl [&>button]:z-20 [&>button]:text-white [&>button]:opacity-100 [&>button]:bg-white/20 [&>button]:hover:bg-white/35 [&>button]:rounded-full [&>button]:p-2 [&>button]:right-3 [&>button]:top-3 [&>button_svg]:h-6 [&>button_svg]:w-6">
          <DialogTitle className="sr-only">{title}</DialogTitle>

          <div
            className="relative flex items-center justify-center bg-black"
            style={{ height: "min(80vh, 720px)" }}
          >
            <img
              key={lightboxIndex}
              src={images[lightboxIndex]}
              alt={`${title} - foto ${lightboxIndex + 1} de ${images.length}`}
              className="max-w-full max-h-full w-auto h-auto object-contain animate-in fade-in duration-200"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white p-2.5 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Foto siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white p-2.5 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute top-3 left-3 rounded-full bg-black/60 text-white type-meta px-2.5 py-1">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3 bg-black">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={cn(
                    "shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all",
                    lightboxIndex === i
                      ? "border-white"
                      : "border-transparent opacity-50 hover:opacity-90",
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
