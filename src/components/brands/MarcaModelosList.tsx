import { MarcaLogo } from "@/components/brands/MarcaLogo";
import { EstadoModeloBadge } from "@/components/brands/EstadoModeloBadge";
import { getModeloPath, tieneModelosVigentes } from "@/lib/marcas";
import type { Marca } from "@/types/marcas";
import { Link } from "react-router-dom";

interface MarcaModelosListProps {
  marca: Marca;
  linkToDetail?: boolean;
}

export function MarcaModelosList({ marca, linkToDetail = true }: MarcaModelosListProps) {
  const vigentes = marca.modelos.filter((m) => m.estado === "Vigente");
  const discontinuados = marca.modelos.filter((m) => m.estado === "Discontinuado");

  return (
    <div className="space-y-6">
      {!tieneModelosVigentes(marca) && (
        <p className="type-body text-sm text-amber-700 dark:text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">
          Esta marca ya no comercializa modelos vigentes en Argentina. Los modelos listados son
          históricos y pueden no estar disponibles en concesionarios.
        </p>
      )}

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {marca.modelos.map((modelo) => {
          const content = (
            <>
              <span
                className={`type-h3 text-base ${
                  modelo.estado === "Discontinuado"
                    ? "line-through decoration-muted-foreground/50 opacity-45"
                    : ""
                }`}
              >
                {modelo.nombre}
              </span>
              <EstadoModeloBadge estado={modelo.estado} />
            </>
          );

          const className = `flex items-center justify-between gap-2 rounded-xl px-4 py-3 border border-border transition-colors ${
            modelo.estado === "Discontinuado"
              ? "bg-muted/40 text-muted-foreground"
              : "bg-card hover:border-primary/30 hover:shadow-sm"
          }`;

          if (linkToDetail) {
            return (
              <li key={modelo.id}>
                <Link to={getModeloPath(marca, modelo)} className={`block ${className}`}>
                  {content}
                </Link>
              </li>
            );
          }

          return (
            <li key={modelo.id} className={className}>
              {content}
            </li>
          );
        })}
      </ul>

      {discontinuados.length > 0 && vigentes.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {discontinuados.length} modelo{discontinuados.length !== 1 ? "s" : ""} discontinuado
          {discontinuados.length !== 1 ? "s" : ""} en el catálogo histórico.
        </p>
      )}
    </div>
  );
}

export function MarcaHeader({ marca }: { marca: Marca }) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-5">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-border bg-card flex items-center justify-center p-3 shrink-0">
        <MarcaLogo
          marcaId={marca.id}
          nombre={marca.nombre}
          className="w-full h-full"
          imageClassName="max-h-16"
        />
      </div>
      <div>
        <h1 className="type-h1 text-foreground">{marca.nombre}</h1>
        <p className="type-marca-rep mt-2">{marca.representante}</p>
        <p className="type-meta text-muted-foreground mt-1 tabular-nums">
          En Argentina desde {marca.anioLanzamiento}
        </p>
      </div>
    </div>
  );
}
