import { EstadoModeloBadge } from "@/components/brands/EstadoModeloBadge";
import { getModeloImage } from "@/data/modelo-media";
import { getModeloPath } from "@/lib/marcas";
import type { Marca, Modelo } from "@/types/marcas";
import { Link } from "react-router-dom";

interface ModeloCardProps {
  marca: Marca;
  modelo: Modelo;
}

export function ModeloCard({ marca, modelo }: ModeloCardProps) {
  const discontinuado = modelo.estado === "Discontinuado";

  return (
    <Link
      to={getModeloPath(marca, modelo)}
      className={`group block overflow-hidden ${discontinuado ? "opacity-80" : ""}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
        <img
          src={getModeloImage(modelo.id)}
          alt={modelo.nombre}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            discontinuado ? "grayscale-[30%]" : ""
          }`}
        />
        <div className="absolute top-3 right-3">
          <EstadoModeloBadge estado={modelo.estado} />
        </div>
      </div>
      <div className="pt-3">
        <h3
          className={`type-h3 text-base text-foreground group-hover:text-primary transition-colors ${
            discontinuado ? "line-through decoration-muted-foreground/50" : ""
          }`}
        >
          {modelo.nombre}
        </h3>
        <p className="type-meta text-muted-foreground mt-1">{marca.nombre}</p>
      </div>
    </Link>
  );
}
