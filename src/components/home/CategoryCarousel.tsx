import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getCategoriasConConteo } from "@/lib/categorias";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function CategoryCarousel() {
  const categorias = getCategoriasConConteo();
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

  if (categorias.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-b border-border bg-background">
      <div className="container mx-auto">
        <div className="mb-6">
          <h2 className="type-h2 text-foreground">Explorá por categoría</h2>
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
              {categorias.map((cat) => {
                const Icon = cat.icon;
                return (
                  <CarouselItem
                    key={cat.slug}
                    className="pl-3 md:pl-4 basis-[9.5rem] sm:basis-44 md:basis-48"
                  >
                    <Link
                      to={`/categorias/${cat.slug}`}
                      className="group/cat flex flex-col items-center gap-3 p-2 h-full transition-colors"
                    >
                      <div
                        className={cn(
                          "flex h-16 w-16 items-center justify-center rounded-2xl",
                          "bg-gradient-to-br from-primary/25 via-primary/10 to-primary/5",
                          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]",
                          "ring-1 ring-primary/10",
                          "transition-transform group-hover/cat:scale-105",
                        )}
                      >
                        <Icon
                          className="h-8 w-8 text-primary drop-shadow-sm"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="text-center w-full">
                        <span className="type-h3 text-sm text-foreground group-hover/cat:text-primary transition-colors block">
                          {cat.label}
                        </span>
                        <span className="type-meta text-muted-foreground mt-0.5 block tabular-nums">
                          {cat.count} modelo{cat.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Categorías anteriores"
            className={cn(
              "absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10",
              "h-9 w-9 rounded-full bg-muted",
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
            aria-label="Categorías siguientes"
            className={cn(
              "absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10",
              "h-9 w-9 rounded-full bg-muted",
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
