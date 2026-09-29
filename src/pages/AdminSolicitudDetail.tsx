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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MARCAS } from "@/data/marcas";
import { useAuth } from "@/hooks/useAuth";
import {
  ADMIN_LISTINGS_KEY,
  APPROVED_LISTINGS_KEY,
  useAdminListing,
} from "@/hooks/useListings";
import {
  buildListingReviewPatch,
  getSolicitudFormIssues,
  markSolicitudSeen,
  type SolicitudForm,
} from "@/lib/admin-solicitudes";
import {
  FUEL_OPTIONS,
  PROVINCE_OPTIONS,
  PUBLISH_PLANS,
  TRANSMISSION_OPTIONS,
} from "@/lib/listing-draft";
import {
  addListingImage,
  deleteListing,
  deleteListingImage,
  reorderListingImages,
  reviewListing,
  type AdminListing,
  type AdminListingImage,
} from "@/lib/listings-api";
import type { ListingStatus } from "@/types/database";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => String(2026 - i));
const MARCAS_ORDENADAS = [...MARCAS].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es"),
);

function normalizeTransmission(value: string): string {
  if (value === "CVT" || value === "DCT" || value === "Automático") return "Automática";
  return value;
}

function formFromListing(listing: AdminListing): SolicitudForm {
  return {
    title: listing.title,
    version: listing.version ?? "",
    marcaId: listing.marcaId,
    modeloId: listing.modeloId ?? "",
    year: String(listing.year),
    km: String(listing.km),
    price: String(listing.price),
    currency: listing.currency ?? "ARS",
    fuel: listing.fuel,
    transmission: normalizeTransmission(listing.transmission),
    location: listing.location,
    province: listing.province,
    description: listing.description,
    plan: listing.plan ?? "basico",
    sellerName: listing.seller.name,
    sellerEmail: listing.sellerEmail ?? "",
    sellerPhone: listing.sellerPhone ?? "",
    sellerType: listing.seller.type,
    adminNotes: listing.adminNotes ?? "",
  };
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function AdminSolicitudDetailInner() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: listing, isLoading, isError, error } = useAdminListing(id);
  const [form, setForm] = useState<SolicitudForm | null>(null);
  const [busy, setBusy] = useState<ListingStatus | "guardando" | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhotoId, setRemovingPhotoId] = useState<string | null>(null);
  const [reorderingPhotoId, setReorderingPhotoId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const invalidateListing = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [...ADMIN_LISTINGS_KEY, id] }),
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEY }),
    ]);

  const handleAddPhotos = async (files: FileList | null) => {
    if (!files?.length || !id) return;
    setUploadingPhoto(true);
    try {
      for (const file of Array.from(files)) {
        try {
          await addListingImage(id, file);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : `No se pudo subir ${file.name}.`);
        }
      }
      await invalidateListing();
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async (image: { id: string; storagePath: string }) => {
    setRemovingPhotoId(image.id);
    try {
      await deleteListingImage(image);
      await invalidateListing();
      toast.success("Foto eliminada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo borrar la foto.");
    } finally {
      setRemovingPhotoId(null);
    }
  };

  const handleMovePhoto = async (photos: AdminListingImage[], index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const a = photos[index];
    const b = photos[target];
    setReorderingPhotoId(a.id);
    try {
      await reorderListingImages([
        { id: a.id, position: b.position },
        { id: b.id, position: a.position },
      ]);
      await invalidateListing();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo reordenar las fotos.");
    } finally {
      setReorderingPhotoId(null);
    }
  };

  const handleDeleteListing = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteListing(id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEY }),
        queryClient.invalidateQueries({ queryKey: APPROVED_LISTINGS_KEY }),
      ]);
      toast.success("Publicación eliminada.");
      navigate("/admin/solicitudes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar la publicación.");
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (id) markSolicitudSeen(id);
  }, [id]);

  useEffect(() => {
    if (listing) setForm(formFromListing(listing));
  }, [listing]);

  const modelos = useMemo(() => {
    const marca = MARCAS.find((m) => m.id === form?.marcaId);
    return marca?.modelos ?? [];
  }, [form?.marcaId]);

  const fuelOptions = useMemo(() => {
    if (form?.fuel && !FUEL_OPTIONS.includes(form.fuel)) {
      return [form.fuel, ...FUEL_OPTIONS];
    }
    return FUEL_OPTIONS;
  }, [form?.fuel]);

  const provinceOptions = useMemo(() => {
    if (form?.province && !PROVINCE_OPTIONS.includes(form.province)) {
      return [form.province, ...PROVINCE_OPTIONS];
    }
    return PROVINCE_OPTIONS;
  }, [form?.province]);

  const update = (patch: Partial<SolicitudForm>) => {
    setForm((current) => (current ? { ...current, ...patch } : current));
  };

  const persist = async (status: ListingStatus, busyKey: ListingStatus | "guardando") => {
    if (!listing || !form || !user) return;
    if (status === "aprobada") {
      const issues = getSolicitudFormIssues(form);
      if (issues.length) {
        toast.error(issues[0]);
        return;
      }
    }

    setBusy(busyKey);
    try {
      await reviewListing({
        id: listing.id,
        status,
        adminNotes: form.adminNotes,
        reviewerId: user.id,
        patch: buildListingReviewPatch(form),
        bumpPublishedAt: status === "aprobada" && listing.status !== "aprobada",
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEY }),
        queryClient.invalidateQueries({ queryKey: APPROVED_LISTINGS_KEY }),
        queryClient.invalidateQueries({ queryKey: ["listings", listing.id] }),
      ]);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar la revisión.");
      return false;
    } finally {
      setBusy(null);
    }
  };

  const approve = async () => {
    if (!(await persist("aprobada", "aprobada"))) return;
    toast.success("La solicitud se publicó en clasificados.");
    navigate(`/clasificados/${listing!.id}`);
  };

  const reject = async () => {
    if (!(await persist("rechazada", "rechazada"))) return;
    toast.message("Solicitud rechazada.");
    navigate("/admin/solicitudes");
  };

  const archive = async () => {
    if (!(await persist("archivada", "archivada"))) return;
    toast.success("Se quitó de clasificados. Podés volver a publicarla cuando quieras.");
  };

  const saveChanges = async () => {
    if (!listing) return;
    if (!(await persist(listing.status, "guardando"))) return;
    toast.success("Cambios guardados.");
  };

  if (isLoading || (listing && !form)) {
    return (
      <div className="flex items-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        Cargando solicitud…
      </div>
    );
  }

  if (isError || !listing || !form) {
    return (
      <p role="alert" className="type-body text-muted-foreground py-16">
        {error instanceof Error ? error.message : "No encontramos esa solicitud."}
      </p>
    );
  }

  const pendiente = listing.status === "pendiente";
  const submitted = listing.submittedAt
    ? new Date(listing.submittedAt).toLocaleString("es-AR")
    : null;

  return (
    <>
      <p className="type-meta text-muted-foreground">
        <Link to="/admin/solicitudes" className="underline underline-offset-4">
          Solicitudes
        </Link>
        {" · "}
        {listing.status}
      </p>
      <h1 className="type-h1 text-foreground mt-2">{listing.title}</h1>
      {submitted && (
        <p className="type-meta text-muted-foreground mt-2">Enviada el {submitted}</p>
      )}

      {pendiente && (
        <p className="mt-6 rounded-xl border border-amber-500/50 bg-amber-50 px-4 py-3 type-body-sm text-amber-950">
          Revisá o completá los datos y aprobá para crear el aviso en clasificados.
        </p>
      )}
      {listing.status === "archivada" && (
        <p className="mt-6 rounded-xl border border-border bg-muted/40 px-4 py-3 type-body-sm text-foreground">
          Este aviso está quitado de clasificados. No se ve en el sitio hasta que lo vuelvas a
          publicar.
        </p>
      )}

      <div className="mt-8 space-y-3">
        <Label>Fotos ({listing.imageRecords?.length ?? listing.images.length})</Label>
        <p className="type-meta text-muted-foreground">
          La primera es la portada. Usá las flechas para cambiar el orden.
        </p>
        {(listing.imageRecords?.length ?? 0) > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {listing.imageRecords!.map((img, index, photos) => (
              <div
                key={img.id}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted border border-border"
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 type-meta rounded-full bg-foreground/85 text-background px-2 py-0.5">
                    Portada
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void handleRemovePhoto(img)}
                  disabled={removingPhotoId === img.id}
                  className="absolute right-2 top-2 rounded-full bg-background/90 border border-border p-1.5 text-muted-foreground hover:text-destructive disabled:opacity-50"
                  aria-label="Quitar foto"
                >
                  {removingPhotoId === img.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  ) : (
                    <X className="h-3.5 w-3.5" aria-hidden />
                  )}
                </button>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => void handleMovePhoto(photos, index, -1)}
                    disabled={index === 0 || reorderingPhotoId !== null}
                    className="rounded-full bg-background/90 border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Mover antes"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleMovePhoto(photos, index, 1)}
                    disabled={index === photos.length - 1 || reorderingPhotoId !== null}
                    className="rounded-full bg-background/90 border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Mover después"
                  >
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 type-body-sm cursor-pointer hover:border-foreground/40">
          {uploadingPhoto ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
          {uploadingPhoto ? "Subiendo…" : "Sumar fotos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={uploadingPhoto}
            onChange={(e) => {
              void handleAddPhotos(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <form className="mt-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
        <section className="grid gap-4 sm:grid-cols-2">
          <Field id="sol-title" label="Título">
            <Input
              id="sol-title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </Field>
          <Field id="sol-version" label="Versión">
            <Input
              id="sol-version"
              value={form.version}
              onChange={(e) => update({ version: e.target.value })}
            />
          </Field>
          <Field id="sol-marca" label="Marca">
            <Select
              value={form.marcaId}
              onValueChange={(marcaId) => update({ marcaId, modeloId: "" })}
            >
              <SelectTrigger id="sol-marca">
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
          <Field id="sol-modelo" label="Modelo">
            <Select
              value={form.modeloId}
              onValueChange={(modeloId) => update({ modeloId })}
              disabled={!form.marcaId}
            >
              <SelectTrigger id="sol-modelo">
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
          <Field id="sol-year" label="Año">
            <Select value={form.year} onValueChange={(year) => update({ year })}>
              <SelectTrigger id="sol-year">
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
          <Field id="sol-km" label="Kilometraje">
            <Input
              id="sol-km"
              inputMode="numeric"
              value={form.km}
              onChange={(e) => update({ km: e.target.value.replace(/\D/g, "") })}
            />
          </Field>
          <Field id="sol-price" label="Precio">
            <div className="flex gap-2">
              <Select
                value={form.currency}
                onValueChange={(currency) => update({ currency: currency as "ARS" | "USD" })}
              >
                <SelectTrigger className="w-24" aria-label="Moneda">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="sol-price"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => update({ price: e.target.value.replace(/[^\d.]/g, "") })}
              />
            </div>
          </Field>
          <Field id="sol-plan" label="Plan">
            <Select
              value={form.plan}
              onValueChange={(plan) => update({ plan: plan as SolicitudForm["plan"] })}
            >
              <SelectTrigger id="sol-plan">
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
          <Field id="sol-fuel" label="Combustible">
            <Select value={form.fuel} onValueChange={(fuel) => update({ fuel })}>
              <SelectTrigger id="sol-fuel">
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
          <Field id="sol-transmission" label="Transmisión">
            <Select
              value={form.transmission}
              onValueChange={(transmission) => update({ transmission })}
            >
              <SelectTrigger id="sol-transmission">
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
          <Field id="sol-location" label="Localidad">
            <Input
              id="sol-location"
              value={form.location}
              onChange={(e) => update({ location: e.target.value })}
            />
          </Field>
          <Field id="sol-province" label="Provincia">
            <Select value={form.province} onValueChange={(province) => update({ province })}>
              <SelectTrigger id="sol-province">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {provinceOptions.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </section>

        <Field id="sol-description" label="Descripción">
          <Textarea
            id="sol-description"
            rows={6}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
          />
        </Field>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field id="sol-seller-type" label="Publica como">
            <Select
              value={form.sellerType}
              onValueChange={(sellerType) =>
                update({ sellerType: sellerType as SolicitudForm["sellerType"] })
              }
            >
              <SelectTrigger id="sol-seller-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="particular">Particular</SelectItem>
                <SelectItem value="concesionario">Concesionario</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field id="sol-seller-name" label="Nombre / agencia">
            <Input
              id="sol-seller-name"
              value={form.sellerName}
              onChange={(e) => update({ sellerName: e.target.value })}
            />
          </Field>
          <Field id="sol-seller-email" label="Email">
            <Input
              id="sol-seller-email"
              type="email"
              value={form.sellerEmail}
              onChange={(e) => update({ sellerEmail: e.target.value })}
            />
          </Field>
          <Field id="sol-seller-phone" label="Teléfono">
            <Input
              id="sol-seller-phone"
              value={form.sellerPhone}
              onChange={(e) => update({ sellerPhone: e.target.value })}
            />
          </Field>
        </section>

        <Field id="sol-notes" label="Notas internas / datos extra del admin">
          <Textarea
            id="sol-notes"
            rows={4}
            value={form.adminNotes}
            onChange={(e) => update({ adminNotes: e.target.value })}
            placeholder="Observaciones, correcciones o info que quieras dejar registrada."
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          {listing.status === "aprobada" && (
            <Button asChild variant="outline">
              <Link to={`/clasificados/${listing.id}`}>Ver en clasificados</Link>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            disabled={busy !== null}
            onClick={() => void saveChanges()}
          >
            {busy === "guardando" && <Loader2 className="animate-spin" aria-hidden />}
            Guardar cambios
          </Button>

          {(pendiente || listing.status === "rechazada" || listing.status === "archivada") && (
            <Button type="button" disabled={busy !== null} onClick={() => void approve()}>
              {busy === "aprobada" && <Loader2 className="animate-spin" aria-hidden />}
              {listing.status === "archivada" ? "Volver a publicar" : "Aprobar y publicar"}
            </Button>
          )}
          {pendiente && (
            <Button
              type="button"
              variant="destructive"
              disabled={busy !== null}
              onClick={() => void reject()}
            >
              {busy === "rechazada" && <Loader2 className="animate-spin" aria-hidden />}
              Rechazar
            </Button>
          )}
          {listing.status === "aprobada" && (
            <Button
              type="button"
              variant="destructive"
              disabled={busy !== null}
              onClick={() => void archive()}
            >
              {busy === "archivada" && <Loader2 className="animate-spin" aria-hidden />}
              Quitar de clasificados
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive"
            disabled={busy !== null || deleting}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Eliminar publicación
          </Button>
        </div>
      </form>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta publicación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borra para siempre, junto con sus fotos. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDeleteListing();
              }}
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const AdminSolicitudDetail = () => (
  <AdminShell>
    <AdminSolicitudDetailInner />
  </AdminShell>
);

export default AdminSolicitudDetail;
