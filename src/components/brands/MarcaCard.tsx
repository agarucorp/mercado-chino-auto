import { MarcaLogo } from "@/components/brands/MarcaLogo";
import type { Marca } from "@/types/marcas";
import { Link } from "react-router-dom";

interface MarcaCardProps {
  marca: Marca;
}

export function MarcaCard({ marca }: MarcaCardProps) {
  const total = marca.modelos.length;

  return (    <Link
      to={`/marcas/${marca.slug}`}
      className="group flex flex-col items-center gap-3 p-2 h-full transition-colors"
    >
      <div className="w-full aspect-square rounded-lg bg-muted/30 flex items-center justify-center p-4 transition-colors">
        <MarcaLogo
          marcaId={marca.id}
          nombre={marca.nombre}
          className="w-full h-full"
          imageClassName="h-12 sm:h-14 md:h-16"
        />
      </div>
      <div className="text-center w-full">
        <h3 className="type-h3 text-sm text-foreground group-hover:text-primary transition-colors">
          {marca.nombre}
        </h3>
        <p className="type-meta text-muted-foreground mt-1 line-clamp-1">{marca.representante}</p>
        <p className="type-meta text-muted-foreground mt-0.5 tabular-nums">
          {total} modelo{total !== 1 ? "s" : ""}
        </p>      </div>
    </Link>
  );
}
