import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SpecHighlightGrid, SummaryCardShell } from "@/components/detail/SummaryCardShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Listing } from "@/data/listings";
import { formatKm, formatListingPrice } from "@/data/listings";
import { cn } from "@/lib/utils";
import { Fuel, Gauge, MapPin, MessageCircle, Settings2, TriangleAlert } from "lucide-react";

interface ListingSidebarProps {
  listing: Listing;
  className?: string;
}

function givenName(name: string) {
  return name.trim().split(/\s+/)[0] || "Vendedor";
}

type ContactStep = "closed" | "warning" | "details";

export function ListingSidebar({ listing, className }: ListingSidebarProps) {
  const [step, setStep] = useState<ContactStep>("closed");
  const headline = `${listing.year} ${listing.title} ${listing.version}`;
  const nombre = givenName(listing.seller.name);
  const telefono = listing.sellerPhone?.trim() ?? "";
  const esParticular = listing.seller.type === "particular";

  return (
    <SummaryCardShell title={headline} className={className}>
      <div>
        <p className="type-numeric text-2xl sm:text-3xl font-bold text-foreground">
          {formatListingPrice(listing)}
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
        <Button className="w-full" size="lg" type="button" onClick={() => setStep("warning")}>
          <MessageCircle className="w-4 h-4" />
          Contactar al vendedor
        </Button>
      </div>

      <Dialog open={step === "warning"} onOpenChange={(open) => { if (!open) setStep("closed"); }}>
        <DialogContent className="max-w-md gap-4 p-5 sm:p-6">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="flex items-start gap-2 pr-6 text-base normal-case tracking-normal">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>
                {esParticular
                  ? "¡Atención! Venta entre particulares en AUCHAR"
                  : "¡Atención! AUCHAR no intermedia esta venta"}
              </span>
            </DialogTitle>
            <DialogDescription className="space-y-3 text-left text-sm text-foreground">
              <span className="block">
                Esta transacción y el estado del vehículo son responsabilidad exclusiva de las
                partes. AUCHAR no participa ni garantiza la compraventa.
              </span>
              <span className="block">
                Hacé las verificaciones necesarias. Ante cualquier duda, estamos para asesorarte.
              </span>
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-lg bg-muted px-3 py-2.5 text-sm font-medium text-foreground">
            ¡Estás muy cerca de comprar tu auto chino!
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setStep("closed")}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="!border-primary !bg-primary !text-primary-foreground hover:!bg-primary/90"
              onClick={() => setStep("details")}
            >
              Entendido, contactar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={step === "details"} onOpenChange={(open) => { if (!open) setStep("closed"); }}>
        <DialogContent className="max-w-[18rem] gap-4 p-5">
          <DialogHeader>
            <DialogTitle className="text-base">Contacto</DialogTitle>
            <DialogDescription className="sr-only">
              Nombre y teléfono del vendedor
            </DialogDescription>
          </DialogHeader>
          <dl className="space-y-3">
            <div>
              <dt className="type-meta text-muted-foreground">Nombre</dt>
              <dd className="text-base font-medium text-foreground">{nombre}</dd>
            </div>
            <div>
              <dt className="type-meta text-muted-foreground">Teléfono</dt>
              <dd className="text-base font-medium text-foreground">
                {telefono ? (
                  <a href={`tel:${telefono.replace(/[^\d+]/g, "")}`} className="hover:underline">
                    {telefono}
                  </a>
                ) : (
                  "Sin teléfono cargado"
                )}
              </dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>
    </SummaryCardShell>
  );
}
