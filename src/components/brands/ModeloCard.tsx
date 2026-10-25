import { resolveImages } from "@/lib/model-catalog";
import { getModeloPath } from "@/lib/marcas";
import type { Marca, Modelo } from "@/types/marcas";
import { Link } from "react-router-dom";

interface ModeloCardProps {
  marca: Marca;
  modelo: Modelo;
}

export function ModeloCard({ marca, modelo }: ModeloCardProps) {
  return (
    <Link to={getModeloPath(marca, modelo)} className="group block overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
        <img
          src={resolveImages(modelo.id)[0]}
          alt={modelo.nombre}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="pt-3">
        <h3 className="type-h3 text-base text-foreground group-hover:text-primary transition-colors">
          {modelo.nombre}
        </h3>
        <p className="type-meta text-muted-foreground mt-1">{marca.nombre}</p>
        {modelo.estado === "Discontinuado" && (
          <p className="type-meta text-muted-foreground mt-1">Discontinuado</p>
        )}
      </div>
    </Link>
  );
}
