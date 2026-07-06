import { Badge } from "@/components/ui/badge";
import type { Modelo } from "@/types/marcas";

export function EstadoModeloBadge({ estado }: { estado: Modelo["estado"] }) {
  if (estado === "Vigente") {
    return (
      <Badge variant="outline" className="text-foreground border-border">
        Vigente
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground opacity-45">
      Discontinuado
    </Badge>
  );
}
