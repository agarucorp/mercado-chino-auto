import { PublishStepRail } from "@/components/seller/PublishStepRail";
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
import {
  EMPTY_DRAFT,
  FUEL_OPTIONS,
  MIN_DESCRIPTION_LENGTH,
  MIN_PHOTOS,
  PROVINCE_OPTIONS,
  PUBLISH_PLANS,
  PUBLISH_STEPS,
  TRANSMISSION_OPTIONS,
  clearListingDraft,
  currentStep,
  getStepIssues,
  isDraftSubmittable,
  isStepComplete,
  isStepUnlocked,
  isStepValid,
  loadListingDraft,
  markStepComplete,
  maxPhotosFor,
  saveListingDraft,
  syncCompletedSteps,
  type ListingDraft,
  type PublishPlanId,
  type PublishStepId,
} from "@/lib/listing-draft";
import {
  clearImages,
  deleteImage,
  loadImageBlobs,
  saveImages,
  screenFiles,
} from "@/lib/listing-images";
import { submitListing } from "@/lib/listings-api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Camera,
  CheckCircle2,
  Clock,
  ImagePlus,
  Lightbulb,
  Loader2,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const MARCAS_ORDENADAS = [...MARCAS].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es"),
);

const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => String(2026 - i));

function scrollToStep(step: PublishStepId) {
  document.getElementById(`publish-step-${step}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function stepNumber(step: PublishStepId): number {
  return PUBLISH_STEPS.findIndex((s) => s.id === step) + 1;
}

/** Etapa todavía cerrada: se ve el recorrido completo pero no se puede operar. */
function LockedStep({ step }: { step: PublishStepId }) {
  const index = stepNumber(step);
  const meta = PUBLISH_STEPS[index - 1];
  const previous = PUBLISH_STEPS[index - 2];

  return (
    <div className="rounded-xl border border-dashed border-border px-5 py-6 flex items-start gap-3">
      <Lock className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" aria-hidden />
      <div className="min-w-0">
        <p className="type-meta text-muted-foreground">Etapa {index}</p>
        <p className="type-body text-muted-foreground mt-0.5">{meta.title}</p>
        <p className="type-body-sm text-muted-foreground mt-2">
          Se habilita cuando guardes la etapa {index - 1}, {previous.title.toLowerCase()}.
        </p>
      </div>
    </div>
  );
}

/** Detalle de lo que falta, en el lugar del error y no como toast que se va. */
function StepIssues({ issues }: { issues: string[] }) {
  if (issues.length === 0) return null;

  return (
    <div role="status" className="rounded-xl border border-border bg-muted/40 px-4 py-3">
      <p className="type-meta text-muted-foreground">Falta completar</p>
      <ul className="mt-1.5 space-y-1">
        {issues.map((issue) => (
          <li key={issue} className="type-body-sm text-foreground flex gap-2">
            <span className="text-muted-foreground" aria-hidden>
              ·
            </span>
            {issue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublishWizard() {
  const [draft, setDraft] = useState<ListingDraft>(() => {
    if (typeof window === "undefined") return { ...EMPTY_DRAFT };
    return loadListingDraft();
  });
  const [activeStep, setActiveStep] = useState<PublishStepId>("plan");
  const [hydrated, setHydrated] = useState(false);
  /** Etapas donde el usuario ya intentó avanzar: recién ahí mostramos faltantes. */
  const [attempted, setAttempted] = useState<PublishStepId[]>([]);
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());
  const [submitting, setSubmitting] = useState(false);

  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  const updateWith = useCallback(
    (patch: (prev: ListingDraft) => Partial<ListingDraft>) => {
      setDraft((prev) => {
        const next = syncCompletedSteps({
          ...prev,
          ...patch(prev),
          status: "draft" as const,
        });
        saveListingDraft(next);
        return next;
      });
    },
    [],
  );

  const update = useCallback(
    (patch: Partial<ListingDraft>) => updateWith(() => patch),
    [updateWith],
  );

  // Hidratación: borrador de localStorage + blobs de las fotos desde IndexedDB.
  useEffect(() => {
    let cancelled = false;
    const stored = syncCompletedSteps(loadListingDraft());
    setDraft(stored);
    setActiveStep(currentStep(stored));
    setHydrated(true);

    if (stored.images.length === 0) return;

    loadImageBlobs(stored.images.map((img) => img.id)).then((blobs) => {
      if (cancelled) return;

      const urls = new Map<string, string>();
      blobs.forEach((blob, id) => urls.set(id, URL.createObjectURL(blob)));
      setPreviews(urls);

      // Metadata sin blob (storage limpiado por el navegador): la descartamos.
      const alive = stored.images.filter((img) => blobs.has(img.id));
      if (alive.length !== stored.images.length) {
        updateWith(() => ({ images: alive }));
        toast.warning("Algunas fotos del borrador ya no estaban guardadas. Volvé a subirlas.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [updateWith]);

  // Los object URLs se liberan al desmontar para no dejar blobs colgados.
  useEffect(
    () => () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const selectedMarca = useMemo(
    () => MARCAS_ORDENADAS.find((m) => m.id === draft.marcaId),
    [draft.marcaId],
  );

  const modelos = useMemo(() => {
    if (!selectedMarca) return [];
    return [...selectedMarca.modelos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es"),
    );
  }, [selectedMarca]);

  const photoCap = maxPhotosFor(draft);
  const planName = PUBLISH_PLANS.find((p) => p.id === draft.planId)?.name ?? "elegido";

  useEffect(() => {
    if (!hydrated || draft.status === "pendiente_revision") return;

    const ids = PUBLISH_STEPS.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(`publish-step-${id}`))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (!top?.target.id) return;
        const step = top.target.id.replace("publish-step-", "") as PublishStepId;
        if (ids.includes(step)) setActiveStep(step);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [hydrated, draft.status]);

  const goTo = (step: PublishStepId) => {
    if (!isStepUnlocked(draft, step)) return;
    setActiveStep(step);
    scrollToStep(step);
  };

  const completeAndNext = (step: PublishStepId, next?: PublishStepId) => {
    setAttempted((prev) => (prev.includes(step) ? prev : [...prev, step]));

    const issues = getStepIssues(draft, step);
    if (issues.length > 0) {
      toast.error(
        issues.length === 1
          ? issues[0]
          : `Faltan ${issues.length} datos en esta etapa.`,
      );
      return;
    }

    const nextDraft = markStepComplete(draft, step);
    setDraft(nextDraft);
    saveListingDraft(nextDraft);
    toast.success("Etapa guardada.");

    if (next) {
      setTimeout(() => scrollToStep(next), 80);
    }
  };

  const handleImages = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const room = photoCap - draft.images.length;
    if (room <= 0) {
      toast.error(`El plan ${planName} admite hasta ${photoCap} fotos.`);
      return;
    }

    const { accepted, rejected } = screenFiles(Array.from(fileList));
    rejected.forEach((r) => toast.error(`${r.name}: ${r.reason}`));

    const toStore = accepted.slice(0, room);
    if (accepted.length > toStore.length) {
      toast.warning(
        `Se agregaron ${toStore.length}. El plan ${planName} admite hasta ${photoCap} fotos.`,
      );
    }
    if (toStore.length === 0) return;

    const stored = await saveImages(toStore);

    setPreviews((prev) => {
      const nextPreviews = new Map(prev);
      stored.forEach((meta, i) => {
        nextPreviews.set(meta.id, URL.createObjectURL(toStore[i]));
      });
      return nextPreviews;
    });

    updateWith((prev) => ({ images: [...prev.images, ...stored] }));
  };

  const removeImage = async (id: string) => {
    await deleteImage(id);

    setPreviews((prev) => {
      const nextPreviews = new Map(prev);
      const url = nextPreviews.get(id);
      if (url) URL.revokeObjectURL(url);
      nextPreviews.delete(id);
      return nextPreviews;
    });

    updateWith((prev) => ({ images: prev.images.filter((img) => img.id !== id) }));
  };

  const handleSubmit = async () => {
    setAttempted(PUBLISH_STEPS.map((s) => s.id));

    if (!isDraftSubmittable(draft)) {
      const firstBroken = PUBLISH_STEPS.find((s) => !isStepValid(draft, s.id));
      toast.error("Revisá las etapas incompletas antes de enviar.");
      if (firstBroken) scrollToStep(firstBroken.id);
      return;
    }

    if (!isSupabaseConfigured) {
      toast.error("Falta configurar la conexión para enviar el pedido. El borrador quedó en este navegador.");
      return;
    }

    let next = draft;
    for (const step of PUBLISH_STEPS) {
      next = markStepComplete(next, step.id);
    }
    next = {
      ...next,
      status: "pendiente_revision",
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const blobs = await loadImageBlobs(draft.images.map((img) => img.id));
      if (blobs.size < MIN_PHOTOS) {
        throw new Error("No se encontraron las fotos en este navegador. Volvé a subirlas.");
      }
      await submitListing(next, blobs);
      setDraft(next);
      saveListingDraft(next);
      toast.success("Solicitud enviada. Tu publicación quedó pendiente de revisión.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetDraft = () => {
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(new Map());
    void clearImages();
    clearListingDraft();
    setDraft({ ...EMPTY_DRAFT, updatedAt: new Date().toISOString() });
    setAttempted([]);
    setActiveStep("plan");
    toast.message("Borrador reiniciado.");
  };

  /** Faltantes visibles solo después de un intento, para no cargar el form vacío. */
  const issuesFor = (step: PublishStepId) =>
    attempted.includes(step) ? getStepIssues(draft, step) : [];

  if (draft.status === "pendiente_revision") {
    return (
      <div className="max-w-xl mx-auto text-center py-10 space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border">
          <Clock className="h-8 w-8 text-foreground" />
        </div>
        <div>
          <h2 className="type-h2 text-foreground">Solicitud enviada</h2>
          <p className="type-body text-muted-foreground mt-3">
            Tu publicación quedó como{" "}
            <span className="text-foreground font-medium">pendiente de revisión</span>.
            Te contactaremos al correo indicado cuando esté aprobada.
          </p>
        </div>
        <div className="rounded-xl border border-border p-5 text-left space-y-2">
          <p className="type-meta text-muted-foreground">Resumen</p>
          <p className="type-body text-foreground">{draft.title || "Sin título"}</p>
          <p className="type-body-sm text-muted-foreground">
            {draft.sellerName} · {draft.sellerEmail}
          </p>
          <p className="type-meta text-muted-foreground">
            Plan: {PUBLISH_PLANS.find((p) => p.id === draft.planId)?.name ?? "—"} ·{" "}
            {draft.images.length} fotos
          </p>
        </div>
        <Button type="button" variant="outline" onClick={resetDraft}>
          Crear otra publicación
        </Button>
      </div>
    );
  }

  const vehiculoUnlocked = isStepUnlocked(draft, "vehiculo");
  const fotosUnlocked = isStepUnlocked(draft, "fotos");
  const contactoUnlocked = isStepUnlocked(draft, "contacto");

  return (
    <div className="grid lg:grid-cols-[13rem_1fr] gap-10 lg:gap-14 items-start">
      <aside className="lg:sticky lg:top-28">
        <p className="type-meta text-muted-foreground mb-4 hidden lg:block">Progreso</p>
        <PublishStepRail activeStep={activeStep} draft={draft} onGoTo={goTo} />
        <p className="type-meta text-muted-foreground mt-4 max-w-[12rem]">
          El borrador se guarda en este navegador hasta que lo envíes.
        </p>
      </aside>

      <div className="min-w-0 space-y-16 md:space-y-20">
        {/* STEP 1 — Plan */}
        <section id="publish-step-plan" className="scroll-mt-28 space-y-6">
          <header>
            <p className="type-meta text-muted-foreground">Etapa 1</p>
            <h2 className="type-h2 text-foreground mt-1">Elegí el plan de publicación</h2>
            <p className="type-body text-muted-foreground mt-2 max-w-xl">
              Empezá por el alcance de tu aviso. Podés cambiar de plan más adelante antes de enviar.
            </p>
          </header>

          <div className="grid sm:grid-cols-3 gap-4">
            {PUBLISH_PLANS.map((plan) => {
              const selected = draft.planId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => update({ planId: plan.id as PublishPlanId })}
                  aria-pressed={selected}
                  className={cn(
                    "text-left rounded-xl border p-5 transition-colors flex flex-col gap-3",
                    selected
                      ? "border-foreground bg-muted/40"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="type-h3 text-foreground">{plan.name}</p>
                      <p className="type-meta text-muted-foreground mt-1">{plan.priceLabel}</p>
                    </div>
                    {plan.recommended && (
                      <span className="type-meta shrink-0 rounded-full border border-border px-2 py-0.5">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="type-body-sm text-muted-foreground">{plan.description}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {plan.features.map((f) => (
                      <li key={f} className="type-body-sm text-foreground flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <StepIssues issues={issuesFor("plan")} />

          <Button type="button" onClick={() => completeAndNext("plan", "vehiculo")}>
            {isStepComplete(draft, "plan") ? "Actualizar y seguir" : "Guardar y seguir"}
          </Button>
        </section>

        {/* STEP 2 — Vehicle */}
        <section id="publish-step-vehiculo" className="scroll-mt-28 space-y-6">
          {!vehiculoUnlocked ? (
            <LockedStep step="vehiculo" />
          ) : (
            <>
              <header>
                <p className="type-meta text-muted-foreground">Etapa 2</p>
                <h2 className="type-h2 text-foreground mt-1">Datos del vehículo</h2>
                <p className="type-body text-muted-foreground mt-2 max-w-xl">
                  Solo lo esencial para el aviso. La ficha técnica del modelo vive en el catálogo: no
                  pedimos peso, color secundario ni presión de neumáticos.
                </p>
              </header>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pub-marca">Marca</Label>
                  <Select
                    value={draft.marcaId}
                    onValueChange={(v) => update({ marcaId: v, modeloId: "" })}
                  >
                    <SelectTrigger id="pub-marca">
                      <SelectValue placeholder="Seleccioná marca" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="max-h-72">
                      {MARCAS_ORDENADAS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-modelo">Modelo</Label>
                  <Select
                    value={draft.modeloId}
                    onValueChange={(v) => update({ modeloId: v })}
                    disabled={!draft.marcaId}
                  >
                    <SelectTrigger id="pub-modelo" disabled={!draft.marcaId}>
                      <SelectValue placeholder="Seleccioná modelo" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="max-h-72">
                      {modelos.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-version">Versión (opcional)</Label>
                  <Input
                    id="pub-version"
                    value={draft.version}
                    onChange={(e) => update({ version: e.target.value })}
                    placeholder="Ej. 1.5 Luxury"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-year">Año</Label>
                  <Select value={draft.year} onValueChange={(v) => update({ year: v })}>
                    <SelectTrigger id="pub-year">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="max-h-72">
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-km">Kilometraje</Label>
                  <Input
                    id="pub-km"
                    inputMode="numeric"
                    value={draft.km}
                    onChange={(e) => update({ km: e.target.value.replace(/\D/g, "") })}
                    placeholder="Ej. 45000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-price">Precio</Label>
                  <div className="flex gap-2">
                    <Select
                      value={draft.currency}
                      onValueChange={(v) => update({ currency: v as "ARS" | "USD" })}
                    >
                      <SelectTrigger className="w-[6.5rem]" aria-label="Moneda">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARS">ARS</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="pub-price"
                      inputMode="numeric"
                      value={draft.price}
                      onChange={(e) => update({ price: e.target.value.replace(/\D/g, "") })}
                      placeholder="Monto"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-fuel">Combustible</Label>
                  <Select value={draft.fuel} onValueChange={(v) => update({ fuel: v })}>
                    <SelectTrigger id="pub-fuel">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_OPTIONS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-tr">Transmisión</Label>
                  <Select
                    value={draft.transmission}
                    onValueChange={(v) => update({ transmission: v })}
                  >
                    <SelectTrigger id="pub-tr">
                      <SelectValue placeholder="Caja" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSMISSION_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-loc">Ciudad / localidad</Label>
                  <Input
                    id="pub-loc"
                    value={draft.location}
                    onChange={(e) => update({ location: e.target.value })}
                    placeholder="Ej. Palermo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-prov">Provincia</Label>
                  <Select
                    value={draft.province}
                    onValueChange={(v) => update({ province: v })}
                  >
                    <SelectTrigger id="pub-prov">
                      <SelectValue placeholder="Provincia" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="max-h-72">
                      {PROVINCE_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <StepIssues issues={issuesFor("vehiculo")} />

              <Button type="button" onClick={() => completeAndNext("vehiculo", "fotos")}>
                {isStepComplete(draft, "vehiculo") ? "Actualizar y seguir" : "Guardar y seguir"}
              </Button>
            </>
          )}
        </section>

        {/* STEP 3 — Photos & quality */}
        <section id="publish-step-fotos" className="scroll-mt-28 space-y-6">
          {!fotosUnlocked ? (
            <LockedStep step="fotos" />
          ) : (
            <>
              <header>
                <p className="type-meta text-muted-foreground">Etapa 3</p>
                <h2 className="type-h2 text-foreground mt-1">Fotos y calidad del aviso</h2>
                <p className="type-body text-muted-foreground mt-2 max-w-xl">
                  Mejores fotos y un texto claro venden más. Mínimo 3 imágenes y una descripción con
                  contexto real del estado del auto.
                </p>
              </header>

              <div className="rounded-xl border border-border p-4 md:p-5 flex gap-3">
                <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" />
                <ul className="type-body-sm text-muted-foreground space-y-1.5">
                  <li>Exterior: 4 ángulos, luz natural, sin placas ilegibles si preferís privacidad.</li>
                  <li>Interior: tablero, asientos y baúl con el auto limpio.</li>
                  <li>Detalle: ruedas, odómetro y alguna marca de uso honesta.</li>
                  <li>Evita selfies borrosas o fotos de catálogo solo.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pub-title">Título del aviso</Label>
                <Input
                  id="pub-title"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Ej. BYD Song Pro DM-i 2024 · único dueño"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pub-desc">Descripción</Label>
                <Textarea
                  id="pub-desc"
                  rows={5}
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Contá el uso del auto, service, equipamiento destacado y motivo de venta. Mínimo unas 2-3 oraciones."
                  className="resize-y min-h-[8rem]"
                />
                <p className="type-meta text-muted-foreground">
                  {draft.description.trim().length} de {MIN_DESCRIPTION_LENGTH} caracteres mínimos
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <Label>Fotos</Label>
                  <span className="type-meta text-muted-foreground">
                    {draft.images.length} de {photoCap} · plan {planName}
                  </span>
                </div>

                <label
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 transition-colors",
                    draft.images.length >= photoCap
                      ? "border-border opacity-60 cursor-not-allowed"
                      : "border-border cursor-pointer hover:border-foreground/40",
                  )}
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="type-body-sm text-foreground">
                    {draft.images.length >= photoCap
                      ? `Llegaste al máximo del plan ${planName}`
                      : "Sumá imágenes del vehículo"}
                  </span>
                  <span className="type-meta text-muted-foreground">
                    JPG, PNG o WebP · hasta 8 MB cada una · mínimo 3
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    disabled={draft.images.length >= photoCap}
                    onChange={(e) => {
                      void handleImages(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>

                {draft.images.length > 0 && (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {draft.images.map((img, i) => {
                      const preview = previews.get(img.id);
                      return (
                        <li
                          key={img.id}
                          className="relative rounded-lg border border-border overflow-hidden"
                        >
                          <div className="aspect-[4/3] bg-muted">
                            {preview ? (
                              <img
                                src={preview}
                                alt={img.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Camera className="h-5 w-5 text-muted-foreground" aria-hidden />
                              </div>
                            )}
                          </div>

                          {i === 0 && (
                            <span className="absolute left-2 top-2 type-meta rounded-full bg-foreground/85 text-background px-2 py-0.5">
                              Portada
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => void removeImage(img.id)}
                            className="absolute right-2 top-2 rounded-full bg-background/90 border border-border p-1 text-muted-foreground hover:text-foreground"
                            aria-label={`Quitar ${img.name}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="flex items-start gap-2 type-body-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Tip: el título con marca, modelo y un diferencial (km bajos, único dueño, service
                    oficial) mejora el click del aviso. La primera foto se usa como portada.
                  </p>
                </div>
              </div>

              <StepIssues issues={issuesFor("fotos")} />

              <Button type="button" onClick={() => completeAndNext("fotos", "contacto")}>
                {isStepComplete(draft, "fotos") ? "Actualizar y seguir" : "Guardar y seguir"}
              </Button>
            </>
          )}
        </section>

        {/* STEP 4 — Contact + submit */}
        <section id="publish-step-contacto" className="scroll-mt-28 space-y-6 pb-10">
          {!contactoUnlocked ? (
            <LockedStep step="contacto" />
          ) : (
            <>
              <header>
                <p className="type-meta text-muted-foreground">Etapa 4</p>
                <h2 className="type-h2 text-foreground mt-1">Tus datos y envío</h2>
                <p className="type-body text-muted-foreground mt-2 max-w-xl">
                  Usamos estos datos para contactarte y completar la revisión del aviso. La
                  publicación no se publica al instante: queda pendiente de revisión.
                </p>
              </header>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="pub-name">Nombre y apellido</Label>
                  <Input
                    id="pub-name"
                    value={draft.sellerName}
                    onChange={(e) => update({ sellerName: e.target.value })}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <span className="type-body-sm text-foreground">Publicás como</span>
                  <div className="flex gap-2">
                    {(["particular", "concesionario"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update({ sellerType: value })}
                        aria-pressed={draft.sellerType === value}
                        className={cn(
                          "rounded-lg border px-4 py-2 type-body-sm transition-colors capitalize",
                          draft.sellerType === value
                            ? "border-foreground bg-muted/40 text-foreground"
                            : "border-border text-muted-foreground hover:border-foreground/40",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-phone">Teléfono</Label>
                  <Input
                    id="pub-phone"
                    type="tel"
                    value={draft.sellerPhone}
                    onChange={(e) => update({ sellerPhone: e.target.value })}
                    autoComplete="tel"
                    placeholder="+54 9 11 …"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pub-email">Email</Label>
                  <Input
                    id="pub-email"
                    type="email"
                    value={draft.sellerEmail}
                    onChange={(e) => update({ sellerEmail: e.target.value })}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border p-5 space-y-2">
                <p className="type-meta text-muted-foreground">Antes de enviar</p>
                <ul className="type-body-sm space-y-1">
                  {PUBLISH_STEPS.map((step) => {
                    const ok = isStepValid(draft, step.id);
                    return (
                      <li
                        key={step.id}
                        className={ok ? "text-foreground" : "text-muted-foreground"}
                      >
                        {ok ? "✓" : "○"} {step.title}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <StepIssues issues={issuesFor("contacto")} />

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button type="button" onClick={() => void handleSubmit()} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />}
                  {submitting ? "Enviando…" : "Enviar solicitud de publicación"}
                </Button>
                <p className="type-meta text-muted-foreground">
                  El borrador ya se guarda solo. Enviar lo pasa a revisión del equipo.
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
