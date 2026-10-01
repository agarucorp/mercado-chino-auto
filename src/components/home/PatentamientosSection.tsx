import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModeloImage } from "@/data/modelo-media";
import { MARCAS } from "@/data/marcas";
import { DNRPA_FUENTE_URL, DNRPA_YEARS } from "@/data/dnrpa-patentamientos";
import {
  formatEnteroAr,
  formatFechaCorteDnrpa,
  formatPctAr,
  labelPeriodoDnrpa,
  marcasConPatentamientos,
  rankPatentamientos,
  type DnrpaYearFilter,
} from "@/lib/dnrpa";
import { getModeloPath, resolveModeloId } from "@/lib/marcas";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const INITIAL_VISIBLE = 12;

export function PatentamientosSection() {
  const [year, setYear] = useState<DnrpaYearFilter>(2026);
  const [marcaId, setMarcaId] = useState("todas");
  const [expanded, setExpanded] = useState(false);

  const marcasFiltro = useMemo(() => marcasConPatentamientos(year), [year]);
  const ranking = useMemo(
    () => rankPatentamientos({ year, marcaId }),
    [year, marcaId],
  );
  const rankingGlobal = useMemo(() => rankPatentamientos({ year }), [year]);

  const visible = expanded ? ranking.rows : ranking.rows.slice(0, INITIAL_VISIBLE);
  const maxCantidad = ranking.rows[0]?.cantidad ?? 1;
  const shareChinos =
    ranking.totalInscripciones > 0 ? ranking.totalChinos / ranking.totalInscripciones : 0;
  const shareCatalogo =
    ranking.totalChinos > 0 ? rankingGlobal.totalCatalogo / ranking.totalChinos : 0;
  const shareMarca =
    rankingGlobal.totalCatalogo > 0 ? ranking.totalCatalogo / rankingGlobal.totalCatalogo : 0;
  const filtradoPorMarca = marcaId !== "todas";

  const handleYear = (next: DnrpaYearFilter) => {
    setYear(next);
    setExpanded(false);
    setMarcaId((current) => {
      if (current === "todas") return current;
      const still = marcasConPatentamientos(next).some((m) => m.id === current);
      return still ? current : "todas";
    });
  };

  return (
    <section className="py-8 md:py-10 border-b border-border">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h2 className="type-h2 text-foreground">Patentamientos 0 km</h2>
            <p className="type-meta text-muted-foreground mt-1 max-w-2xl">
              Ranking de inscripciones iniciales de modelos chinos del catálogo. Datos abiertos de
              la DNRPA ({formatFechaCorteDnrpa()}).
            </p>
          </div>
          <a
            href={DNRPA_FUENTE_URL}
            target="_blank"
            rel="noreferrer"
            className="type-meta text-foreground underline underline-offset-4 hover:text-primary transition-colors shrink-0"
          >
            Fuente: datos.jus.gob.ar
          </a>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center mb-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Período">
            {[...DNRPA_YEARS].reverse().map((y) => (
              <Button
                key={y}
                type="button"
                size="sm"
                variant={year === y ? "default" : "ghost"}
                onClick={() => handleYear(y)}
              >
                {labelPeriodoDnrpa(y)}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant={year === "todos" ? "default" : "ghost"}
              onClick={() => handleYear("todos")}
            >
              2024–2026
            </Button>
          </div>

          <Select
            value={marcaId}
            onValueChange={(value) => {
              setMarcaId(value);
              setExpanded(false);
            }}
          >
            <SelectTrigger className="sm:w-56" aria-label="Marca">
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las marcas</SelectItem>
              {marcasFiltro.map((marca) => (
                <SelectItem key={marca.id} value={marca.id}>
                  {marca.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <StatCard
            label={filtradoPorMarca ? "Patentamientos de la marca" : "Modelos del catálogo"}
            value={formatEnteroAr(ranking.totalCatalogo)}
            hint={labelPeriodoDnrpa(year)}
          />
          {filtradoPorMarca ? (
            <StatCard
              label="Share entre modelos chinos"
              value={formatPctAr(shareMarca)}
              hint="sobre el ranking del catálogo"
            />
          ) : (
            <StatCard
              label="Marcas chinas (DNRPA)"
              value={formatEnteroAr(ranking.totalChinos)}
              hint={`${formatPctAr(shareCatalogo, 0)} mapeados al sitio`}
            />
          )}
          <StatCard
            label="Share vs. mercado 0 km"
            value={formatPctAr(shareChinos)}
            hint="marcas chinas sobre el total de inscripciones"
          />
        </div>

        {ranking.rows.length === 0 ? (
          <p className="type-body text-muted-foreground text-center py-8">
            No hay patentamientos de catálogo para este filtro.
          </p>
        ) : (
          <ol className="space-y-2">
            {visible.map((row, index) => {
              const marca = MARCAS.find((m) => m.id === row.marcaId);
              const modelo = marca?.modelos.find((m) => m.id === resolveModeloId(row.modeloId));
              const href =
                marca && modelo ? getModeloPath(marca, modelo) : `/marcas/${row.marcaId}`;
              const width = Math.max(6, (row.cantidad / maxCantidad) * 100);

              return (
                <li key={row.modeloId}>
                  <Link
                    to={href}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <span className="type-numeric text-sm text-muted-foreground w-6 text-right">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="hidden sm:block w-16 shrink-0 aspect-[16/10] overflow-hidden rounded-md bg-muted">
                        <img
                          src={getModeloImage(row.modeloId)}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="type-body-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {row.modeloNombre}
                        </p>
                        <p className="type-meta text-muted-foreground">{row.marcaNombre}</p>
                        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-foreground/80"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="type-numeric text-base font-semibold text-foreground">
                        {formatEnteroAr(row.cantidad)}
                      </p>
                      <p className="type-meta text-muted-foreground">
                        {formatPctAr(row.share, 1)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        {ranking.rows.length > INITIAL_VISIBLE && (
          <div className="mt-4 flex justify-center">
            <Button type="button" variant="ghost" onClick={() => setExpanded((v) => !v)}>
              {expanded
                ? "Ver top 12"
                : `Ver ranking completo (${ranking.rows.length})`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border px-4 py-3">
      <p className="type-label text-muted-foreground">{label}</p>
      <p className="type-numeric text-2xl font-semibold text-foreground mt-1">{value}</p>
      <p className="type-meta text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}
