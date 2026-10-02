import { MarcaLogo } from "@/components/brands/MarcaLogo";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/data/listings";
import { getModeloImage } from "@/data/modelo-media";
import { useReviews } from "@/hooks/useReviews";
import { MARCAS } from "@/data/marcas";
import { getModeloPath } from "@/lib/marcas";
import type { Marca, Modelo } from "@/types/marcas";
import { ArrowRight, MessageSquare, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ModeloCatalogTeaserProps {
  listing: Listing;
}

function findMarcaModelo(
  listing: Listing,
): { marca: Marca; modelo: Modelo } | null {
  if (!listing.modeloId) return null;
  const marca = MARCAS.find((m) => m.id === listing.marcaId);
  if (!marca) return null;
  const modelo = marca.modelos.find((m) => m.id === listing.modeloId);
  if (!modelo) return null;
  return { marca, modelo };
}

export function ModeloCatalogTeaser({ listing }: ModeloCatalogTeaserProps) {
  const match = findMarcaModelo(listing);
  const { reviews: resenas } = useReviews(match?.marca.id ?? "", match?.modelo.id ?? "");
  if (!match) return null;

  const { marca, modelo } = match;
  const modeloPath = getModeloPath(marca, modelo);
  const avgRating =
    resenas.length > 0
      ? (resenas.reduce((s, r) => s + r.rating, 0) / resenas.length).toFixed(1)
      : null;

  return (
    <section className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <h2 className="type-h3 text-foreground">Sobre este modelo</h2>
        <p className="type-meta text-muted-foreground mt-0.5">
          Ficha técnica, marca y reseñas de propietarios
        </p>
      </div>

      <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-5">
        <div className="relative w-full sm:w-44 shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          <img
            src={getModeloImage(modelo.id)}
            alt={modelo.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-border bg-background p-1 shrink-0">
              <MarcaLogo marcaId={marca.id} nombre={marca.nombre} className="w-full h-full" />
            </div>
            <div>
              <p className="type-meta text-muted-foreground">{marca.nombre}</p>
              <p className="type-h3 text-base">{modelo.nombre}</p>
            </div>
          </div>

          <p className="type-body-sm text-muted-foreground">
            Conocé de qué se trata este vehículo, quién lo representa en Argentina, su ficha
            técnica completa y el historial de opiniones de otros usuarios.
          </p>

          <div className="flex flex-wrap items-center gap-4 type-meta text-muted-foreground">
            <span>Representante: {marca.representante}</span>
            {resenas.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {resenas.length} reseña{resenas.length !== 1 ? "s" : ""}
                {avgRating && (
                  <>
                    {" "}
                    · <Star className="w-3.5 h-3.5 fill-accent text-accent inline" /> {avgRating}
                  </>
                )}
              </span>
            )}
          </div>

          <Button asChild className="gap-2">
            <Link to={modeloPath}>
              Ver ficha del modelo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
