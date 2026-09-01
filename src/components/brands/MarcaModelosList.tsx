import { MarcaLogo } from "@/components/brands/MarcaLogo";
import { ModeloCard } from "@/components/brands/ModeloCard";
import type { Marca } from "@/types/marcas";

interface MarcaModelosListProps {
  marca: Marca;
}

export function MarcaModelosList({ marca }: MarcaModelosListProps) {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {marca.modelos.map((modelo) => (
        <li key={modelo.id}>
          <ModeloCard marca={marca} modelo={modelo} />
        </li>
      ))}
    </ul>
  );
}

export function MarcaHeader({ marca }: { marca: Marca }) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-5">
      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg bg-muted/30 flex items-center justify-center p-3 shrink-0">
        <MarcaLogo
          marcaId={marca.id}
          nombre={marca.nombre}
          className="w-full h-full"
          imageClassName="max-h-20"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="type-h1 text-foreground">{marca.nombre}</h1>
        <p className="type-marca-rep mt-2">{marca.representante}</p>
        <p className="type-meta text-muted-foreground mt-1 tabular-nums">
          En Argentina desde {marca.anioLanzamiento}
        </p>
      </div>
    </div>
  );
}
