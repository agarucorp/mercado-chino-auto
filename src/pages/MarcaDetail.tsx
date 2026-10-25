import { MarcaCtas } from "@/components/brands/MarcaCtas";
import { MarcaHeader, MarcaModelosList } from "@/components/brands/MarcaModelosList";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useNewsByMarca } from "@/hooks/useNews";
import { useCatalogSnapshot } from "@/hooks/useModelCatalog";
import { getMarcaBySlug } from "@/lib/marcas";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

const MarcaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const catalog = useCatalogSnapshot();
  const marca = slug ? getMarcaBySlug(catalog.marcas, slug) : undefined;

  // Antes del early return: los hooks tienen que correr en el mismo orden
  // en todos los renders, incluido el que redirige.
  const noticiasMarca = useNewsByMarca(marca?.id ?? "");

  if (!marca) {
    if (!catalog.ready) {
      return (
        <Layout>
          <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          </div>
        </Layout>
      );
    }
    return <Navigate to="/marcas" replace />;
  }

  return (
    <Layout>
      <section className="py-10 md:py-14">
        <div className="container mx-auto">
          <Link
            to="/marcas"
            className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Todas las marcas
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <MarcaHeader marca={marca} />

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-foreground border-border">
                  {marca.modelos.length} modelo{marca.modelos.length !== 1 ? "s" : ""}
                </Badge>
                {marca.anioLanzamiento >= 2025 && (
                  <Badge variant="outline" className="border-border text-foreground">
                    Novedad
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 type-meta text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Representada por {marca.representante}
              </div>

              <MarcaCtas marca={marca} />
            </div>

            <div>
              <h2 className="type-h2 text-foreground mb-6">
                Modelos ({marca.modelos.length})
              </h2>
              <MarcaModelosList marca={marca} />
            </div>

            {noticiasMarca.length > 0 && (
              <div>
                <h2 className="type-h2 text-foreground mb-4">Noticias de {marca.nombre}</h2>
                <ul className="space-y-2">
                  {noticiasMarca.slice(0, 4).map((n) => (
                    <li key={n.id}>
                      <Link
                        to={`/noticias/${n.id}`}
                        className="type-body text-foreground hover:text-primary transition-colors"
                      >
                        {n.title}
                      </Link>
                      <p className="type-meta text-muted-foreground">
                        {n.source} · {n.date}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MarcaDetail;
