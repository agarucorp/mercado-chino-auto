import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_INBOX } from "@/lib/contact-api";
import { MARCAS } from "@/data/marcas";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_LISTINGS_KEY, APPROVED_LISTINGS_KEY } from "@/hooks/useListings";
import { buildListingReviewPatch, getSolicitudFormIssues, type SolicitudForm } from "@/lib/admin-solicitudes";
import {
  FUEL_OPTIONS,
  MIN_PHOTOS,
  PROVINCE_OPTIONS,
  PUBLISH_PLANS,
  TRANSMISSION_OPTIONS,
} from "@/lib/listing-draft";
import {
  createListing,
  deleteListingImageObject,
  listingImagePublicUrl,
  uploadListingImage,
} from "@/lib/listings-api";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardPaste, ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => String(2026 - i));
const MARCAS_ORDENADAS = [...MARCAS].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

/**
 * El admin carga el vehículo él mismo (sin datos del vendedor real, viene de
 * ML/otro origen), así que el email de contacto no aplica. La tabla igual
 * exige un email con formato válido, así que usamos el buzón del sitio.
 */
const EMPTY_FORM: SolicitudForm = {
  title: "",
  version: "",
  marcaId: "",
  modeloId: "",
  year: "",
  km: "",
  price: "",
  currency: "ARS",
  fuel: "",
  transmission: "",
  location: "",
  province: "",
  description: "",
  plan: "basico",
  sellerName: "",
  sellerEmail: CONTACT_INBOX,
  sellerPhone: "",
  sellerType: "particular",
  adminNotes: "",
};

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

interface UploadedImage {
  path: string;
  url: string;
}

