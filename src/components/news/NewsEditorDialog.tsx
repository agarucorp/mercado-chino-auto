import type { NewsArticle } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MARCAS } from "@/data/marcas";
import { extractNewsFromUrl, uploadNewsImage, type NewsInput } from "@/lib/news-api";
import { ImagePlus, Loader2, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CATEGORIAS = [
  "Lanzamiento",
  "Novedad",
  "Eléctricos",
  "Industria",
  "Mercado",
  "Comparativas",
  "Pickups",
  "Política",
];

const MARCAS_ORDENADAS = [...MARCAS].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
const NINGUNA = "__ninguna__";
/** Marca elegida sin modelo concreto → aplica a todos los modelos de esa marca. */
const TODOS_MODELOS = "__todos__";

interface NewsEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: NewsArticle | null;
  onSubmit: (input: NewsInput) => Promise<void>;
  initialSourceUrl?: string;
  initialMarcaId?: string;
  initialModeloId?: string;
}

interface FormState {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  marcaId: string;
  modeloId: string;
  featured: boolean;
  published: boolean;
  date: string;
}

const EMPTY: FormState = {
  title: "",
  excerpt: "",
  body: "",
  category: "Novedad",
  imageUrl: "",
  sourceName: "",
  sourceUrl: "",
  marcaId: NINGUNA,
  modeloId: NINGUNA,
  featured: false,
  published: true,
  date: new Date().toISOString().slice(0, 10),
};

