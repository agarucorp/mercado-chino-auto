import { NewsCard } from "@/components/news/NewsCard";
import { NEWS_DATA } from "@/data/news";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PREVIEW_NEWS = NEWS_DATA.filter((n) => !n.featured).slice(0, 3);

export function NewsPreview() {
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
    return () => api.off("select", onSelect);
  }, [api, onSelect]);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="type-h2 text-foreground">Últimas noticias</h2>
            <p className="type-body text-muted-foreground mt-1">
              Las novedades más recientes del mercado automotriz chino en Argentina
            </p>
          </div>
          <Link
            to="/noticias"
            className="type-meta text-foreground underline underline-offset-4 hover:text-primary transition-colors shrink-0"
          >
            Ver todas
          </Link>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {PREVIEW_NEWS.map((article) => (
            <NewsCard key={article.id} {...article} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden relative px-10">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", dragFree: true }}
            className="w-full"
          >
            <CarouselContent>
              {PREVIEW_NEWS.map((article) => (
                <CarouselItem key={article.id} className="basis-full">
                  <NewsCard {...article} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Noticia anterior"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center disabled:opacity-0",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Noticia siguiente"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center disabled:opacity-0",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
