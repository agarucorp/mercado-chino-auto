import { AdminShell } from "@/components/admin/AdminShell";
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
import { Input } from "@/components/ui/input";
import { useCatalogSnapshot } from "@/hooks/useModelCatalog";
import { listAdminEntries, type AdminModeloEntry } from "@/lib/model-catalog";
import { hideModel, restoreModel } from "@/lib/model-catalog-api";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function AdminModelosInner() {
  const catalog = useCatalogSnapshot();
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<AdminModeloEntry | null>(null);
  const [busy, setBusy] = useState(false);

  const entries = useMemo(() => {
    if (!catalog.ready && catalog.profiles.length === 0) return listAdminEntries();
    return listAdminEntries();
  }, [catalog]);

  const query = q.trim().toLowerCase();
  const visible = entries.filter((entry) => {
    if (!query) return true;
    return (
      entry.marca.nombre.toLowerCase().includes(query) ||
      entry.modelo.nombre.toLowerCase().includes(query)
    );
  });

  const marcas = [...new Set(visible.map((entry) => entry.marca.id))];

  const confirmRemove = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await hideModel({
        modeloId: pending.modelo.id,
        marcaId: pending.marca.id,
        nombre: pending.modelo.nombre,
        estado: pending.modelo.estado,
        custom: pending.custom,
      });
      toast.success(pending.custom ? "Modelo eliminado." : "Modelo oculto del sitio.");
      setPending(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo quitar el modelo.");
    } finally {
      setBusy(false);
    }
  };

  const restore = async (entry: AdminModeloEntry) => {
    setBusy(true);
    try {
      await restoreModel(entry.modelo.id);
      toast.success("Modelo visible de nuevo.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo restaurar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-h1 text-foreground">Modelos</h1>
          <p className="type-body text-muted-foreground mt-3 max-w-2xl">
            Editá el nombre, el estado, la información general, la ficha técnica y las fotos.
            También podés sumar un modelo nuevo o quitar uno del sitio.
          </p>
        </div>
        <Button type="button" asChild>
          <Link to="/admin/modelos/nuevo">
            <Plus className="h-4 w-4 mr-2" aria-hidden />
            Agregar modelo
          </Link>
        </Button>
      </div>

      {catalog.error && <p className="mt-4 type-body-sm text-destructive">{catalog.error}</p>}

      <Input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Buscar marca o modelo"
        className="mt-8 max-w-md"
        aria-label="Buscar marca o modelo"
      />

      <div className="mt-8 space-y-10">
        {marcas.map((marcaId) => {
          const group = visible.filter((entry) => entry.marca.id === marcaId);
          const marca = group[0]?.marca;
          if (!marca) return null;
          return (
            <section key={marca.id}>
              <h2 className="type-h2 text-foreground mb-3">{marca.nombre}</h2>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {group.map((entry) => (
                  <li
                    key={entry.modelo.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div>
                      <p className="type-body-sm text-foreground">{entry.modelo.nombre}</p>
                      <p className="type-meta text-muted-foreground">
                        {entry.modelo.estado}
                        {entry.custom ? " · Nuevo" : ""}
                        {entry.edited && !entry.custom ? " · Editado" : ""}
                        {entry.removed ? " · Oculto" : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <Link to={`/admin/modelos/${entry.marca.id}/${entry.modelo.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                      <Button type="button" variant="ghost" size="sm" asChild>
                        <Link to={`/admin/modelos/${entry.marca.id}/${entry.modelo.id}`}>Notas</Link>
                      </Button>
                      {entry.removed ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => void restore(entry)}
                        >
                          Restaurar
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => setPending(entry)}
                        >
                          Quitar
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.custom ? "Eliminar este modelo" : "Ocultar este modelo"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.custom
                ? "Se borra del sitio. Esta acción no vuelve atrás."
                : "Deja de verse en el sitio. Podés restaurarlo después."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={busy} onClick={() => void confirmRemove()}>
              {pending?.custom ? "Eliminar" : "Ocultar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const AdminModelos = () => (
  <AdminShell>
    <AdminModelosInner />
  </AdminShell>
);

export default AdminModelos;
