import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PROVIDER_CATEGORIES, listProviders } from "@/lib/providers-api";
import type { ProviderCategory } from "@/types/database";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Repuestos = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get("categoria");
  const categoria: ProviderCategory =
    raw === "mecanico" || raw === "lubricentro" || raw === "estetico" ? raw : "estetico";

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["service-providers", "public"],
    queryFn: () => listProviders(true),
  });

  const visibles = useMemo(
    () => data.filter((item) => item.category === categoria),
    [data, categoria],
  );

  return (
    <Layout>
      <section className="container mx-auto py-10 md:py-14">
        <h1 className="type-h1 text-foreground">Repuestos y talleres de autos chinos</h1>
        <p className="type-body text-muted-foreground mt-2 max-w-2xl">
          Cuidado estético, mecánica y lubricentros. Elegí una categoría para ver los proveedores.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {PROVIDER_CATEGORIES.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={categoria === item.id ? "default" : "outline"}
              onClick={() => setParams({ categoria: item.id })}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          {isError && (
            <p className="type-body-sm text-muted-foreground">
              {error instanceof Error ? error.message : "No se pudieron cargar los proveedores."}
            </p>
          )}
          {!isLoading && !isError && visibles.length === 0 && (
            <p className="type-body text-muted-foreground">Todavía no hay proveedores en esta categoría.</p>
          )}
          {visibles.map((item) => (
            <article key={item.id} className="rounded-xl border border-border p-5">
              <h2 className="type-h3 text-foreground">{item.name}</h2>
              {item.city && <p className="type-meta text-muted-foreground mt-1">{item.city}</p>}
              {item.description && <p className="type-body-sm mt-3 whitespace-pre-line">{item.description}</p>}
              {item.phone && (
                <a className="type-body-sm text-primary mt-3 inline-block" href={`tel:${item.phone}`}>
                  {item.phone}
                </a>
              )}
            </article>
          ))}
        </div>

        <p className="type-body-sm text-muted-foreground mt-10">
          ¿Tenés un taller o casa de repuestos?{" "}
          <Link to="/contacto" className="text-primary underline underline-offset-4">
            Escribinos para publicar
          </Link>
          .
        </p>
      </section>
    </Layout>
  );
};

export default Repuestos;
