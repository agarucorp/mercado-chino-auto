import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { formatKm, formatListingPrice } from "@/data/listings";
import { useApprovedListings } from "@/hooks/useListings";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function LatestListingsPreview() {
  const { data: listings = [] } = useApprovedListings();
  const preview = listings.filter((listing) => !listing.sold).slice(0, 12);
  const [api, setApi] = useState<CarouselApi>();

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api || preview.length < 2) return;
    const timer = window.setInterval(() => api.scrollNext(), 4500);
    return () => window.clearInterval(timer);
  }, [api, preview.length]);

  if (preview.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="type-h2 text-foreground">Últimos publicados</h2>
          <div className="flex items-center gap-3">
            <Link
              to="/clasificados"
              className="type-meta text-foreground underline underline-offset-4 hover:text-primary transition-colors shrink-0"
            >
              Ver clasificados
            </Link>
            {preview.length > 1 && (
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Anterior"
                  onClick={scrollPrev}
                  className="rounded-full border border-border p-1.5 hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Siguiente"
                  onClick={scrollNext}
                  className="rounded-full border border-border p-1.5 hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <Carousel setApi={setApi} opts={{ align: "start", loop: preview.length > 1 }} className="w-full">
          <CarouselContent className="-ml-4">
            {preview.map((listing) => (
              <CarouselItem key={listing.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Link to={`/clasificados/${listing.id}`} className="group flex gap-4 p-1 transition-colors">
                  <div className="w-28 sm:w-32 shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center py-1">
                    <h3 className="type-h3 text-sm group-hover:text-primary transition-colors line-clamp-2">
                      {listing.year} {listing.title}
                    </h3>
                    <p className="type-numeric font-semibold text-primary mt-1">
                      {formatListingPrice(listing)}
                    </p>
                    <p className="type-meta text-muted-foreground mt-1">{formatKm(listing.km)}</p>
                    <p className="type-meta text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {listing.location}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
