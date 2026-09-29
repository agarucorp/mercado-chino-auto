import { Button } from "@/components/ui/button";
import { SpecHighlightGrid, SummaryCardShell } from "@/components/detail/SummaryCardShell";
import type { Listing } from "@/data/listings";
import { formatKm, formatPrice } from "@/data/listings";
import { cn } from "@/lib/utils";
import { Fuel, Gauge, MapPin, MessageCircle } from "lucide-react";
import { Settings2 } from "lucide-react";

interface ListingSidebarProps {
  listing: Listing;
  className?: string;
}

export function ListingSidebar({ listing, className }: ListingSidebarProps) {
  const headline = `${listing.year} ${listing.title} ${listing.version}`;

  return (
    <SummaryCardShell title={headline} className={className}>
      <div>
        <p className="type-numeric text-2xl sm:text-3xl font-bold text-foreground">
          {formatPrice(listing.price, listing.currency ?? "ARS")}
        </p>
        <p className="type-meta text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {listing.location}, {listing.province}
        </p>
      </div>

      <SpecHighlightGrid
        items={[
          {
            icon: <Gauge className="w-5 h-5" />,
            label: "Kilometraje",
            value: formatKm(listing.km),
          },
          {
            icon: <Fuel className="w-5 h-5" />,
            label: "Combustible",
            value: listing.fuel,
          },
          {
            icon: <Settings2 className="w-5 h-5" />,
            label: "Caja",
            value: listing.transmission,
          },
        ]}
      />

      <div className={cn("space-y-3")}>
        <Button className="w-full" size="lg">
          <MessageCircle className="w-4 h-4" />
          Contactar al vendedor
        </Button>
      </div>
    </SummaryCardShell>
  );
}
