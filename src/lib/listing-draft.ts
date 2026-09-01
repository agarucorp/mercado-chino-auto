export type PublishPlanId = "basico" | "destacado" | "premium";

export type PublishStatus = "draft" | "pendiente_revision";

export interface PublishPlan {
  id: PublishPlanId;
  name: string;
  priceLabel: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

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
  imageNames: string[];
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
  imageNames: [],
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
      imageNames: parsed.imageNames ?? [],
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

export function validatePlan(draft: ListingDraft): boolean {
  return Boolean(draft.planId);
}

export function validateVehicle(draft: ListingDraft): boolean {
  return Boolean(
    draft.marcaId &&
      draft.modeloId &&
      draft.year &&
      draft.km &&
      draft.price &&
      draft.fuel &&
      draft.transmission &&
      draft.location &&
      draft.province,
  );
}

export function validatePhotos(draft: ListingDraft): boolean {
  return (
    draft.imageNames.length >= 3 &&
    draft.title.trim().length >= 8 &&
    draft.description.trim().length >= 40
  );
}

export function validateContact(draft: ListingDraft): boolean {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.sellerEmail.trim());
  const phoneOk = draft.sellerPhone.replace(/\D/g, "").length >= 8;
  return Boolean(draft.sellerName.trim() && emailOk && phoneOk);
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
