import type { Listing, ListingSpec } from "@/data/listings";
import type { LucideIcon } from "lucide-react";
import {
  Bluetooth,
  Camera,
  Car,
  Check,
  Flame,
  Gauge,
  Plug,
  Radio,
  Shield,
  Sun,
  Wind,
} from "lucide-react";

interface ListingSpecTableProps {
  title: string;
  rows: ListingSpec[];
}

export function ListingSpecTable({ title, rows }: ListingSpecTableProps) {
  return (
    <section>
      <h2 className="type-h3 text-foreground mb-4 pb-2 border-b border-border">{title}</h2>
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 py-3 type-body-sm"
          >
            <dt className="type-meta text-muted-foreground shrink-0 w-28 sm:w-36">{row.label}</dt>
            <dd
              className={
                row.highlight
                  ? "font-medium text-emerald-600 dark:text-emerald-400 text-right min-w-0"
                  : "text-foreground text-right min-w-0"
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

interface ListingDescriptionProps {
  description: string;
}

export function ListingDescription({ description }: ListingDescriptionProps) {
  return (
    <section>
      <h2 className="type-h3 text-foreground mb-4 pb-2 border-b border-border">
        Descripción detallada
      </h2>
      <p className="type-body text-muted-foreground">{description}</p>
    </section>
  );
}

interface ListingEquipmentProps {
  items: string[];
}

function getEquipmentIcon(label: string): LucideIcon {
  const n = label.toLowerCase();
  if (n.includes("aire")) return Wind;
  if (n.includes("bluetooth") || n.includes("carplay") || n.includes("android")) return Bluetooth;
  if (n.includes("pantalla") || n.includes("radio")) return Radio;
  if (n.includes("crucero") || n.includes("cruise")) return Gauge;
  if (n.includes("llanta")) return Car;
  if (n.includes("techo")) return Sun;
  if (n.includes("asiento") && n.includes("calef")) return Flame;
  if (n.includes("asiento") || n.includes("cuero")) return Car;
  if (n.includes("cargador") || n.includes("carga")) return Plug;
  if (n.includes("cámara") || n.includes("camara")) return Camera;
  if (n.includes("sensor") || n.includes("barra")) return Shield;
  return Check;
}

export function ListingEquipment({ items }: ListingEquipmentProps) {
  return (
    <section>
      <h2 className="type-h3 text-foreground mb-4 pb-2 border-b border-border">
        Equipamiento destacado
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = getEquipmentIcon(item);
          return (
            <li
              key={item}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/20 p-3 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="type-meta text-foreground text-xs leading-tight">{item}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface ListingSellerCardProps {
  seller: Listing["seller"];
}

export function ListingSellerCard({ seller }: ListingSellerCardProps) {
  return (
    <section className="py-2">
      <h2 className="type-h3 text-foreground mb-4">Vendedor</h2>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">{seller.name.charAt(0)}</span>
        </div>
        <div className="min-w-0">
          <p className="type-h3 text-base">{seller.name}</p>
          <p className="type-meta text-muted-foreground capitalize mt-0.5">{seller.type}</p>
          <p className="type-body-sm text-muted-foreground mt-2">
            {seller.address}, {seller.city}
          </p>
          <p className="type-meta text-muted-foreground">{seller.province}</p>
          {seller.listingsCount > 1 && (
            <p className="type-meta text-primary mt-2">
              {seller.listingsCount} publicaciones activas
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
