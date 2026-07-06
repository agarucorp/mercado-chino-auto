import { NewsCard } from "@/components/news/NewsCard";
import { NewsFeaturedLead } from "@/components/news/NewsFeaturedLead";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { getFilteredNews, getNewsMarcas, getNewsYears } from "@/data/news";
import { useMemo, useState } from "react";

const INITIAL_GRID = 3;
const LOAD_MORE_STEP = 3;

const selectClassName =
  "h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[140px]";

const Noticias = () => {
  const years = useMemo(() => getNewsYears(), []);
  const marcas = useMemo(() => getNewsMarcas(), []);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [marcaFilter, setMarcaFilter] = useState<string>("all");
  const [gridCount, setGridCount] = useState(INITIAL_GRID);

  const year = yearFilter === "all" ? null : Number(yearFilter);
  const marcaId = marcaFilter === "all" ? null : marcaFilter;

  const filtered = useMemo(
    () => getFilteredNews(year, marcaId),
    [year, marcaId],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const gridItems = rest.slice(0, gridCount);
  const hasMore = rest.length > gridCount;

  const resetPagination = () => setGridCount(INITIAL_GRID);

  return (
    <Layout>
      <section className="border-b border-border bg-accent text-accent-foreground">
        <div className="container mx-auto py-10 md:py-14">
          <h1 className="type-h1 text-white">Radar de noticias</h1>
          <p className="type-lead text-white/75 mt-2 max-w-xl">
            Novedades, lanzamientos y análisis del mercado automotriz chino en Argentina.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-end gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <label htmlFor="filtro-anio-noticias" className="type-meta text-muted-foreground">
                Año
              </label>
              <select
                id="filtro-anio-noticias"
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  resetPagination();
                }}
                className={selectClassName}
              >
                <option value="all">Todos</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="filtro-marca-noticias" className="type-meta text-muted-foreground">
                Marca
              </label>
              <select
                id="filtro-marca-noticias"
                value={marcaFilter}
                onChange={(e) => {
                  setMarcaFilter(e.target.value);
                  resetPagination();
                }}
                className={selectClassName}
              >
                <option value="all">Todas</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {featured ? (
            <div className="space-y-8 md:space-y-10">
              <NewsFeaturedLead article={featured} />

              {gridItems.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridItems.map((article) => (
                    <NewsCard key={article.id} {...article} />
                  ))}
                </div>
              )}

              {(hasMore || gridCount > INITIAL_GRID) && (
                <div className="flex justify-center pt-4">
                  {hasMore ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setGridCount((c) => c + LOAD_MORE_STEP)}
                    >
                      Ver más
                    </Button>
                  ) : (
                    <p className="type-meta text-muted-foreground">
                      No hay más noticias para este filtro
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="type-body text-muted-foreground text-center py-16">
              No hay noticias para los filtros seleccionados.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Noticias;