export function NewsEditorDialog({
  open,
  onOpenChange,
  article,
  onSubmit,
  initialSourceUrl = "",
  initialMarcaId,
  initialModeloId,
}: NewsEditorDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm(
      article
        ? {
            title: article.title,
            excerpt: article.excerpt,
            body: article.body ?? "",
            category: article.category,
            imageUrl: article.image?.startsWith("/placeholder") ? "" : article.image,
            sourceName: article.source ?? "",
            sourceUrl: article.sourceUrl ?? "",
            marcaId: article.marcaId ?? NINGUNA,
            modeloId: article.modeloId
              ? article.modeloId
              : article.marcaId
                ? TODOS_MODELOS
                : NINGUNA,
            featured: Boolean(article.featured),
            published: article.published !== false,
            date: article.sortDate,
          }
        : {
            ...EMPTY,
            sourceUrl: initialSourceUrl,
            marcaId: initialMarcaId ?? NINGUNA,
            modeloId: initialModeloId
              ? initialModeloId
              : initialMarcaId
                ? TODOS_MODELOS
                : NINGUNA,
          },
    );
  }, [open, article, initialSourceUrl, initialMarcaId, initialModeloId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const modelos =
    form.marcaId === NINGUNA
      ? []
      : (MARCAS_ORDENADAS.find((m) => m.id === form.marcaId)?.modelos ?? []);

  const handleExtract = async (url = form.sourceUrl.trim()) => {
    if (!url) {
      toast.error("Pegá el link de la nota.");
      return;
    }
    setExtracting(true);
    try {
      const extracted = await extractNewsFromUrl(url);
      setForm((prev) => ({
        ...prev,
        title: extracted.title || prev.title,
        excerpt: extracted.excerpt || prev.excerpt,
        body: extracted.body || prev.body,
        imageUrl: extracted.imageUrl || prev.imageUrl,
        sourceName: extracted.sourceName || prev.sourceName,
        sourceUrl: extracted.sourceUrl || url,
      }));
      toast.success("Revisá lo que se trajo y publicá.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo leer el link.");
    } finally {
      setExtracting(false);
    }
  };

  useEffect(() => {
    if (!open || article || !initialSourceUrl.trim()) return;
    void handleExtract(initialSourceUrl.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, article, initialSourceUrl]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadNewsImage(file);
      set("imageUrl", url);
      toast.success("Imagen subida.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const issues: string[] = [];
  if (form.title.trim().length < 10) issues.push("El título necesita al menos 10 caracteres");
  if (form.excerpt.trim().length < 20) issues.push("La bajada necesita al menos 20 caracteres");
  if (!form.imageUrl.trim()) issues.push("Falta la imagen de portada");
  if (form.sourceUrl.trim() && !/^https?:\/\//.test(form.sourceUrl.trim())) {
    issues.push("El link de la fuente tiene que empezar con http:// o https://");
  }
  if (form.marcaId !== NINGUNA && form.modeloId === NINGUNA) {
    issues.push("Elegí un modelo o «Todos los modelos»");
  }

  const save = async (published: boolean) => {
    if (issues.length > 0) {
      toast.error(issues[0]);
      return;
    }

    setSaving(true);
    try {
      const marcaId = form.marcaId === NINGUNA ? null : form.marcaId;
      const modeloId =
        !marcaId || form.modeloId === NINGUNA || form.modeloId === TODOS_MODELOS
          ? null
          : form.modeloId;

      await onSubmit({
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        body: form.body.trim() || form.excerpt.trim(),
        image_url: form.imageUrl.trim() || null,
        image_alt: form.title.trim(),
        category: form.category,
        source_name: form.sourceName.trim() || null,
        source_url: form.sourceUrl.trim() || null,
        marca_id: marcaId,
        modelo_id: modeloId,
        featured: form.featured,
        published,
        published_at: `${form.date}T12:00:00Z`,
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="type-h2">
            {article ? "Revisar noticia" : "Nueva noticia"}
          </DialogTitle>
          <DialogDescription className="type-body-sm">
            Pegá el link. El sitio completa título, foto y texto. Solo revisá y publicá.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-border p-4 space-y-3">
            <Label htmlFor="news-source-url">Link de la nota</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="news-source-url"
                type="url"
                value={form.sourceUrl}
                onChange={(e) => set("sourceUrl", e.target.value)}
                placeholder="https://…"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => void handleExtract()}
                disabled={extracting}
              >
                {extracting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
                ) : (
                  <Link2 className="h-4 w-4 mr-2" aria-hidden />
                )}
                {extracting ? "Leyendo…" : "Traer la nota"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="news-title">Título</Label>
            <Input
              id="news-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="news-excerpt">Bajada</Label>
            <Textarea
              id="news-excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="news-body">Texto de la nota</Label>
            <Textarea
              id="news-body"
              rows={8}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              className="min-h-[10rem] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen de portada</Label>

            {form.imageUrl && (
              <div className="rounded-lg border border-border overflow-hidden aspect-[16/9] bg-muted">
                <img
                  src={form.imageUrl}
                  alt="Vista previa de la portada"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="URL de imagen (si el link no trajo foto)"
                className="flex-1"
                aria-label="URL de la imagen"
              />

              <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 type-body-sm cursor-pointer hover:border-foreground/40 shrink-0">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ImagePlus className="h-4 w-4" aria-hidden />
                )}
                {uploading ? "Subiendo…" : "Subir archivo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    void handleUpload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="news-category">Categoría</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger id="news-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-date">Fecha</Label>
              <Input
                id="news-date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-source">Fuente (medio)</Label>
              <Input
                id="news-source"
                value={form.sourceName}
                onChange={(e) => set("sourceName", e.target.value)}
                placeholder="Se completa solo con el link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-marca">Marca</Label>
              <Select
                value={form.marcaId}
                onValueChange={(v) => {
                  set("marcaId", v);
                  set("modeloId", v === NINGUNA ? NINGUNA : TODOS_MODELOS);
                }}
              >
                <SelectTrigger id="news-marca">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-64">
                  <SelectItem value={NINGUNA}>No aplica</SelectItem>
                  {MARCAS_ORDENADAS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="news-modelo">Modelo</Label>
              <Select
                value={form.modeloId}
                onValueChange={(v) => set("modeloId", v)}
                disabled={form.marcaId === NINGUNA}
              >
                <SelectTrigger id="news-modelo" disabled={form.marcaId === NINGUNA}>
                  <SelectValue placeholder="Elegí el modelo" />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-64">
                  {form.marcaId === NINGUNA ? (
                    <SelectItem value={NINGUNA}>No aplica</SelectItem>
                  ) : (
                    <>
                      <SelectItem value={TODOS_MODELOS}>Todos los modelos</SelectItem>
                      {modelos.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nombre}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <p className="type-meta text-muted-foreground">
                Sin marca (No aplica): al quitarla del radar se borra. Con marca y «Todos los
                modelos»: queda en el historial de cada ficha de esa marca. Con un modelo
                concreto: solo en esa ficha.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <Label htmlFor="news-featured" className="cursor-pointer">
                Destacada en el listado
              </Label>
              <p className="type-meta text-muted-foreground mt-0.5">
                Le agrega una etiqueta "Destacada" en la card. El orden real lo definís
                con Subir / Bajar en la grilla.
              </p>
            </div>
            <Switch
              id="news-featured"
              checked={form.featured}
              onCheckedChange={(v) => set("featured", v)}
            />
          </div>

          {issues.length > 0 && (
            <div role="status" className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p className="type-meta text-muted-foreground">Falta completar</p>
              <ul className="mt-1.5 space-y-1">
                {issues.map((issue) => (
                  <li key={issue} className="type-body-sm text-foreground">
                    · {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void save(false)}
            disabled={saving || uploading || extracting}
          >
            Guardar oculta
          </Button>
          <Button
            type="button"
            onClick={() => void save(true)}
            disabled={saving || uploading || extracting}
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />}
            Publicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