interface NuevaPublicacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NuevaPublicacionDialog({ open, onOpenChange }: NuevaPublicacionDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<SolicitudForm>(EMPTY_FORM);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const draftId = useRef(crypto.randomUUID());

  // Cada vez que se abre, arranca en blanco con un folder de storage nuevo.
  useEffect(() => {
    if (open) {
      draftId.current = crypto.randomUUID();
      setForm(EMPTY_FORM);
      setImages([]);
    }
  }, [open]);

  const update = (patch: Partial<SolicitudForm>) => setForm((f) => ({ ...f, ...patch }));

  const modelos = useMemo(() => {
    const marca = MARCAS.find((m) => m.id === form.marcaId);
    return marca?.modelos ?? [];
  }, [form.marcaId]);

  const addFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        try {
          const path = await uploadListingImage(draftId.current, file);
          setImages((prev) => [...prev, { path, url: listingImagePublicUrl(path) }]);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : `No se pudo subir ${file.name}.`);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  // Ctrl/Cmd+V con una imagen en el portapapeles la suma directo, sin pasar
  // por el selector de archivos del sistema operativo.
  useEffect(() => {
    if (!open) return;
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length) {
        e.preventDefault();
        void addFiles(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [open]);

  const removeImage = async (image: UploadedImage) => {
    setImages((prev) => prev.filter((img) => img.path !== image.path));
    try {
      await deleteListingImageObject(image.path);
    } catch {
      // La fila nunca se llegó a crear; si falla el borrado del storage no bloquea la carga.
    }
  };

  const submit = async () => {
    if (!user) return;
    const issues = getSolicitudFormIssues(form);
    if (images.length < MIN_PHOTOS) {
      issues.push(`Subí al menos ${MIN_PHOTOS} fotos (hay ${images.length}).`);
    }
    if (issues.length) {
      toast.error(issues[0]);
      return;
    }

    setSaving(true);
    try {
      const listingId = await createListing(
        {
          ...buildListingReviewPatch(form),
          admin_notes: form.adminNotes.trim() || null,
        },
        user.id,
        images.map((img) => img.path),
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEY }),
        queryClient.invalidateQueries({ queryKey: APPROVED_LISTINGS_KEY }),
      ]);
      toast.success("Publicación creada en clasificados.");
      onOpenChange(false);
      navigate(`/clasificados/${listingId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la publicación.");
    } finally {
      setSaving(false);
    }
  };

  const fuelOptions =
    form.fuel && !FUEL_OPTIONS.includes(form.fuel) ? [form.fuel, ...FUEL_OPTIONS] : FUEL_OPTIONS;

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="type-h2">Cargar vehículo</DialogTitle>
          <DialogDescription className="type-body-sm">
            Publicá un aviso directo en clasificados, sin pasar por la cola de solicitudes. Queda
            aprobado al instante.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label>Fotos ({images.length})</Label>
            {images.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <li key={img.path} className="relative rounded-lg border border-border overflow-hidden">
                    <div className="aspect-[4/3] bg-muted">
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </div>
                    {i === 0 && (
                      <span className="absolute left-2 top-2 type-meta rounded-full bg-foreground/85 text-background px-2 py-0.5">
                        Portada
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => void removeImage(img)}
                      className="absolute right-2 top-2 rounded-full bg-background/90 border border-border p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Quitar foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 type-body-sm cursor-pointer hover:border-foreground/40">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ImagePlus className="h-4 w-4" aria-hidden />
                )}
                {uploading ? "Subiendo…" : "Sumar fotos"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    void addFiles(Array.from(e.target.files ?? []));
                    e.target.value = "";
                  }}
                />
              </label>
              <span className="inline-flex items-center gap-1.5 type-meta text-muted-foreground">
                <ClipboardPaste className="h-3.5 w-3.5" aria-hidden />
                O pegá una imagen con Ctrl+V
              </span>
            </div>
            <p className="type-meta text-muted-foreground">
              Mínimo {MIN_PHOTOS} fotos. La primera queda de portada.
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2">
            <Field id="new-title" label="Título">
              <Input id="new-title" value={form.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field id="new-version" label="Versión">
              <Input id="new-version" value={form.version} onChange={(e) => update({ version: e.target.value })} />
            </Field>
            <Field id="new-marca" label="Marca">
              <Select value={form.marcaId} onValueChange={(marcaId) => update({ marcaId, modeloId: "" })}>
                <SelectTrigger id="new-marca">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {MARCAS_ORDENADAS.map((marca) => (
                    <SelectItem key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="new-modelo" label="Modelo">
              <Select value={form.modeloId} onValueChange={(modeloId) => update({ modeloId })} disabled={!form.marcaId}>
                <SelectTrigger id="new-modelo">
                  <SelectValue placeholder="Modelo" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {modelos.map((modelo) => (
                    <SelectItem key={modelo.id} value={modelo.id}>
                      {modelo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="new-year" label="Año">
              <Select value={form.year} onValueChange={(year) => update({ year })}>
                <SelectTrigger id="new-year">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="new-km" label="Kilometraje">
              <Input
                id="new-km"
                inputMode="numeric"
                value={form.km}
                onChange={(e) => update({ km: e.target.value.replace(/\D/g, "") })}
              />
            </Field>
            <Field id="new-price" label="Precio">
              <div className="flex gap-2">
                <Select value={form.currency} onValueChange={(currency) => update({ currency: currency as "ARS" | "USD" })}>
                  <SelectTrigger className="w-24" aria-label="Moneda">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARS">ARS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="new-price"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => update({ price: e.target.value.replace(/[^\d.]/g, "") })}
                />
              </div>
            </Field>
            <Field id="new-plan" label="Plan">
              <Select value={form.plan} onValueChange={(plan) => update({ plan: plan as SolicitudForm["plan"] })}>
                <SelectTrigger id="new-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PUBLISH_PLANS.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="new-fuel" label="Combustible">
              <Select value={form.fuel} onValueChange={(fuel) => update({ fuel })}>
                <SelectTrigger id="new-fuel">
                  <SelectValue placeholder="Combustible" />
                </SelectTrigger>
                <SelectContent>
                  {fuelOptions.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="new-transmission" label="Transmisión">
              <Select value={form.transmission} onValueChange={(transmission) => update({ transmission })}>
                <SelectTrigger id="new-transmission">
                  <SelectValue placeholder="Transmisión" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="new-location" label="Localidad">
              <Input id="new-location" value={form.location} onChange={(e) => update({ location: e.target.value })} />
            </Field>
            <Field id="new-province" label="Provincia">
              <Select value={form.province} onValueChange={(province) => update({ province })}>
                <SelectTrigger id="new-province">
                  <SelectValue placeholder="Provincia" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {PROVINCE_OPTIONS.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </section>

          <Field id="new-description" label="Descripción">
            <Textarea
              id="new-description"
              rows={6}
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </Field>

          <section className="grid gap-4 sm:grid-cols-2">
            <Field id="new-seller-type" label="Publica como">
              <Select
                value={form.sellerType}
                onValueChange={(sellerType) => update({ sellerType: sellerType as SolicitudForm["sellerType"] })}
              >
                <SelectTrigger id="new-seller-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="concesionario">Concesionario</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="new-seller-name" label="Nombre / agencia">
              <Input id="new-seller-name" value={form.sellerName} onChange={(e) => update({ sellerName: e.target.value })} />
            </Field>
            <Field id="new-seller-phone" label="Teléfono">
              <Input
                id="new-seller-phone"
                value={form.sellerPhone}
                onChange={(e) => update({ sellerPhone: e.target.value })}
              />
            </Field>
          </section>

          <Field id="new-notes" label="Notas internas (opcional)">
            <Textarea
              id="new-notes"
              rows={3}
              value={form.adminNotes}
              onChange={(e) => update({ adminNotes: e.target.value })}
            />
          </Field>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button type="button" disabled={saving || uploading} onClick={() => void submit()}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />}
            Publicar en clasificados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
