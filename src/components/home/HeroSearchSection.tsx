import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogSnapshot } from "@/hooks/useModelCatalog";
import { getModeloPath } from "@/lib/marcas";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const darkSelectTrigger =
  "h-12 rounded-lg border-white/35 bg-transparent text-white type-body-sm focus:ring-white/20 focus:ring-offset-0 focus:ring-offset-transparent data-[placeholder]:text-white/50 [&_svg]:text-white/70";

const selectContentProps = {
  side: "bottom" as const,
  align: "start" as const,
  sideOffset: 6,
  collisionPadding: 16,
  className: "z-[200] max-h-72",
};

export function HeroSearchSection() {
  const navigate = useNavigate();
  const catalog = useCatalogSnapshot();
  const [marcaId, setMarcaId] = useState("");
  const [modeloId, setModeloId] = useState("");
  const marcasOrdenadas = useMemo(
    () => [...catalog.marcas].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [catalog.marcas],
  );

  const marca = useMemo(
    () => marcasOrdenadas.find((item) => item.id === marcaId),
    [marcaId, marcasOrdenadas],
  );

  const modelos = useMemo(() => {
    if (!marca) return [];
    return [...marca.modelos].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [marca]);

  const handleMarcaChange = (value: string) => {
    setMarcaId(value);
    setModeloId("");
  };

  const handleSearch = () => {
    if (!marca || !modeloId) return;
    const modelo = marca.modelos.find((item) => item.id === modeloId);
    if (modelo) navigate(getModeloPath(marca, modelo));
  };

  return (
    <section className="bg-accent text-accent-foreground border-b border-white/10">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/15 shadow-lg">
          <div className="bg-[#141414] rounded-2xl px-6 py-6 md:px-8 md:py-8">
            <h2 className="type-h2 text-white mb-6">Buscá por marca y modelo</h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Select value={marcaId} onValueChange={handleMarcaChange}>
                <SelectTrigger className={darkSelectTrigger} aria-label="Marca">
                  <SelectValue placeholder="Seleccioná la marca" />
                </SelectTrigger>
                <SelectContent {...selectContentProps}>
                  {marcasOrdenadas.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={modeloId} onValueChange={setModeloId} disabled={!marca}>
                <SelectTrigger
                  className={darkSelectTrigger}
                  aria-label="Modelo"
                  disabled={!marca}
                >
                  <SelectValue placeholder="Seleccioná el modelo" />
                </SelectTrigger>
                <SelectContent {...selectContentProps}>
                  {modelos.map((modelo) => (
                    <SelectItem key={modelo.id} value={modelo.id}>
                      {modelo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  variant="onDarkSolid"
                  className="w-full sm:w-auto min-w-[140px]"
                  disabled={!marcaId || !modeloId}
                >
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
