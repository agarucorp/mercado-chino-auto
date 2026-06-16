import { Badge } from "@/components/ui/badge";
import type { Modelo } from "@/types/marcas";

export function EstadoModeloBadge({ estado }: { estado: Modelo["estado"] }) {
  if (estado === "Vigente") {
    return (
      <Badge className="bg-emerald-600/90 hover:bg-emerald-600/90 border-0">
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
