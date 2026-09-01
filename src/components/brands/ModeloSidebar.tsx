import { MarcaCtas } from "@/components/brands/MarcaCtas";
import { SpecHighlightGrid, SummaryCardShell } from "@/components/detail/SummaryCardShell";
import type { FichaTecnicaRow } from "@/data/modelo-media";
import type { Marca, Modelo } from "@/types/marcas";
import { Building2, CarFront, Fuel, Settings2 } from "lucide-react";

function fichaVal(ficha: FichaTecnicaRow[], label: string): string {
  return ficha.find((r) => r.label === label)?.value ?? "—";
}

interface ModeloSidebarProps {
  marca: Marca;
  modelo: Modelo;
  ficha: FichaTecnicaRow[];
}

export function ModeloSidebar({ marca, modelo, ficha }: ModeloSidebarProps) {
  const title = `${marca.nombre} ${modelo.nombre}`;

  const motor =
    fichaVal(ficha, "Tipo de motor") !== "—"
      ? fichaVal(ficha, "Tipo de motor")
      : fichaVal(ficha, "Motor");
  const transmision = fichaVal(ficha, "Transmisión");
  const precio = fichaVal(ficha, "Precio");
  const vigencia = fichaVal(ficha, "Vigencia");

  const specs = [
    {
      icon: <CarFront className="w-5 h-5" />,
      label: "Precio",
      value: precio,
    },
    {
      icon: <Fuel className="w-5 h-5" />,
      label: "Tipo de motor",
      value: motor,
    },
    {
      icon: <Settings2 className="w-5 h-5" />,
      label: transmision !== "—" ? "Transmisión" : "Vigencia",
      value: transmision !== "—" ? transmision : vigencia,
    },
  ];

  return (
    <SummaryCardShell
      title={title}
      footer={`Representado por ${marca.representante}`}
    >
      <div className="space-y-3">
        <p className="type-meta text-muted-foreground flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          {marca.representante} · Argentina desde {marca.anioLanzamiento}
        </p>
      </div>

      <SpecHighlightGrid items={specs} />

      <div className="space-y-3">
        <MarcaCtas marca={marca} stacked />
      </div>
    </SummaryCardShell>
  );
}
