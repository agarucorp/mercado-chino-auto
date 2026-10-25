import { MarcaLogo } from "@/components/brands/MarcaLogo";
import { useCatalogSnapshot } from "@/hooks/useModelCatalog";
import { getMarcaForResult, searchCatalog, type SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const catalog = useCatalogSnapshot();

  const results = useMemo(() => searchCatalog(query), [query, catalog.marcas]);
  const hasQuery = query.trim().length > 0;
  const showDropdown = open && hasQuery;

  const marcas = results.filter((r) => r.type === "marca");
  const modelos = results.filter((r) => r.type === "modelo");

  const closeSearch = () => {
    setExpanded(false);
    setOpen(false);
    setQuery("");
  };

  const handleSelect = () => {
    closeSearch();
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
    if (!expanded) return;

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [expanded]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (expanded) closeSearch();
        else setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={cn(
          "p-2 rounded-lg text-white/80 hover:text-white transition-colors",
          className,
        )}
        aria-label="Buscar marca o modelo"
      >
        <Search className="w-4 h-4" />
      </button>

      {expanded &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[55] bg-black/70" aria-hidden />
            <div
              ref={panelRef}
              className="fixed inset-x-0 top-0 z-[60] navbar-glass border-b border-white/10 shadow-lg"
              role="dialog"
              aria-modal="true"
              aria-label="Búsqueda"
            >
              <div className="container mx-auto py-4">
                <form onSubmit={handleSubmit} role="search" className="flex items-center gap-3">
                  <div className="relative flex-1">
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
                        "w-full h-11 pl-9 pr-4 rounded-lg text-sm",
                        "bg-white/10 border border-white/15 text-white placeholder:text-white/45",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40",
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="p-2 rounded-lg text-white/80 hover:text-white transition-colors shrink-0"
                    aria-label="Cerrar búsqueda"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>

                {showDropdown && (
                  <div
                    id="navbar-search-results"
                    role="listbox"
                    className="mt-3 rounded-xl border border-border bg-card overflow-hidden"
                  >
                    {results.length > 0 ? (
                      <div className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
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
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
