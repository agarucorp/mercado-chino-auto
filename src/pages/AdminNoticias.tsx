import { AdminShell } from "@/components/admin/AdminShell";
import { NewsEditorDialog } from "@/components/news/NewsEditorDialog";
import type { NewsArticle } from "@/components/news/NewsCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MARCAS } from "@/data/marcas";
import { useNews, useNewsMutations } from "@/hooks/useNews";
import type { NewsInput } from "@/lib/news-api";
import { isBrandWideNews, isGeneralNews } from "@/lib/news-placement";
import { Loader2, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function modeloLabel(article: NewsArticle): string {
  if (isGeneralNews(article)) return "No aplica";
  const marca = MARCAS.find((m) => m.id === article.marcaId);
  if (!marca) return "Marca";
  if (isBrandWideNews(article)) return `${marca.nombre} · Todos los modelos`;
  const modelo = marca.modelos.find((m) => m.id === article.modeloId);
  return modelo ? `${marca.nombre} ${modelo.nombre}` : marca.nombre;
}

function AdminNoticiasInner() {
  const { data: news = [], isLoading, isError, error } = useNews();
  const { create, update, remove, makePrimary } = useNewsMutations();

  const radar = news.filter((n) => n.published !== false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");
  const [pending, setPending] = useState<NewsArticle | null>(null);

  const openNew = () => {
    if (!pasteUrl.trim()) {
      toast.error("Pegá el link de la nota.");
      return;
    }
    setEditing(null);
    setEditorOpen(true);
  };

  const handleSubmit = async (input: NewsInput) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, patch: input });
      toast.success("Noticia actualizada.");
    } else {
      await create.mutateAsync({ ...input, published: true });
      toast.success("Noticia publicada en el radar.");
    }
  };

  const handleMakePrimary = (article: NewsArticle) => {
    makePrimary.mutate(article.id, {
      onSuccess: () => toast.success("Ahora es la principal."),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "No se pudo guardar."),
    });
  };

  const confirmQuitar = () => {
    if (!pending) return;
    const article = pending;
    setPending(null);

    if (isGeneralNews(article)) {
      remove.mutate(article.id, {
        onSuccess: () => toast.success("Se borró del todo (era No aplica)."),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "No se pudo borrar."),
      });
      return;
    }

    const scope = isBrandWideNews(article)
      ? "Quedó en el historial de todos los modelos de esa marca."
      : "Quedó en el historial del modelo.";

    update.mutate(
      { id: article.id, patch: { published: false } },
      {
        onSuccess: () => toast.success(`Se quitó del radar. ${scope}`),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "No se pudo quitar."),
      },
    );
  };

  return (
    <>
      <div>
        <h1 className="type-h1 text-foreground">Noticias</h1>
        <p className="type-body text-muted-foreground mt-3 max-w-2xl">
          Esto es lo que ve la gente en el radar. Las nuevas entran primero; marcá "Principal"
          en cualquier nota para pasarla al frente. Si la nota tiene marca o modelo, al
          quitarla no se borra: pasa al historial. Si es No aplica, al quitarla se elimina.
        </p>
      </div>

      <div className="rounded-xl border border-border p-4 md:p-5 mt-8 space-y-3">
        <p className="type-h3 text-foreground">Nueva noticia</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={pasteUrl}
            onChange={(e) => setPasteUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1 h-10 rounded-lg border border-input bg-background px-3 type-body-sm"
          />
          <Button type="button" onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" aria-hidden />
            Traer y revisar
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          Cargando…
        </div>
      )}

      {isError && (
        <p role="alert" className="type-body text-muted-foreground py-16">
          {error instanceof Error ? error.message : "No se pudieron cargar las noticias."}
        </p>
      )}

      {!isLoading && !isError && radar.length === 0 && (
        <p className="type-body text-muted-foreground mt-10">Todavía no hay notas en el radar.</p>
      )}

      <ul className="mt-8 space-y-3">
        {radar.map((article, index) => (
          <li
            key={article.id}
            className="rounded-xl border border-border p-4 flex gap-4 items-start"
          >
            <div className="relative w-24 shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-muted">
              <img src={article.image} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-1 top-1 type-meta rounded-full bg-foreground/85 text-background px-1.5 py-0.5 text-[10px]">
                  Principal
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="type-meta text-muted-foreground">{modeloLabel(article)}</p>
              <h2 className="type-h3 text-foreground mt-1">{article.title}</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(article);
                    setEditorOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={index === 0 || makePrimary.isPending}
                  onClick={() => handleMakePrimary(article)}
                >
                  {makePrimary.isPending && makePrimary.variables === article.id ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" aria-hidden />
                  ) : (
                    <Star className="h-3.5 w-3.5 mr-1.5" aria-hidden />
                  )}
                  Principal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => setPending(article)}
                >
                  Quitar del radar
                </Button>
                {!isGeneralNews(article) &&
                  article.marcaId &&
                  article.modeloId && (
                    <Button type="button" size="sm" variant="ghost" asChild>
                      <Link to={`/admin/modelos/${article.marcaId}/${article.modeloId}`}>
                        Ver historial
                      </Link>
                    </Button>
                  )}
                {isBrandWideNews(article) && article.marcaId && (
                  <Button type="button" size="sm" variant="ghost" asChild>
                    <Link to="/admin/modelos">Historial (todos los modelos)</Link>
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <NewsEditorDialog
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setPasteUrl("");
        }}
        article={editing}
        onSubmit={handleSubmit}
        initialSourceUrl={editing ? "" : pasteUrl}
      />

      <AlertDialog open={Boolean(pending)} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending && isGeneralNews(pending)
                ? "¿Borrar esta noticia?"
                : "¿Quitar del radar?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending && isGeneralNews(pending)
                ? "Es No aplica: se elimina para siempre."
                : pending && isBrandWideNews(pending)
                  ? "Desaparece del listado público y queda en el historial de todos los modelos de esa marca."
                  : "Desaparece del listado público y queda en el historial del modelo."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmQuitar}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const AdminNoticias = () => (
  <AdminShell>
    <AdminNoticiasInner />
  </AdminShell>
);

export default AdminNoticias;
