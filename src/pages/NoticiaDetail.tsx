import { Layout } from "@/components/layout/Layout";
import { useCatalogSnapshot } from "@/hooks/useModelCatalog";
import { NEWS_DATA } from "@/data/news";
import { useNews } from "@/hooks/useNews";
import { fetchNewsById } from "@/lib/news-api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getModeloPath } from "@/lib/marcas";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

const NoticiaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const catalog = useCatalogSnapshot();
  const { data: list = [] } = useNews();

  const cached = list.find((n) => n.id === id);
  const { data: fetched, isLoading } = useQuery({
    queryKey: ["news", id],
    enabled: Boolean(id) && !cached && isSupabaseConfigured,
    queryFn: () => fetchNewsById(id as string),
  });

  const article =
    cached ?? fetched ?? NEWS_DATA.find((n) => n.id === id) ?? null;

  if (!id) return <Navigate to="/noticias" replace />;

  if (!article && isLoading) {
    return (
      <Layout>
        <p className="type-body text-muted-foreground text-center py-24">Cargando nota…</p>
      </Layout>
    );
  }

  if (!article) return <Navigate to="/noticias" replace />;

  const marca = article.marcaId
    ? catalog.marcas.find((m) => m.id === article.marcaId)
    : undefined;
  const modelo = marca?.modelos.find((m) => m.id === article.modeloId);
  const body = article.body?.trim() || article.excerpt;
  const blocks = paragraphs(body);

  return (
    <Layout>
      <article className="py-8 md:py-12">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Radar de noticias
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="type-badge px-2.5 py-0.5 bg-accent text-accent-foreground rounded-full">
              {article.category}
            </span>
            {article.source && (
              <span className="type-meta text-muted-foreground">{article.source}</span>
            )}
          </div>

          <h1 className="type-h1 text-foreground">{article.title}</h1>

          <div className="flex items-center gap-2 type-meta text-muted-foreground mt-4">
            <Calendar className="w-4 h-4 shrink-0" />
            <time dateTime={article.sortDate}>{article.date}</time>
          </div>

          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
            <img
              src={article.image}
              alt={article.imageAlt || article.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-8 space-y-4">
            {blocks.map((p) => (
              <p key={p.slice(0, 48)} className="type-body text-foreground">
                {p}
              </p>
            ))}
          </div>

          {article.sourceUrl && (
            <p className="mt-8">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 type-meta text-foreground underline underline-offset-4 hover:text-primary"
              >
                Ver la nota original
                <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            </p>
          )}

          {marca && (
            <p className="type-meta text-muted-foreground mt-10">
              Relacionado:{" "}
              <Link to={`/marcas/${marca.slug}`} className="underline underline-offset-4">
                {marca.nombre}
              </Link>
              {modelo && (
                <>
                  {" · "}
                  <Link
                    to={getModeloPath(marca, modelo)}
                    className="underline underline-offset-4"
                  >
                    {modelo.nombre}
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default NoticiaDetail;
