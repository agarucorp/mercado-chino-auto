import { EstadoModeloBadge } from "@/components/brands/EstadoModeloBadge";
import { MarcaLogo } from "@/components/brands/MarcaLogo";
import { Layout } from "@/components/layout/Layout";
import { NewsCard } from "@/components/news/NewsCard";
import { formatKm, formatPrice, getListingsByModelo } from "@/data/listings";
import { getNewsByModelo } from "@/data/news";
import { getReviewsByModelo } from "@/data/reviews";
import { MARCAS } from "@/data/marcas";
import { getMarcaBySlug, getModeloBySlug } from "@/lib/marcas";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Star, ThumbsUp, User } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

const FICHA_TECNICA_PLACEHOLDER = [
  { label: "Segmento", value: "Por confirmar" },
  { label: "Motor", value: "Por confirmar" },
  { label: "Potencia", value: "Por confirmar" },
  { label: "Transmisión", value: "Por confirmar" },
  { label: "Tracción", value: "Por confirmar" },
  { label: "Combustible", value: "Por confirmar" },
];

const ModeloDetail = () => {
  const { marcaSlug, modeloSlug } = useParams<{
    marcaSlug: string;
    modeloSlug: string;
  }>();

  const marca = marcaSlug ? getMarcaBySlug(MARCAS, marcaSlug) : undefined;
  const modelo = marca && modeloSlug ? getModeloBySlug(marca, modeloSlug) : undefined;

  if (!marca || !modelo) {
    return <Navigate to="/" replace />;
  }

  const noticias = getNewsByModelo(marca.id, modelo.id);
  const resenas = getReviewsByModelo(marca.id, modelo.id);
  const clasificados = getListingsByModelo(marca.id, modelo.id);

  return (
    <Layout>
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <Link
            to={`/marcas/${marca.slug}`}
            className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {marca.nombre}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-16 h-16 rounded-xl border border-border bg-card p-2 shrink-0">
                <MarcaLogo marcaId={marca.id} nombre={marca.nombre} className="w-full h-full" />
              </div>
              <div>
                <p className="type-marca-rep text-muted-foreground">{marca.nombre}</p>
                <h1 className="type-h1 text-foreground">{modelo.nombre}</h1>
                <div className="mt-3">
                  <EstadoModeloBadge estado={modelo.estado} />
                </div>
              </div>
            </div>

            <section>
              <h2 className="type-h2 text-foreground mb-4">Ficha técnica</h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {FICHA_TECNICA_PLACEHOLDER.map((row) => (
                      <tr key={row.label} className="border-b border-border last:border-0">
                        <th className="type-label text-left px-4 py-3 bg-muted/40 w-1/3 normal-case tracking-normal font-medium text-muted-foreground">
                          {row.label}
                        </th>
                        <td className="type-body px-4 py-3">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {noticias.length > 0 && (
              <section>
                <h2 className="type-h2 text-foreground mb-6">Noticias</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {noticias.map((n) => (
                    <NewsCard key={n.id} {...n} />
                  ))}
                </div>
              </section>
            )}

            {resenas.length > 0 && (
              <section>
                <h2 className="type-h2 text-foreground mb-6">Reseñas de propietarios</h2>
                <div className="space-y-4">
                  {resenas.map((r) => (
                    <article key={r.id} className="bg-card rounded-xl p-6 card-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="type-h3 text-base">{r.author}</p>
                          <p className="type-meta text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {r.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? "fill-accent text-accent" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <p className="type-body text-muted-foreground">{r.content}</p>
                      <p className="type-meta text-muted-foreground mt-3 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {r.likes}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {clasificados.length > 0 && (
              <section>
                <h2 className="type-h2 text-foreground mb-6">Clasificados publicados</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clasificados.map((l) => (
                    <Link
                      key={l.id}
                      to="/clasificados"
                      className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={l.image}
                          alt={l.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="type-h3 text-base group-hover:text-primary transition-colors">
                          {l.title}
                        </h3>
                        <p className="type-numeric font-semibold text-primary mt-2">
                          {formatPrice(l.price)}
                        </p>
                        <p className="type-meta text-muted-foreground mt-2 flex items-center gap-3">
                          <span>{l.year}</span>
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
              </section>
            )}

            {noticias.length === 0 && resenas.length === 0 && clasificados.length === 0 && (
              <p className="type-body text-muted-foreground text-center py-8 bg-muted/30 rounded-xl">
                Próximamente más información, noticias y reseñas sobre este modelo.
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ModeloDetail;
