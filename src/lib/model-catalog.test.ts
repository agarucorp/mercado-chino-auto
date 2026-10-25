import { MARCAS } from "@/data/marcas";
import { getModeloSlug } from "@/lib/marcas";
import {
  getLiveMarcas,
  listAdminEntries,
  mergeCatalog,
  nextModeloId,
  resolveFicha,
  resolveImages,
  resolveSummary,
  setCatalogReady,
  setModelProfiles,
  type ModelProfile,
} from "@/lib/model-catalog";
import { searchCatalog } from "@/lib/search";
import { afterEach, describe, expect, it } from "vitest";

function profile(patch: Partial<ModelProfile> & Pick<ModelProfile, "modeloId" | "marcaId" | "nombre">): ModelProfile {
  return {
    estado: "Vigente",
    summary: "",
    ficha: null,
    images: null,
    removed: false,
    custom: false,
    ...patch,
  };
}

afterEach(() => {
  setModelProfiles([]);
  setCatalogReady(true, null);
});

describe("mergeCatalog", () => {
  const byd = MARCAS.find((marca) => marca.id === "byd");
  const baseModelo = byd?.modelos[0];

  it("cambia el nombre y el estado sin cambiar el id ni la dirección", () => {
    expect(byd && baseModelo).toBeTruthy();
    if (!byd || !baseModelo) return;

    const merged = mergeCatalog(MARCAS, [
      profile({
        modeloId: baseModelo.id,
        marcaId: byd.id,
        nombre: "Nombre editado",
        estado: "Discontinuado",
      }),
    ]);
    const modelo = merged.find((marca) => marca.id === byd.id)?.modelos.find((item) => item.id === baseModelo.id);
    expect(modelo?.nombre).toBe("Nombre editado");
    expect(modelo?.estado).toBe("Discontinuado");
    expect(modelo && getModeloSlug(modelo)).toBe(getModeloSlug(baseModelo));
  });

  it("oculta un modelo existente y suma uno nuevo", () => {
    expect(byd && baseModelo).toBeTruthy();
    if (!byd || !baseModelo) return;

    const merged = mergeCatalog(MARCAS, [
      profile({
        modeloId: baseModelo.id,
        marcaId: byd.id,
        nombre: baseModelo.nombre,
        removed: true,
      }),
      profile({
        modeloId: "byd-modelo-de-prueba",
        marcaId: "byd",
        nombre: "Modelo de prueba",
        custom: true,
        summary: "Texto general",
        ficha: [{ label: "Potencia", value: "99 CV" }],
        images: ["/foto-nueva.jpg"],
      }),
    ]);

    const modelos = merged.find((marca) => marca.id === "byd")?.modelos ?? [];
    expect(modelos.some((modelo) => modelo.id === baseModelo.id)).toBe(false);
    expect(modelos.some((modelo) => modelo.nombre === "Modelo de prueba")).toBe(true);
  });

  it("arma un id nuevo sin pisar uno que ya existe", () => {
    const taken = new Set(["byd-seal"]);
    expect(nextModeloId("byd", "Seal", taken)).toBe("byd-seal-2");
    expect(nextModeloId("byd", "Seal 6", taken)).toBe("byd-seal-6");
  });
});

describe("catálogo en vivo", () => {
  it("la búsqueda, la ficha y las fotos usan lo que guardó el admin", () => {
    const byd = MARCAS.find((marca) => marca.id === "byd");
    const baseModelo = byd?.modelos[0];
    expect(baseModelo).toBeTruthy();
    if (!byd || !baseModelo) return;

    setModelProfiles([
      profile({
        modeloId: baseModelo.id,
        marcaId: byd.id,
        nombre: "Buscable Editado",
        summary: "Detalle general",
        ficha: [{ label: "Potencia", value: "321 CV" }],
        images: ["/editada.jpg"],
      }),
      profile({
        modeloId: "byd-nuevo-test",
        marcaId: "byd",
        nombre: "Nuevo Test",
        custom: true,
      }),
    ]);

    expect(searchCatalog("Buscable Editado").some((result) => result.title === "Buscable Editado")).toBe(true);
    expect(searchCatalog("Nuevo Test").some((result) => result.href === "/marcas/byd/nuevo-test")).toBe(true);
    expect(resolveFicha(baseModelo.id)[0]).toEqual({ label: "Potencia", value: "321 CV" });
    expect(resolveImages(baseModelo.id)).toEqual(["/editada.jpg"]);
    expect(resolveSummary(baseModelo.id)).toBe("Detalle general");
    expect(getLiveMarcas().some((marca) => marca.modelos.some((modelo) => modelo.id === "byd-nuevo-test"))).toBe(true);
    expect(listAdminEntries().some((entry) => entry.modelo.id === "byd-nuevo-test" && entry.custom)).toBe(true);
  });
});
