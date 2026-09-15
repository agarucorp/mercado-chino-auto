import type { DraftImage } from "@/lib/listing-images";

export type PublishPlanId = "basico" | "destacado" | "premium";

export type PublishStatus = "draft" | "pendiente_revision";

export interface PublishPlan {
  id: PublishPlanId;
  name: string;
  priceLabel: string;
  description: string;
  features: string[];
  /** Tope de fotos del plan, el mismo número que anuncia `features`. */
  maxPhotos: number;
  recommended?: boolean;
}

export const MIN_PHOTOS = 3;

export const PUBLISH_PLANS: PublishPlan[] = [
  {
    id: "basico",
    name: "Básico",
    priceLabel: "Gratis",
    description: "Publicá tu aviso con los datos esenciales del vehículo.",
    features: [
      "Listado en clasificados",
      "Hasta 8 fotos",
      "Duración 30 días",
      "Contacto por el anuncio",
    ],
    maxPhotos: 8,
  },
  {
    id: "destacado",
    name: "Destacado",
    priceLabel: "Desde $15.900",
    description: "Más visibilidad en el listado y en la home de clasificados.",
    features: [
      "Todo lo del plan Básico",
      "Hasta 15 fotos",
      "Badge Destacado",
      "Prioridad en búsquedas",
      "Duración 45 días",
    ],
    maxPhotos: 15,
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    priceLabel: "Desde $29.900",
    description: "Máxima exposición para vender más rápido.",
    features: [
      "Todo lo del Destacado",
      "Hasta 25 fotos",
      "Posición privilegiada 7 días",
      "Enlace directo a redes (opcional)",
      "Duración 60 días",
    ],
    maxPhotos: 25,
  },
];

export const PUBLISH_STEPS = [
  { id: "plan", title: "Plan de publicación", short: "Plan" },
  { id: "vehiculo", title: "Datos del vehículo", short: "Vehículo" },
  { id: "fotos", title: "Fotos y calidad del aviso", short: "Fotos" },
  { id: "contacto", title: "Tus datos y envío", short: "Envío" },
] as const;

export type PublishStepId = (typeof PUBLISH_STEPS)[number]["id"];

export interface ListingDraft {
  planId: PublishPlanId | null;
  marcaId: string;
  modeloId: string;
  year: string;
  km: string;
  price: string;
  currency: "ARS" | "USD";
  fuel: string;
  transmission: string;
  version: string;
  location: string;
  province: string;
  title: string;
  description: string;
  images: DraftImage[];
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerType: "particular" | "concesionario";
  completedSteps: PublishStepId[];
  status: PublishStatus;
  submittedAt?: string;
  updatedAt: string;
}

export const EMPTY_DRAFT: ListingDraft = {
  planId: null,
  marcaId: "",
  modeloId: "",
  year: "",
  km: "",
  price: "",
  currency: "ARS",
  fuel: "",
  transmission: "",
  version: "",
  location: "",
  province: "",
  title: "",
  description: "",
  images: [],
  sellerName: "",
  sellerEmail: "",
  sellerPhone: "",
  sellerType: "particular",
  completedSteps: [],
  status: "draft",
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = "auchar-listing-draft-v1";

export function loadListingDraft(): ListingDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_DRAFT };
    const parsed = JSON.parse(raw) as ListingDraft;
    return {
      ...EMPTY_DRAFT,
      ...parsed,
      completedSteps: parsed.completedSteps ?? [],
      images: parsed.images ?? [],
      status: parsed.status === "pendiente_revision" ? "pendiente_revision" : "draft",
    };
  } catch {
    return { ...EMPTY_DRAFT };
  }
}

