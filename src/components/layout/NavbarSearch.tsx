import { EstadoModeloBadge } from "@/components/brands/EstadoModeloBadge";
import { MarcaLogo } from "@/components/brands/MarcaLogo";
import { getMarcaForResult, searchCatalog, type SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SearchResultItem({
  result,
  onSelect,
}: {
  result: SearchResult;
  onSelect: () => void;
}) {
  const marca = getMarcaForResult(result);

  return (
    <Link
      to={result.href}
      onClick={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
        {result.type === "modelo" && result.image ? (
          <img
            src={result.image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : marca ? (
          <MarcaLogo marcaId={marca.id} nombre={marca.nombre} className="w-10 h-10 p-1" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="type-body text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {result.title}
        </p>
        <p className="type-meta text-xs text-muted-foreground truncate">{result.subtitle}</p>
      </div>
      {result.type === "modelo" && result.estado && (
        <EstadoModeloBadge estado={result.estado} />
      )}
      {result.type === "marca" && (
        <span className="type-meta text-xs text-muted-foreground shrink-0">Marca</span>
      )}
    </Link>
  );
}

interface NavbarSearchProps {
  className?: string;
  onNavigate?: () => void;
}

export function NavbarSearch({ className, onNavigate }: NavbarSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchCatalog(query), [query]);
  const hasQuery = query.trim().length > 0;
  const showDropdown = open && hasQuery;

  const marcas = results.filter((r) => r.type === "marca");
  const modelos = results.filter((r) => r.type === "modelo");

  const handleSelect = () => {
    setQuery("");
    setOpen(false);
    onNavigate?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(results[0].href);
      handleSelect();
    }
  };

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar marca o modelo..."
            aria-label="Buscar marca o modelo"
            aria-expanded={showDropdown}
            aria-controls="navbar-search-results"
            autoComplete="off"
            className={cn(
              "w-full h-10 pl-9 pr-4 rounded-lg text-sm",
              "bg-white/10 border border-white/15 text-white placeholder:text-white/45",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40",
            )}
          />
        </div>
      </form>

      {showDropdown && (
        <div
          id="navbar-search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card z-[60] overflow-hidden"
        >
          {results.length > 0 ? (
            <div className="max-h-[min(24rem,70vh)] overflow-y-auto p-2">
              {marcas.length > 0 && (
                <div className="mb-2">
                  <p className="type-meta text-xs text-muted-foreground px-3 py-1.5 uppercase tracking-wide">
                    Marcas
                  </p>
                  {marcas.map((result) => (
                    <SearchResultItem key={result.id} result={result} onSelect={handleSelect} />
                  ))}
                </div>
              )}
              {modelos.length > 0 && (
                <div>
                  <p className="type-meta text-xs text-muted-foreground px-3 py-1.5 uppercase tracking-wide">
                    Modelos
                  </p>
                  {modelos.map((result) => (
                    <SearchResultItem key={result.id} result={result} onSelect={handleSelect} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="type-body text-sm text-muted-foreground px-4 py-6 text-center">
              No encontramos resultados para &quot;{query.trim()}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
