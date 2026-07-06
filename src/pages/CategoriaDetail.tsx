import { ModeloCard } from "@/components/brands/ModeloCard";
import { Layout } from "@/components/layout/Layout";
import { getCategoriaActivaBySlug, getModelosPorCategoria, type CategoriaSlug } from "@/lib/categorias";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

const CategoriaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoria = slug ? getCategoriaActivaBySlug(slug) : undefined;

  if (!categoria) {
    return <Navigate to="/" replace />;
  }

  const modelos = getModelosPorCategoria(categoria.slug as CategoriaSlug);
  const Icon = categoria.icon;

  return (
    <Layout>
      <section className="py-10 md:py-14 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </Link>

          <div className="flex items-start gap-4 mb-10">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                "bg-gradient-to-br from-primary/25 via-primary/10 to-primary/5",
                "ring-1 ring-primary/10 shadow-sm",
              )}
            >
              <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="type-h1 text-foreground">{categoria.label}</h1>
              <p className="type-meta text-muted-foreground mt-1">{categoria.descripcion}</p>
              <p className="type-body text-muted-foreground mt-2">
                <span className="font-semibold text-foreground tabular-nums">{modelos.length}</span>{" "}
                modelo{modelos.length !== 1 ? "s" : ""} en el catálogo
              </p>
            </div>
          </div>

          {modelos.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {modelos.map(({ marca, modelo }) => (
                <li key={modelo.id}>
                  <ModeloCard marca={marca} modelo={modelo} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="type-body text-muted-foreground bg-card rounded-xl border border-border px-6 py-12 text-center">
              No hay modelos en esta categoría por el momento.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoriaDetail;
