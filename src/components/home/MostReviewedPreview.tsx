import { ModeloCard } from "@/components/brands/ModeloCard";
import { MARCAS } from "@/data/marcas";
import { getModelosMasComentados } from "@/lib/review-store";
import { Star } from "lucide-react";

export function MostReviewedPreview() {
  const top = getModelosMasComentados(3);

  return (
    <section className="py-8 md:py-10 border-b border-border">
      <div className="container mx-auto">
        <div className="mb-6">
          <h2 className="type-h2 text-foreground">Los más comentados</h2>
          <p className="type-meta text-muted-foreground mt-1">
            Modelos con más reseñas de propietarios
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {top.map((item) => {
            const marca = MARCAS.find((m) => m.id === item.marcaId);
            const modelo = marca?.modelos.find((m) => m.id === item.modeloId);
            if (!marca || !modelo) return null;

            return (
              <div key={item.modeloId} className="relative">
                <ModeloCard marca={marca} modelo={modelo} showEstado={false} />
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 type-meta text-xs">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  {item.avgRating.toFixed(1)} · {item.count} reseña
                  {item.count !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>

        {top.length === 0 && (
          <p className="type-body text-muted-foreground text-center py-8">
            Todavía no hay reseñas publicadas.
          </p>
        )}
      </div>
    </section>
  );
}
