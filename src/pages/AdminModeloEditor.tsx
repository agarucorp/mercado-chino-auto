import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MARCAS } from "@/data/marcas";
import type { FichaTecnicaRow } from "@/data/modelo-media";
import { getFichaTecnica, getModeloImages } from "@/data/modelo-media";
import { useCatalogSnapshot } from "@/hooks/useModelCatalog";
import {
  blankFicha,
  findAdminModelo,
  nextModeloId,
  resolveSummary,
  takenModeloIds,
} from "@/lib/model-catalog";
import {
  resetModelProfile,
  saveModelProfile,
  uploadModelImage,
} from "@/lib/model-catalog-api";
import { getModeloPath } from "@/lib/marcas";
import type { EstadoModelo } from "@/types/marcas";
import { ArrowDown, ArrowLeft, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface FichaDraft extends FichaTecnicaRow {
  key: string;
}

interface EditorForm {
  modeloId: string;
  marcaId: string;
  nombre: string;
  estado: EstadoModelo;
  summary: string;
  ficha: FichaDraft[];
  images: string[];
  custom: boolean;
}

function draftFicha(rows: FichaTecnicaRow[]): FichaDraft[] {
  return rows.map((row) => ({ key: crypto.randomUUID(), label: row.label, value: row.value }));
}

function AdminModeloEditorInner() {
  const { marcaId, modeloId } = useParams<{ marcaId: string; modeloId: string }>();
  const creating = !modeloId;
  const catalog = useCatalogSnapshot();
  const navigate = useNavigate();
  const marcas = useMemo(
    () => [...MARCAS].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [],
  );
  const [form, setForm] = useState<EditorForm | null>(null);
  const [missing, setMissing] = useState(false);
  const loadedFor = useRef<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!catalog.ready) return;
    const token = creating ? "nuevo" : `${marcaId ?? ""}/${modeloId ?? ""}`;
    if (loadedFor.current === token) return;
    loadedFor.current = token;

    if (creating) {
      const first = marcas[0]?.id ?? "";
      setMissing(false);
      setForm({
        modeloId: "",
        marcaId: first,
        nombre: "",
        estado: "Vigente",
        summary: "",
        ficha: draftFicha(blankFicha()),
        images: [],
        custom: true,
      });
      return;
    }
    if (!marcaId || !modeloId) {
      setMissing(true);
      return;
    }
    const found = findAdminModelo(marcaId, modeloId);
    if (!found) {
      setMissing(true);
      return;
    }
    const custom = !MARCAS.some((marca) => marca.modelos.some((modelo) => modelo.id === found.modelo.id));
    setMissing(false);
    setForm({
      modeloId: found.modelo.id,
      marcaId: found.marca.id,
      nombre: found.modelo.nombre,
      estado: found.modelo.estado,
      summary: found.profile?.summary ?? resolveSummary(found.modelo.id),
      ficha: draftFicha(found.profile?.ficha ?? getFichaTecnica(found.modelo.id)),
      images: [...(found.profile?.images ?? getModeloImages(found.modelo.id))],
      custom,
    });
  }, [catalog.ready, creating, marcaId, modeloId, marcas]);

  if (!catalog.ready || (!form && !missing)) {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        <span className="type-body">Cargando modelo…</span>
      </div>
    );
  }

  if (missing || !form) return <Navigate to="/admin/modelos" replace />;

  const marca = marcas.find((item) => item.id === form.marcaId) ?? marcas[0];
  const publicPath =
    marca && form.modeloId
      ? getModeloPath(marca, {
          id: form.modeloId,
          nombre: form.nombre,
          estado: form.estado,
          marcaId: form.marcaId,
        })
      : null;

  const updateRow = (index: number, patch: Partial<FichaDraft>) => {
    setForm((prev) => {
      if (!prev) return prev;
      const ficha = prev.ficha.map((row, i) => (i === index ? { ...row, ...patch } : row));
      return { ...prev, ficha };
    });
  };

  const moveRow = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      if (!prev) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.ficha.length) return prev;
      const ficha = [...prev.ficha];
      const [row] = ficha.splice(index, 1);
      ficha.splice(target, 0, row);
      return { ...prev, ficha };
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      if (!prev) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.images.length) return prev;
      const images = [...prev.images];
      const [image] = images.splice(index, 1);
      images.splice(target, 0, image);
      return { ...prev, images };
    });
  };

  const onFiles = async (list: FileList | null) => {
    if (!list?.length || !form) return;
    setUploading(true);
    try {
      const folder = form.modeloId || `nuevo-${form.marcaId}`;
      const urls: string[] = [];
      for (const file of Array.from(list)) {
        urls.push(await uploadModelImage(folder, file));
      }
      setForm((prev) => (prev ? { ...prev, images: [...prev.images, ...urls] } : prev));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    if (!form.marcaId) {
      toast.error("Elegí una marca.");
      return;
    }
    setSaving(true);
    try {
      const id = creating ? nextModeloId(form.marcaId, form.nombre, takenModeloIds()) : form.modeloId;
      const ficha = form.ficha
        .map((row) => ({ label: row.label.trim(), value: row.value.trim() }))
        .filter((row) => row.label || row.value);
      await saveModelProfile({
        modeloId: id,
        marcaId: form.marcaId,
        nombre: form.nombre,
        estado: form.estado,
        summary: form.summary,
        ficha,
        images: form.images,
        custom: creating || form.custom,
      });
      toast.success(creating ? "Modelo agregado." : "Modelo actualizado.");
      if (creating) navigate(`/admin/modelos/${form.marcaId}/${id}/editar`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const resetOriginal = async () => {
    if (!form.modeloId || form.custom) return;
    setSaving(true);
    try {
      await resetModelProfile(form.modeloId);
      const found = findAdminModelo(form.marcaId, form.modeloId);
      setForm({
        ...form,
        nombre: found?.modelo.nombre ?? form.nombre,
        estado: found?.modelo.estado ?? form.estado,
        summary: "",
        ficha: draftFicha(getFichaTecnica(form.modeloId)),
        images: [...getModeloImages(form.modeloId)],
        custom: false,
      });
      toast.success("Volvió la ficha original del catálogo.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo restaurar.");
      setSaving(false);
    }
  };

  return (
    <>
      <Link
        to="/admin/modelos"
        className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Modelos
      </Link>

      <h1 className="type-h1 text-foreground">{creating ? "Nuevo modelo" : form.nombre}</h1>
      <p className="type-body text-muted-foreground mt-3 max-w-2xl">
        El nombre, el estado, el texto, la ficha y las fotos de esta pantalla son los que ve el sitio.
        La dirección pública no cambia al renombrar un modelo que ya existía.
      </p>
      {catalog.error && (
        <p className="mt-4 type-body-sm text-destructive">{catalog.error}</p>
      )}

      <div className="mt-8 space-y-8 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="model-marca">Marca</Label>
            <select
              id="model-marca"
              className={selectClassName}
              value={form.marcaId}
              disabled={!creating}
              onChange={(event) => setForm({ ...form, marcaId: event.target.value })}
            >
              {marcas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model-estado">Estado</Label>
            <select
              id="model-estado"
              className={selectClassName}
              value={form.estado}
              onChange={(event) =>
                setForm({ ...form, estado: event.target.value as EstadoModelo })
              }
            >
              <option value="Vigente">Vigente</option>
              <option value="Discontinuado">Discontinuado</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model-nombre">Nombre</Label>
          <Input
            id="model-nombre"
            value={form.nombre}
            onChange={(event) => setForm({ ...form, nombre: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model-summary">Información general</Label>
          <Textarea
            id="model-summary"
            value={form.summary}
            onChange={(event) => setForm({ ...form, summary: event.target.value })}
            rows={4}
          />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="type-h3 text-foreground">Ficha técnica</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setForm({ ...form, ficha: [...form.ficha, { key: crypto.randomUUID(), label: "", value: "" }] })
              }
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden />
              Agregar dato
            </Button>
          </div>
          <p className="type-meta text-muted-foreground">
            Si un dato cambia según la versión, escribilo así: Naftero: 147 CV · Híbrido: 120 CV.
          </p>
          <ul className="space-y-3">
            {form.ficha.map((row, index) => (
              <li key={row.key} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] items-center">
                <Input
                  aria-label={`Dato ${index + 1}`}
                  value={row.label}
                  onChange={(event) => updateRow(index, { label: event.target.value })}
                />
                <Input
                  aria-label={`Valor ${index + 1}`}
                  value={row.value}
                  onChange={(event) => updateRow(index, { value: event.target.value })}
                />
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" aria-label="Subir dato" onClick={() => moveRow(index, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Bajar dato" onClick={() => moveRow(index, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Quitar dato"
                    onClick={() =>
                      setForm({ ...form, ficha: form.ficha.filter((_, i) => i !== index) })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="type-h3 text-foreground">Fotos</h2>
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                aria-label="Subir fotos"
                disabled={uploading}
                onChange={(event) => {
                  void onFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <span className="inline-flex h-10 cursor-pointer items-center rounded-md border border-input px-4 type-body-sm">
                {uploading ? "Subiendo…" : "Subir fotos"}
              </span>
            </label>
          </div>
          {form.images.length === 0 && (
            <p className="type-body-sm text-muted-foreground">Sin fotos propias. El sitio usa la imagen de respaldo.</p>
          )}
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {form.images.map((src, index) => (
              <li key={`${src}-${index}`} className="space-y-2">
                <img src={src} alt="" className="aspect-[16/10] w-full rounded-lg object-cover bg-muted" />
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" aria-label="Subir foto" onClick={() => moveImage(index, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Bajar foto" onClick={() => moveImage(index, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Quitar foto"
                    onClick={() =>
                      setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button type="button" id="model-save" onClick={() => void save()} disabled={saving || uploading}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
          {!creating && !form.custom && (
            <Button type="button" variant="outline" onClick={() => void resetOriginal()} disabled={saving}>
              Usar la ficha original
            </Button>
          )}
          {publicPath && (
            <Button type="button" variant="ghost" asChild>
              <Link to={publicPath}>Ver ficha pública</Link>
            </Button>
          )}
          {!creating && marcaId && modeloId && (
            <Button type="button" variant="ghost" asChild>
              <Link to={`/admin/modelos/${marcaId}/${modeloId}`}>Historial de notas</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

const AdminModeloEditor = () => (
  <AdminShell>
    <AdminModeloEditorInner />
  </AdminShell>
);

export default AdminModeloEditor;
