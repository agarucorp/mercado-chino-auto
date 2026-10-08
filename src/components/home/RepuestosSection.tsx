import { PROVIDER_CATEGORIES } from "@/lib/providers-api";
import { Link } from "react-router-dom";

export function RepuestosSection() {
  return (
    <section className="py-10 md:py-14 border-t border-border">
      <div className="container mx-auto">
        <h2 className="type-h2 text-foreground">Repuestos y talleres de autos chinos</h2>
        <p className="type-body-sm text-muted-foreground mt-1 mb-6">
          Elegí una categoría para ver los proveedores.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PROVIDER_CATEGORIES.map((item) => (
            <Link
              key={item.id}
              to={`/repuestos?categoria=${item.id}`}
              className="rounded-xl border border-border p-6 hover:border-primary transition-colors"
            >
              <h3 className="type-h3 text-foreground">{item.label}</h3>
              <p className="type-body-sm text-muted-foreground mt-2">Ver proveedores</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
