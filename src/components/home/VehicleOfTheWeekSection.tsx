import { Button } from "@/components/ui/button";
import { formatKm, formatPrice } from "@/data/listings";
import { useApprovedListings } from "@/hooks/useListings";
import { Fuel, Gauge, MapPin, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

export function VehicleOfTheWeekSection() {
  const { data: listings = [] } = useApprovedListings();
  const listing = listings.find((l) => l.featured) ?? listings[0];
  if (!listing) return null;

  const headline = `${listing.year} ${listing.title} ${listing.version}`;

  const highlights = listing.general
    .filter((spec) => spec.highlight)
    .slice(0, 2);

  return (
    <section className="py-8 md:py-10 border-b border-border bg-background">
      <div className="container mx-auto">
        <h2 className="type-h2 text-foreground mb-6">Vehículo de la semana</h2>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-8 items-center">
          <div className="aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <img
              src={listing.image}
              alt={headline}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="type-h3 text-foreground">{headline}</h3>
              <p className="type-numeric text-xl font-semibold text-foreground mt-2">
                {formatPrice(listing.price, listing.currency ?? "ARS")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <p className="type-body-sm text-muted-foreground inline-flex items-center gap-2">
                <Gauge className="w-4 h-4 shrink-0 text-foreground" />
                {formatKm(listing.km)}
              </p>
              <p className="type-body-sm text-muted-foreground inline-flex items-center gap-2">
                <Fuel className="w-4 h-4 shrink-0 text-foreground" />
                {listing.fuel}
              </p>
              <p className="type-body-sm text-muted-foreground inline-flex items-center gap-2">
                <Settings2 className="w-4 h-4 shrink-0 text-foreground" />
                {listing.transmission}
              </p>
              <p className="type-body-sm text-muted-foreground inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-foreground" />
                {listing.location}
              </p>
            </div>

            {highlights.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {highlights.map((spec) => (
                  <li
                    key={spec.label}
                    className="type-meta text-foreground border border-border rounded-full px-3 py-1"
                  >
                    {spec.label}: {spec.value}
                  </li>
                ))}
              </ul>
            )}

            <p className="type-body text-muted-foreground line-clamp-2">{listing.description}</p>

            <div className="pt-1">
              <Button asChild>
                <Link to={`/clasificados/${listing.id}`}>Ver publicación</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
