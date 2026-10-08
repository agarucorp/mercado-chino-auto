import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useNews } from "@/hooks/useNews";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/** Lanzamientos cargados a mano desde Noticias, categoría Lanzamiento. */
export function LaunchCarousel() {
  const { data: news = [] } = useNews();
  const items = news.filter((article) => article.published !== false && article.category === "Lanzamiento");
  const [api, setApi] = useState<CarouselApi>();
  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api || items.length < 2) return;
    const timer = window.setInterval(() => api.scrollNext(), 5000);
    return () => window.clearInterval(timer);
  }, [api, items.length]);

  if (items.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="type-h2 text-foreground">Últimos presentados</h2>
            <p className="type-body-sm text-muted-foreground mt-1">
              Novedades de lanzamiento en el mercado.
            </p>
          </div>
          {items.length > 1 && (
            <div className="flex gap-1">
              <button type="button" aria-label="Anterior" onClick={scrollPrev} className="rounded-full border border-border p-1.5 hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Siguiente" onClick={scrollNext} className="rounded-full border border-border p-1.5 hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <Carousel setApi={setApi} opts={{ align: "start", loop: items.length > 1 }} className="w-full">
          <CarouselContent className="-ml-4">
            {items.map((article) => (
              <CarouselItem key={article.id} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <Link to={`/noticias/${article.id}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                    <img src={article.image} alt={article.imageAlt || article.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="type-meta text-primary mt-3">{article.category}</p>
                  <h3 className="type-h3 text-base mt-1 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="type-body-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
