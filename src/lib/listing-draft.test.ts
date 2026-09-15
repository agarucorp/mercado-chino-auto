import { describe, expect, it } from "vitest";
import {
  EMPTY_DRAFT,
  currentStep,
  getStepIssues,
  isDraftSubmittable,
  isStepUnlocked,
  isStepValid,
  markStepComplete,
  maxPhotosFor,
  syncCompletedSteps,
  type ListingDraft,
} from "./listing-draft";
import type { DraftImage } from "./listing-images";

function fotos(n: number): DraftImage[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `img-${i}`,
    name: `foto-${i}.jpg`,
    size: 1024,
    type: "image/jpeg",
  }));
}

const VEHICULO_OK = {
  marcaId: "byd",
  modeloId: "byd-song-pro",
  year: "2024",
  km: "45000",
  price: "34990",
  fuel: "Híbrido enchufable",
  transmission: "Automática",
  location: "Palermo",
  province: "Buenos Aires",
};

const FOTOS_OK = {
  images: fotos(3),
  title: "BYD Song Pro DM-i 2024 único dueño",
  description: "Auto de uso particular, service oficial al día y cubiertas nuevas.",
};

const CONTACTO_OK = {
  sellerName: "Federico Ruiz",
  sellerEmail: "fede@example.com",
  sellerPhone: "1155555555",
};

function draftWith(patch: Partial<ListingDraft>): ListingDraft {
  return { ...EMPTY_DRAFT, ...patch };
}

/** Borrador válido en todas las etapas y con las cuatro confirmadas. */
function fullDraft(): ListingDraft {
  let draft = draftWith({
    planId: "destacado",
    ...VEHICULO_OK,
    ...FOTOS_OK,
    ...CONTACTO_OK,
  });
  for (const step of ["plan", "vehiculo", "fotos", "contacto"] as const) {
    draft = markStepComplete(draft, step);
  }
  return draft;
}

describe("gate de etapas", () => {
  it("con el borrador vacío solo la primera etapa está abierta", () => {
    const draft = { ...EMPTY_DRAFT };
    expect(isStepUnlocked(draft, "plan")).toBe(true);
    expect(isStepUnlocked(draft, "vehiculo")).toBe(false);
    expect(isStepUnlocked(draft, "fotos")).toBe(false);
    expect(isStepUnlocked(draft, "contacto")).toBe(false);
  });

  it("no alcanza con que los datos sean válidos: la etapa hay que confirmarla", () => {
    const draft = draftWith({ planId: "basico" });
    expect(isStepValid(draft, "plan")).toBe(true);
    expect(isStepUnlocked(draft, "vehiculo")).toBe(false);

    const confirmado = markStepComplete(draft, "plan");
    expect(isStepUnlocked(confirmado, "vehiculo")).toBe(true);
  });

  it("confirmar la primera etapa no abre las que siguen", () => {
    const draft = markStepComplete(draftWith({ planId: "basico" }), "plan");
    expect(isStepUnlocked(draft, "vehiculo")).toBe(true);
    expect(isStepUnlocked(draft, "fotos")).toBe(false);
    expect(isStepUnlocked(draft, "contacto")).toBe(false);
  });

  it("con todo confirmado quedan las cuatro abiertas", () => {
    const draft = fullDraft();
    expect(isStepUnlocked(draft, "contacto")).toBe(true);
    expect(isDraftSubmittable(draft)).toBe(true);
  });
});

describe("syncCompletedSteps", () => {
  it("reabre la etapa y las siguientes cuando se vacía un campo anterior", () => {
    const draft = { ...fullDraft(), province: "" };
    const synced = syncCompletedSteps(draft);

    expect(synced.completedSteps).toEqual(["plan"]);
    expect(isStepUnlocked(synced, "fotos")).toBe(false);
    expect(isStepUnlocked(synced, "contacto")).toBe(false);
    expect(isDraftSubmittable(synced)).toBe(false);
  });

  it("borrar fotos por debajo del mínimo reabre solo desde esa etapa", () => {
    const draft = { ...fullDraft(), images: fotos(2) };
    const synced = syncCompletedSteps(draft);

    expect(synced.completedSteps).toEqual(["plan", "vehiculo"]);
    expect(isStepUnlocked(synced, "fotos")).toBe(true);
    expect(isStepUnlocked(synced, "contacto")).toBe(false);
  });

  it("no toca un borrador que sigue siendo válido", () => {
    const draft = fullDraft();
    expect(syncCompletedSteps(draft)).toBe(draft);
  });
});

describe("getStepIssues", () => {
  it("enumera cada campo faltante del vehículo", () => {
    const issues = getStepIssues({ ...EMPTY_DRAFT }, "vehiculo");
    expect(issues).toContain("Marca");
    expect(issues).toContain("Provincia");
    expect(issues).toHaveLength(9);
  });

  it("no reporta nada cuando la etapa está completa", () => {
    const draft = draftWith(VEHICULO_OK);
    expect(getStepIssues(draft, "vehiculo")).toEqual([]);
  });

  it("cuenta las fotos que faltan", () => {
    const draft = draftWith({ ...FOTOS_OK, images: fotos(1) });
    expect(getStepIssues(draft, "fotos")).toEqual([
      "Al menos 3 fotos (subiste 1)",
    ]);
  });

  it("rechaza un email mal formado", () => {
    const draft = draftWith({ ...CONTACTO_OK, sellerEmail: "fede@sin-punto" });
    expect(getStepIssues(draft, "contacto")).toEqual(["Email válido"]);
  });

  it("pide al menos 8 dígitos de teléfono, ignorando separadores", () => {
    const corto = draftWith({ ...CONTACTO_OK, sellerPhone: "11-55-55" });
    expect(getStepIssues(corto, "contacto")).toEqual([
      "Teléfono de al menos 8 dígitos",
    ]);

    const valido = draftWith({ ...CONTACTO_OK, sellerPhone: "+54 9 11 5555-5555" });
    expect(getStepIssues(valido, "contacto")).toEqual([]);
  });
});

describe("maxPhotosFor", () => {
  it("respeta el tope de cada plan", () => {
    expect(maxPhotosFor(draftWith({ planId: "basico" }))).toBe(8);
    expect(maxPhotosFor(draftWith({ planId: "destacado" }))).toBe(15);
    expect(maxPhotosFor(draftWith({ planId: "premium" }))).toBe(25);
  });

  it("sin plan elegido usa el tope más bajo", () => {
    expect(maxPhotosFor({ ...EMPTY_DRAFT })).toBe(8);
  });
});

describe("currentStep", () => {
  it("apunta a la primera etapa sin confirmar", () => {
    expect(currentStep({ ...EMPTY_DRAFT })).toBe("plan");

    const conPlan = markStepComplete(draftWith({ planId: "basico" }), "plan");
    expect(currentStep(conPlan)).toBe("vehiculo");
  });

  it("con todo confirmado se queda en la última", () => {
    expect(currentStep(fullDraft())).toBe("contacto");
  });
});
