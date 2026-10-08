import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PROVIDER_CATEGORIES,
  createProvider,
  deleteProvider,
  listProviders,
  updateProvider,
  type ProviderInput,
} from "@/lib/providers-api";
import type { ProviderCategory, ServiceProviderRow } from "@/types/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY: ProviderInput = {
  category: "estetico",
  name: "",
  city: "",
  phone: "",
  description: "",
  published: true,
};

function AdminRepuestosInner() {
  const queryClient = useQueryClient();
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["service-providers", "admin"],
    queryFn: () => listProviders(false),
  });
  const [form, setForm] = useState<ProviderInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["service-providers"] });

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setBusy(true);
    try {
      if (editingId) await updateProvider(editingId, form);
      else await createProvider(form);
      setForm(EMPTY);
      setEditingId(null);
      await refresh();
      toast.success(editingId ? "Proveedor actualizado" : "Proveedor publicado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  };

  const edit = (row: ServiceProviderRow) => {
    setEditingId(row.id);
    setForm({
      category: row.category,
      name: row.name,
      city: row.city,
      phone: row.phone,
      description: row.description,
      published: row.published,
    });
  };

  const remove = async (id: string) => {
    setBusy(true);
    try {
      await deleteProvider(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY);
      }
      await refresh();
      toast.success("Proveedor eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="type-h2 text-foreground">Repuestos y talleres</h1>
        <p className="type-body-sm text-muted-foreground mt-1">
          Lo que publiques acá aparece en la sección pública, dentro de la categoría elegida.
        </p>
      </div>

      <div className="grid gap-4 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="prov-cat">Categoría</Label>
          <select
            id="prov-cat"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ProviderCategory })}
          >
            {PROVIDER_CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="prov-name">Nombre</Label>
          <Input id="prov-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prov-city">Ciudad</Label>
          <Input id="prov-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prov-phone">Teléfono</Label>
          <Input id="prov-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prov-desc">Descripción</Label>
          <Textarea
            id="prov-desc"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 type-body-sm">
          <Checkbox
            checked={form.published}
            onCheckedChange={(checked) => setForm({ ...form, published: checked === true })}
          />
          Publicado
        </label>
        <div className="flex gap-2">
          <Button type="button" disabled={busy} onClick={() => void save()}>
            {busy && <Loader2 className="animate-spin" />}
            {editingId ? "Guardar cambios" : "Publicar"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
      {isError && (
        <p className="type-body-sm text-muted-foreground">
          {error instanceof Error ? error.message : "No se pudo cargar el listado."}
        </p>
      )}
      <ul className="space-y-3">
        {data.map((row) => (
          <li key={row.id} className="rounded-lg border border-border p-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="type-body font-medium">{row.name}</p>
              <p className="type-meta text-muted-foreground">
                {PROVIDER_CATEGORIES.find((item) => item.id === row.category)?.label}
                {row.published ? "" : " · oculto"}
                {row.city ? ` · ${row.city}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => edit(row)}>
                Editar
              </Button>
              <Button type="button" variant="destructive" size="sm" disabled={busy} onClick={() => void remove(row.id)}>
                Borrar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const AdminRepuestos = () => (
  <AdminShell>
    <AdminRepuestosInner />
  </AdminShell>
);

export default AdminRepuestos;
