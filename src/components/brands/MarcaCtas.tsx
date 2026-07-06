import { Button } from "@/components/ui/button";
import { getMarcaSitioOficial, getRepresentanteSitioOficial } from "@/data/marca-meta";
import { cn } from "@/lib/utils";
import type { Marca } from "@/types/marcas";
import { Building2, ExternalLink } from "lucide-react";

interface MarcaCtasProps {
  marca: Marca;
  stacked?: boolean;
}

export function MarcaCtas({ marca, stacked }: MarcaCtasProps) {
  const sitioAgencia = getRepresentanteSitioOficial(marca.representante);
  const sitioMarca = getMarcaSitioOficial(marca.id);

  return (
    <div className={cn("flex gap-3", stacked ? "flex-col" : "flex-wrap")}>
      {sitioAgencia ? (
        <Button asChild variant="default" className={stacked ? "w-full" : undefined}>
          <a href={sitioAgencia} target="_blank" rel="noopener noreferrer">
            <Building2 className="w-4 h-4" />
            {marca.representante}
          </a>
        </Button>
      ) : (
        <Button
          type="button"
          variant="default"
          disabled
          className={stacked ? "w-full" : undefined}
          aria-disabled
        >
          <Building2 className="w-4 h-4" />
          {marca.representante}
        </Button>
      )}

      {sitioMarca && (
        <Button asChild variant="outline" className={stacked ? "w-full" : undefined}>
          <a href={sitioMarca} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Sitio oficial de la marca
          </a>
        </Button>
      )}
    </div>
  );
}