export function saveListingDraft(draft: ListingDraft): void {
  const payload: ListingDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearListingDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function markStepComplete(draft: ListingDraft, step: PublishStepId): ListingDraft {
  if (draft.completedSteps.includes(step)) return draft;
  return {
    ...draft,
    completedSteps: [...draft.completedSteps, step],
  };
}

export function isStepComplete(draft: ListingDraft, step: PublishStepId): boolean {
  return draft.completedSteps.includes(step);
}

export const MIN_TITLE_LENGTH = 8;
export const MIN_DESCRIPTION_LENGTH = 40;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Tope de fotos del plan elegido; sin plan usamos el mínimo de la grilla. */
export function maxPhotosFor(draft: ListingDraft): number {
  const plan = PUBLISH_PLANS.find((p) => p.id === draft.planId);
  return plan?.maxPhotos ?? PUBLISH_PLANS[0].maxPhotos;
}

/** Qué falta para dar la etapa por terminada. Lista vacía = etapa válida. */
export function getStepIssues(draft: ListingDraft, step: PublishStepId): string[] {
  const missing: string[] = [];

  switch (step) {
    case "plan":
      if (!draft.planId) missing.push("Elegí un plan de publicación");
      return missing;

    case "vehiculo":
      if (!draft.marcaId) missing.push("Marca");
      if (!draft.modeloId) missing.push("Modelo");
      if (!draft.year) missing.push("Año");
      if (!draft.km) missing.push("Kilometraje");
      if (!draft.price) missing.push("Precio");
      if (!draft.fuel) missing.push("Combustible");
      if (!draft.transmission) missing.push("Transmisión");
      if (!draft.location.trim()) missing.push("Ciudad o localidad");
      if (!draft.province) missing.push("Provincia");
      return missing;

    case "fotos":
      if (draft.images.length < MIN_PHOTOS) {
        missing.push(
          `Al menos ${MIN_PHOTOS} fotos (subiste ${draft.images.length})`,
        );
      }
      if (draft.title.trim().length < MIN_TITLE_LENGTH) {
        missing.push(`Título de ${MIN_TITLE_LENGTH} caracteres o más`);
      }
      if (draft.description.trim().length < MIN_DESCRIPTION_LENGTH) {
        missing.push(`Descripción de ${MIN_DESCRIPTION_LENGTH} caracteres o más`);
      }
      return missing;

    case "contacto":
      if (!draft.sellerName.trim()) missing.push("Nombre y apellido");
      if (!EMAIL_RE.test(draft.sellerEmail.trim())) missing.push("Email válido");
      if (draft.sellerPhone.replace(/\D/g, "").length < 8) {
        missing.push("Teléfono de al menos 8 dígitos");
      }
      return missing;
  }
}

export function isStepValid(draft: ListingDraft, step: PublishStepId): boolean {
  return getStepIssues(draft, step).length === 0;
}

export function isDraftSubmittable(draft: ListingDraft): boolean {
  return PUBLISH_STEPS.every((step) => isStepValid(draft, step.id));
}

/**
 * Una etapa se abre solo cuando todas las anteriores quedaron confirmadas con
 * "Guardar y seguir". Sin esto se puede saltar a la última etapa desde la
 * primera, que es lo que el recorrido permitía antes.
 */
export function isStepUnlocked(draft: ListingDraft, step: PublishStepId): boolean {
  const index = PUBLISH_STEPS.findIndex((s) => s.id === step);
  if (index <= 0) return true;
  return PUBLISH_STEPS.slice(0, index).every((s) =>
    draft.completedSteps.includes(s.id),
  );
}

/** Primera etapa todavía no confirmada: donde el usuario tiene que estar parado. */
export function currentStep(draft: ListingDraft): PublishStepId {
  const pending = PUBLISH_STEPS.find((s) => !draft.completedSteps.includes(s.id));
  return pending?.id ?? PUBLISH_STEPS[PUBLISH_STEPS.length - 1].id;
}

/**
 * Reabre las etapas que dejaron de ser válidas. Si el usuario vuelve atrás y
 * vacía un campo, esa etapa y todas las siguientes vuelven a quedar pendientes.
 */
export function syncCompletedSteps(draft: ListingDraft): ListingDraft {
  const stillValid: PublishStepId[] = [];

  for (const step of PUBLISH_STEPS) {
    if (!draft.completedSteps.includes(step.id)) break;
    if (!isStepValid(draft, step.id)) break;
    stillValid.push(step.id);
  }

  if (stillValid.length === draft.completedSteps.length) return draft;
  return { ...draft, completedSteps: stillValid };
}

export const FUEL_OPTIONS = [
  "Nafta",
  "Diésel",
  "Híbrido",
  "Híbrido enchufable",
  "Eléctrico",
  "GNC",
];

export const TRANSMISSION_OPTIONS = ["Manual", "Automática", "CVT", "DCT"];

export const PROVINCE_OPTIONS = [
  "Ciudad Autónoma de Buenos Aires",
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];
