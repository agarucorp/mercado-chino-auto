import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatKm, formatPrice, type Listing } from "@/data/listings";
import { MARCAS } from "@/data/marcas";
import { useApprovedListings } from "@/hooks/useListings";
import { FALLBACK_USD_ARS, fetchUsdArsVenta } from "@/lib/fx";
import {
  EMPTY_LISTING_FILTERS,
  countActiveFilters,
  listingPriceIn,
  matchesListingFilters,
  type ListingFilters,
} from "@/lib/listing-filters";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

type SortId = "newest" | "price-low" | "price-high" | "km-low";

const FUELS = [
  { value: "nafta", label: "Nafta" },
  { value: "diesel", label: "Diésel" },
  { value: "electrico", label: "Eléctrico" },
  { value: "hibrido", label: "Híbrido" },
];

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
}

const Clasificados = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_LISTING_FILTERS);
  const [sort, setSort] = useState<SortId>("newest");
  const { data: listings = [], isLoading } = useApprovedListings();
  const { data: usdArs = FALLBACK_USD_ARS } = useQuery({
    queryKey: ["fx", "usd-ars-oficial"],
    queryFn: fetchUsdArsVenta,
    staleTime: 30 * 60_000,
  });

  const setFilter = <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const activeFilters = countActiveFilters(filters);

  const options = useMemo(() => {
    const marcaIds = uniqueSorted(listings.map((l) => l.marcaId));
    return {
      marcas: marcaIds.map((id) => ({
        id,
        nombre: MARCAS.find((m) => m.id === id)?.nombre ?? id,
      })),
      years: [...new Set(listings.map((l) => l.year))].sort((a, b) => b - a),
      locations: uniqueSorted(listings.map((l) => l.location)),
    };
  }, [listings]);

  const visible = useMemo(() => {
    const matched = listings.filter((l) => matchesListingFilters(l, filters, usdArs));
    const byPrice = (l: Listing) => listingPriceIn(l, filters.priceCurrency, usdArs);
    return [...matched].sort((a, b) => {
      if (sort === "price-low") return byPrice(a) - byPrice(b);
      if (sort === "price-high") return byPrice(b) - byPrice(a);
      if (sort === "km-low") return a.km - b.km;
      return b.year - a.year;
    });
  }, [listings, filters, usdArs, sort]);

  return (
    <Layout>
      <section className="py-8 md:py-10">
        <div className="container mx-auto lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 items-start">
          <aside>
            <Button
              type="button"
              variant="outline"
              className="gap-2 w-full justify-between lg:hidden mb-4"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <span className="inline-flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros{activeFilters > 0 ? ` (${activeFilters})` : ""}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </Button>

            <div className={`${filtersOpen ? "block" : "hidden"} lg:block lg:sticky lg:top-24 space-y-5`}>
              <div className="hidden lg:flex items-center justify-between gap-3">
                <p className="type-h3 text-foreground">Filtros</p>
                {activeFilters > 0 && (
                  <button
                    type="button"
                    className="type-meta text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    onClick={() => setFilters(EMPTY_LISTING_FILTERS)}
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block" htmlFor="filtro-marca">
                  Marca
                </label>
                <Select value={filters.marcaId} onValueChange={(v) => setFilter("marcaId", v)}>
                  <SelectTrigger id="filtro-marca">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {options.marcas.map((marca) => (
                      <SelectItem key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" htmlFor="filtro-anio">
                  Año
                </label>
                <Select value={filters.year} onValueChange={(v) => setFilter("year", v)}>
                  <SelectTrigger id="filtro-anio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {options.years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" htmlFor="filtro-combustible">
                  Combustible
                </label>
                <Select value={filters.fuel} onValueChange={(v) => setFilter("fuel", v)}>
                  <SelectTrigger id="filtro-combustible">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {FUELS.map((fuel) => (
                      <SelectItem key={fuel.value} value={fuel.value}>
                        {fuel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" htmlFor="filtro-ubicacion">
                  Ubicación
                </label>
                <Select value={filters.location} onValueChange={(v) => setFilter("location", v)}>
                  <SelectTrigger id="filtro-ubicacion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {options.locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" htmlFor="filtro-transmision">
                  Transmisión
                </label>
                <Select
                  value={filters.transmission}
                  onValueChange={(v) => setFilter("transmission", v)}
                >
                  <SelectTrigger id="filtro-transmision">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatica">Automática</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" htmlFor="filtro-moneda">
                  Precio
                </label>
                <Select
                  value={filters.priceCurrency}
                  onValueChange={(v) => setFilter("priceCurrency", v as ListingFilters["priceCurrency"])}
                >
                  <SelectTrigger id="filtro-moneda" className="mb-2" aria-label="Moneda del precio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARS">Pesos</SelectItem>
                    <SelectItem value="USD">Dólares</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="Mínimo"
                    value={filters.priceMin}
                    onChange={(e) => setFilter("priceMin", e.target.value.replace(/[^\d]/g, ""))}
                    aria-label="Precio mínimo"
                  />
                  <Input
                    inputMode="numeric"
                    placeholder="Máximo"
                    value={filters.priceMax}
                    onChange={(e) => setFilter("priceMax", e.target.value.replace(/[^\d]/g, ""))}
                    aria-label="Precio máximo"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Kilómetros</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="Mínimo"
                    value={filters.kmMin}
                    onChange={(e) => setFilter("kmMin", e.target.value.replace(/[^\d]/g, ""))}
                    aria-label="Kilómetros mínimos"
                  />
                  <Input
                    inputMode="numeric"
                    placeholder="Máximo"
                    value={filters.kmMax}
                    onChange={(e) => setFilter("kmMax", e.target.value.replace(/[^\d]/g, ""))}
                    aria-label="Kilómetros máximos"
                  />
                </div>
              </div>

              {activeFilters > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="lg:hidden px-0"
                  onClick={() => setFilters(EMPTY_LISTING_FILTERS)}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </aside>

          <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{visible.length}</span>{" "}
              vehículos encontrados
            </p>
            <div className="flex flex-wrap items-center gap-3">
            <Select value={sort} onValueChange={(v) => setSort(v as SortId)}>
              <SelectTrigger className="w-[180px]" aria-label="Ordenar avisos">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price-low">Menor precio</SelectItem>
                <SelectItem value="price-high">Mayor precio</SelectItem>
                <SelectItem value="km-low">Menor kilometraje</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link to="/vender">Publicar aviso</Link>
            </Button>
            </div>
          </div>

          {isLoading ? (
            <p className="type-body text-muted-foreground text-center py-12">Cargando avisos…</p>
          ) : visible.length === 0 ? (
            <p className="type-body text-muted-foreground text-center py-12">
              {listings.length === 0
                ? "Todavía no hay avisos publicados. Podés enviar una solicitud desde Vender."
                : "Ningún aviso coincide con estos filtros."}
            </p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((listing, index) => (
              <motion.article
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/clasificados/${listing.id}`}
                  className="group block overflow-hidden transition-colors"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={listing.image}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover scale-110 blur-md"
                    />
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="relative h-full w-full object-contain"
                    />
                    {listing.featured && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="type-h3 text-foreground group-hover:text-primary transition-colors mb-2">
                      {listing.year} {listing.title}
                    </h3>

                    <p className="type-numeric font-semibold text-xl text-primary mb-4">
                      {formatPrice(listing.price, listing.currency ?? "ARS")}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>{listing.year}</span>
                      <span>{formatKm(listing.km)}</span>
                      <span>{listing.fuel}</span>
                      <span>{listing.location}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
          )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Clasificados;
