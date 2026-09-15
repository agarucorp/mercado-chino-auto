import { formatKm, formatPrice } from "@/data/listings";
import { useApprovedListings } from "@/hooks/useListings";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export function LatestListingsPreview() {
  const { data: listings = [] } = useApprovedListings();
  const preview = listings.slice(0, 3);

  if (preview.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="type-h2 text-foreground">Últimos publicados</h2>
          <Link
            to="/clasificados"
            className="type-meta text-foreground underline underline-offset-4 hover:text-primary transition-colors shrink-0"
          >
            Ver clasificados
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {preview.map((listing) => (
            <Link
              key={listing.id}
              to={`/clasificados/${listing.id}`}
              className="group flex gap-4 p-1 transition-colors"
            >
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
                  {formatPrice(listing.price, listing.currency ?? "ARS")}
                </p>
                <p className="type-meta text-muted-foreground mt-1">{formatKm(listing.km)}</p>
                <p className="type-meta text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {listing.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
