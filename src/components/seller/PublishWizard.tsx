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
  PROVINCE_OPTIONS,
  PUBLISH_PLANS,
  PUBLISH_STEPS,
  TRANSMISSION_OPTIONS,
  clearListingDraft,
  isStepComplete,
  loadListingDraft,
  markStepComplete,
  saveListingDraft,
  validateContact,
  validatePhotos,
  validatePlan,
  validateVehicle,
  type ListingDraft,
  type PublishPlanId,
  type PublishStepId,
} from "@/lib/listing-draft";
import { cn } from "@/lib/utils";
import {
  Camera,
  CheckCircle2,
  Clock,
  ImagePlus,
  Lightbulb,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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

export function PublishWizard() {
  const [draft, setDraft] = useState<ListingDraft>(() => {
    if (typeof window === "undefined") return { ...EMPTY_DRAFT };
    return loadListingDraft();
  });
  const [activeStep, setActiveStep] = useState<PublishStepId>("plan");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(loadListingDraft());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ListingDraft) => {
    setDraft(next);
    saveListingDraft(next);
  }, []);

  const update = useCallback(
    (patch: Partial<ListingDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch, status: "draft" as const };
        saveListingDraft(next);
        return next;
      });
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
    setActiveStep(step);
    scrollToStep(step);
  };

  const completeAndNext = (step: PublishStepId, next?: PublishStepId) => {
    const validators: Record<PublishStepId, (d: ListingDraft) => boolean> = {
      plan: validatePlan,
      vehiculo: validateVehicle,
      fotos: validatePhotos,
      contacto: validateContact,
    };

    if (!validators[step](draft)) {
      toast.error("Completá los campos requeridos de esta etapa.");
      return;
    }

    const nextDraft = markStepComplete(draft, step);
    persist(nextDraft);
    toast.success("Etapa guardada en borrador.");
    if (next) {
      setTimeout(() => scrollToStep(next), 80);
    }
  };

  const handleImages = (files: FileList | null) => {
    if (!files?.length) return;
    const names = Array.from(files).map((f) => f.name);
    const merged = [...draft.imageNames, ...names].slice(0, 25);
    update({ imageNames: merged });
  };

  const removeImage = (name: string) => {
    update({ imageNames: draft.imageNames.filter((n) => n !== name) });
  };

  const handleSubmit = () => {
    if (!validatePlan(draft) || !validateVehicle(draft) || !validatePhotos(draft) || !validateContact(draft)) {
      toast.error("Revisá las etapas incompletas antes de enviar.");
      return;
    }

    let next = markStepComplete(draft, "plan");
    next = markStepComplete(next, "vehiculo");
    next = markStepComplete(next, "fotos");
    next = markStepComplete(next, "contacto");
    next = {
      ...next,
      status: "pendiente_revision",
      submittedAt: new Date().toISOString(),
    };
    persist(next);
    toast.success("Solicitud enviada. Tu publicación quedó pendiente de revisión.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetDraft = () => {
    clearListingDraft();
    setDraft({ ...EMPTY_DRAFT, updatedAt: new Date().toISOString() });
    setActiveStep("plan");
    toast.message("Borrador reiniciado.");
  };

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
            Plan: {PUBLISH_PLANS.find((p) => p.id === draft.planId)?.name ?? "—"}
          </p>
        </div>
        <Button type="button" onClick={resetDraft}>
          Crear otra publicación
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[13rem_1fr] gap-10 lg:gap-14 items-start">
      <aside className="lg:sticky lg:top-28">
        <p className="type-meta text-muted-foreground mb-4 hidden lg:block">Progreso</p>
        <PublishStepRail activeStep={activeStep} draft={draft} onGoTo={goTo} />
        {draft.completedSteps.length > 0 && (
          <p className="type-meta text-muted-foreground mt-4 max-w-[12rem]">
            Borrador guardado al completar cada etapa.
          </p>
        )}
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

          <Button
            type="button"
            onClick={() => completeAndNext("plan", "vehiculo")}
            disabled={!validatePlan(draft)}
          >
            {isStepComplete(draft, "plan") ? "Actualizar y seguir" : "Guardar y seguir"}
          </Button>
        </section>

        {/* STEP 2 — Vehicle */}
        <section id="publish-step-vehiculo" className="scroll-mt-28 space-y-6">
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
                  <SelectTrigger className="w-[6.5rem]">
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

          <Button
            type="button"
            onClick={() => completeAndNext("vehiculo", "fotos")}
            disabled={!validateVehicle(draft)}
          >
            {isStepComplete(draft, "vehiculo") ? "Actualizar y seguir" : "Guardar y seguir"}
          </Button>
        </section>

        {/* STEP 3 — Photos & quality */}
        <section id="publish-step-fotos" className="scroll-mt-28 space-y-6">
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
              {draft.description.trim().length}/40 caracteres mínimos
            </p>
          </div>

          <div className="space-y-3">
            <Label>Fotos</Label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 cursor-pointer hover:border-foreground/40 transition-colors">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="type-body-sm text-foreground">Sumá imágenes del vehículo</span>
              <span className="type-meta text-muted-foreground">
                JPG o PNG · mínimo 3 · hasta 25 según el plan
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  handleImages(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            {draft.imageNames.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-2">
                {draft.imageNames.map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
                  >
                    <Camera className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="type-body-sm text-foreground truncate flex-1">{name}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(name)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      aria-label={`Quitar ${name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-start gap-2 type-body-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                Tip: el título con marca, modelo y un diferencial (km bajos, único dueño, service
                oficial) mejora el click del aviso.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => completeAndNext("fotos", "contacto")}
            disabled={!validatePhotos(draft)}
          >
            {isStepComplete(draft, "fotos") ? "Actualizar y seguir" : "Guardar y seguir"}
          </Button>
        </section>

        {/* STEP 4 — Contact + submit */}
        <section id="publish-step-contacto" className="scroll-mt-28 space-y-6 pb-10">
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
              <Label>Tipo de vendedor</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["particular", "Particular"],
                    ["concesionario", "Concesionario / agencia"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update({ sellerType: value })}
                    className={cn(
                      "rounded-full border px-4 py-2 type-body-sm transition-colors",
                      draft.sellerType === value
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground/40",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-name">Nombre y apellido</Label>
              <Input
                id="pub-name"
                value={draft.sellerName}
                onChange={(e) => update({ sellerName: e.target.value })}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-phone">Teléfono / WhatsApp</Label>
              <Input
                id="pub-phone"
                type="tel"
                value={draft.sellerPhone}
                onChange={(e) => update({ sellerPhone: e.target.value })}
                autoComplete="tel"
                placeholder="+54 9 11 …"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
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
            <ul className="type-body-sm text-muted-foreground space-y-1">
              <li className={validatePlan(draft) ? "text-foreground" : ""}>
                {validatePlan(draft) ? "✓" : "○"} Plan elegido
              </li>
              <li className={validateVehicle(draft) ? "text-foreground" : ""}>
                {validateVehicle(draft) ? "✓" : "○"} Datos del vehículo
              </li>
              <li className={validatePhotos(draft) ? "text-foreground" : ""}>
                {validatePhotos(draft) ? "✓" : "○"} Fotos y texto del aviso
              </li>
              <li className={validateContact(draft) ? "text-foreground" : ""}>
                {validateContact(draft) ? "✓" : "○"} Datos de contacto
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                !validatePlan(draft) ||
                !validateVehicle(draft) ||
                !validatePhotos(draft) ||
                !validateContact(draft)
              }
            >
              Enviar solicitud de publicación
            </Button>
            <Button type="button" onClick={() => completeAndNext("contacto")}>
              Solo guardar borrador
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
