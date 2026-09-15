import { AdminShell } from "@/components/admin/AdminShell";
import type { NewsArticle } from "@/components/news/NewsCard";
import { NewsEditorDialog } from "@/components/news/NewsEditorDialog";
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
import { getModeloPath } from "@/lib/marcas";
import type { NewsInput } from "@/lib/news-api";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function AdminModeloHistorialInner() {
  const { marcaId, modeloId } = useParams<{ marcaId: string; modeloId: string }>();
  const { data: news = [], isLoading } = useNews();
  const { create, update, remove } = useNewsMutations();

  const marca = MARCAS.find((m) => m.id === marcaId);
  const modelo = marca?.modelos.find((m) => m.id === modeloId);

  const historial = useMemo(
    () =>
      news.filter((n) => n.marcaId === marcaId && n.modeloId === modeloId),
    [news, marcaId, modeloId],
  );

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");
  const [pendingDelete, setPendingDelete] = useState<NewsArticle | null>(null);

  if (!marcaId || !modeloId) return <Navigate to="/admin/modelos" replace />;
  if (!marca || !modelo) return <Navigate to="/admin/modelos" replace />;

  const handleSubmit = async (input: NewsInput) => {
    const tied = {
      ...input,
      marca_id: marca.id,
      modelo_id: modelo.id,
    };
    if (editing) {
      await update.mutateAsync({ id: editing.id, patch: tied });
      toast.success("Noticia actualizada.");
    } else {
      await create.mutateAsync({ ...tied, published: true });
      toast.success("Publicada en el radar y en esta ficha.");
    }
  };

  return (
    <>
      <Link
        to="/admin/modelos"
        className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Todos los modelos
      </Link>

      <h1 className="type-h1 text-foreground">
        {marca.nombre} {modelo.nombre}
      </h1>
      <p className="type-body text-muted-foreground mt-3 max-w-2xl">
        Historial de esta ficha. Quitar del radar deja la nota acá. Borrar la saca de la
        ficha pública también.
      </p>
      <p className="mt-2">
        <Link
          to={getModeloPath(marca, modelo)}
          className="type-meta underline underline-offset-4"
        >
          Ver ficha pública
        </Link>
      </p>

      <div className="rounded-xl border border-border p-4 mt-8 space-y-3">
        <p className="type-h3 text-foreground">Agregar nota a este modelo</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={pasteUrl}
            onChange={(e) => setPasteUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1 h-10 rounded-lg border border-input bg-background px-3 type-body-sm"
          />
          <Button
            type="button"
            onClick={() => {
              if (!pasteUrl.trim()) {
                toast.error("Pegá el link de la nota.");
                return;
              }
              setEditing(null);
              setEditorOpen(true);
            }}
          >
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

      {!isLoading && historial.length === 0 && (
        <p className="type-body text-muted-foreground mt-10">Este modelo todavía no tiene notas.</p>
      )}

      <ul className="mt-8 space-y-3">
        {historial.map((article) => (
          <li key={article.id} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex gap-4">
              <div className="w-24 shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-muted">
                <img src={article.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="type-meta text-muted-foreground">
                  {article.published === false ? "Solo historial" : "En el radar"}
                </p>
                <h2 className="type-h3 text-foreground mt-1">{article.title}</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
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
              {article.published === false ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    update.mutate(
                      { id: article.id, patch: { published: true } },
                      {
                        onSuccess: () => toast.success("Volvió al radar."),
                        onError: (err) =>
                          toast.error(err instanceof Error ? err.message : "No se pudo publicar."),
                      },
                    )
                  }
                >
                  Volver al radar
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    update.mutate(
                      { id: article.id, patch: { published: false } },
                      {
                        onSuccess: () => toast.success("Se quitó del radar. Sigue en este historial."),
                        onError: (err) =>
                          toast.error(err instanceof Error ? err.message : "No se pudo quitar."),
                      },
                    )
                  }
                >
                  Quitar del radar
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => setPendingDelete(article)}
              >
                Borrar de la ficha
              </Button>
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
        initialMarcaId={marca.id}
        initialModeloId={modelo.id}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Borrar de la ficha?</AlertDialogTitle>
            <AlertDialogDescription>
              Se elimina para siempre. Sirve cuando hay demasiadas notas en el modelo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                const { id } = pendingDelete;
                setPendingDelete(null);
                remove.mutate(id, {
                  onSuccess: () => toast.success("Eliminada de la ficha."),
                  onError: (err) =>
                    toast.error(err instanceof Error ? err.message : "No se pudo borrar."),
                });
              }}
            >
              Borrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const AdminModeloHistorial = () => (
  <AdminShell>
    <AdminModeloHistorialInner />
  </AdminShell>
);

export default AdminModeloHistorial;
