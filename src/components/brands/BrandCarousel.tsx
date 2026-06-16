import { MarcaLogo } from "@/components/brands/MarcaLogo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { MARCAS } from "@/data/marcas";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MARCAS_CARRUSEL = [...MARCAS].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es"),
);

export function BrandCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="py-8 md:py-10 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="type-h2 text-foreground">Todas las marcas</h2>
          <Link
            to="/marcas"
            className="type-meta text-foreground underline underline-offset-4 hover:text-primary transition-colors shrink-0"
          >
            Ver todas
          </Link>
        </div>

        <div className="relative px-10 sm:px-12">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              dragFree: true,
              containScroll: "trimSnaps",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {MARCAS_CARRUSEL.map((marca) => (
                <CarouselItem
                  key={marca.id}
                  className="pl-3 md:pl-4 basis-[5.75rem] sm:basis-28 md:basis-32"
                >
                  <Link
                    to={`/marcas/${marca.slug}`}
                    className="flex flex-col items-center gap-2.5 group/card"
                    title={marca.nombre}
                  >
                    <div className="w-full aspect-square rounded-xl border border-border bg-card flex items-center justify-center p-3 sm:p-4 transition-all group-hover/card:border-primary/30 group-hover/card:shadow-sm">
                      <MarcaLogo
                        marcaId={marca.id}
                        nombre={marca.nombre}
                        className="w-full h-full"
                        imageClassName="h-10 sm:h-12 md:h-14"
                      />
                    </div>
                    <span className="type-meta text-center text-foreground/80 line-clamp-2 w-full leading-tight group-hover/card:text-primary transition-colors">
                      {marca.nombre}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Marcas anteriores"
            className={cn(
              "absolute left-1 sm:left-2 top-[38%] -translate-y-1/2 z-10",
              "h-9 w-9 rounded-full bg-card border border-border shadow-md",
              "flex items-center justify-center text-foreground/70",
              "hover:bg-background hover:text-foreground transition-all",
              "disabled:opacity-0 disabled:pointer-events-none",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Marcas siguientes"
            className={cn(
              "absolute right-1 sm:right-2 top-[38%] -translate-y-1/2 z-10",
              "h-9 w-9 rounded-full bg-card border border-border shadow-md",
              "flex items-center justify-center text-foreground/70",
              "hover:bg-background hover:text-foreground transition-all",
              "disabled:opacity-0 disabled:pointer-events-none",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
