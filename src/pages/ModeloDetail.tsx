import { ModeloSidebar } from "@/components/brands/ModeloSidebar";
import {
  DetailMobileAside,
  DetailPageGrid,
  DetailStickyAside,
} from "@/components/detail/DetailStickyAside";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingSpecTable } from "@/components/listings/ListingDetailSections";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { Layout } from "@/components/layout/Layout";
import { NewsCard } from "@/components/news/NewsCard";
import { formatKm, formatListingPrice } from "@/data/listings";
import { useApprovedListings } from "@/hooks/useListings";
import { useNewsByModelo } from "@/hooks/useNews";
import { useCatalogSnapshot } from "@/hooks/useModelCatalog";
import { fichaForVariant, fichaVariantNames } from "@/lib/ficha-variantes";
import { getMarcaBySlug, getModeloBySlug, resolveModeloId } from "@/lib/marcas";
import { resolveFicha, resolveImages, resolveSummary } from "@/lib/model-catalog";
import { ArrowLeft, Loader2, MapPin, Newspaper } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

function fichaToSpecs(ficha: { label: string; value: string }[]) {
  return ficha.map((row) => ({ label: row.label, value: row.value }));
}

const ModeloDetail = () => {
  const { marcaSlug, modeloSlug } = useParams<{
    marcaSlug: string;
    modeloSlug: string;
  }>();

  const catalog = useCatalogSnapshot();
  const marca = marcaSlug ? getMarcaBySlug(catalog.marcas, marcaSlug) : undefined;
  const modelo = marca && modeloSlug ? getModeloBySlug(marca, modeloSlug) : undefined;

  // Antes del early return: los hooks tienen que correr en el mismo orden
  // en todos los renders, incluido el que redirige.
  const noticiasModelo = useNewsByModelo(marca?.id ?? "", modelo?.id ?? "");
  const noticias = noticiasModelo.filter((n) => n.published !== false);
  const historial = noticiasModelo.filter((n) => n.published === false);
  const { data: allListings = [] } = useApprovedListings();
  const fichaCompleta = resolveFicha(modelo?.id ?? "");
  const variantes = fichaVariantNames(fichaCompleta);
  const [motorizacionElegida, setMotorizacionElegida] = useState<{ id: string; name: string } | null>(
    null,
  );
  const motorizacionActiva =
    motorizacionElegida?.id === modelo?.id
      ? (variantes.find((nombre) => nombre === motorizacionElegida.name) ?? variantes[0] ?? "")
      : (variantes[0] ?? "");

  if (!marca || !modelo) {
    if (!catalog.ready) {
      return (
        <Layout>
          <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            <span className="type-body">Cargando modelo…</span>
          </div>
        </Layout>
      );
    }
    return <Navigate to="/marcas" replace />;
  }

  const clasificados = allListings.filter(
    (l) => l.marcaId === marca.id && resolveModeloId(l.modeloId ?? "") === modelo.id,
  );
  const ficha = motorizacionActiva
    ? fichaForVariant(fichaCompleta, motorizacionActiva)
    : fichaCompleta;
  const imagenes = resolveImages(modelo.id);
  const summary = resolveSummary(modelo.id);

  return (
    <Layout>
      <section className="py-6 md:py-10 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          <Link
            to={`/marcas/${marca.slug}`}
            className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {marca.nombre}
          </Link>

          <DetailPageGrid
              sidebar={
                <DetailStickyAside>
                  <ModeloSidebar marca={marca} modelo={modelo} ficha={ficha} summary={summary} />
                </DetailStickyAside>
              }
            >
              <ListingGallery images={imagenes} title={modelo.nombre} />

              <DetailMobileAside>
                <ModeloSidebar marca={marca} modelo={modelo} ficha={ficha} summary={summary} />
              </DetailMobileAside>

              <div className="py-2 md:py-4 space-y-4">
                {variantes.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {variantes.map((nombre) => (
                      <button
                        key={nombre}
                        type="button"
                        onClick={() =>
                          modelo && setMotorizacionElegida({ id: modelo.id, name: nombre })
                        }
                        className={
                          nombre === motorizacionActiva
                            ? "rounded-full bg-primary px-4 py-2 type-meta text-primary-foreground"
                            : "rounded-full border border-border px-4 py-2 type-meta text-foreground hover:border-primary"
                        }
                      >
                        {nombre}
                      </button>
                    ))}
                  </div>
                )}
                <ListingSpecTable title="Ficha técnica" rows={fichaToSpecs(ficha)} />
              </div>

              <ReviewsSection
                marcaId={marca.id}
                modeloId={modelo.id}
                brand={marca.nombre}
                model={modelo.nombre}
              />

              <section>
                <div className="py-2 md:py-4">
                  <h2 className="type-h2 text-foreground mb-6 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-primary" />
                    Noticias
                  </h2>
                  {noticias.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {noticias.map((n) => (
                        <NewsCard key={n.id} {...n} />
                      ))}
                    </div>
                  ) : (
                    <p className="type-body text-muted-foreground bg-muted/30 rounded-xl px-4 py-8 text-center">
                      No hay noticias recientes sobre este modelo.
                    </p>
                  )}

                  {historial.length > 0 && (
                    <div className="mt-10">
                      <h3 className="type-h3 text-foreground mb-4">Historial</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {historial.map((n) => (
                          <NewsCard key={n.id} {...n} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="py-2 md:py-4">
                  <h2 className="type-h2 text-foreground mb-6">Clasificados publicados</h2>
                  {clasificados.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {clasificados.map((l) => (
                        <Link
                          key={l.id}
                          to={`/clasificados/${l.id}`}
                          className="group overflow-hidden transition-colors"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                            <img
                              src={l.image}
                              alt={l.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="type-h3 text-base group-hover:text-primary transition-colors">
                              {l.year} {l.title}
                            </h3>
                            <p className="type-numeric font-semibold text-primary mt-2">
                              {formatListingPrice(l)}
                            </p>
                            <p className="type-meta text-muted-foreground mt-2 flex items-center gap-3">
                              <span>{formatKm(l.km)}</span>
                            </p>
                            <p className="type-meta text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {l.location}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="type-body text-muted-foreground bg-muted/30 rounded-xl px-4 py-8 text-center">
                      No hay publicaciones activas para este modelo en clasificados.
                    </p>
                  )}
                </div>
              </section>
            </DetailPageGrid>
        </div>
      </section>
    </Layout>
  );
};

export default ModeloDetail;
