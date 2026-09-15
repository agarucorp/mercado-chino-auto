import { describe, expect, it } from "vitest";
import { getCategoriasConConteo, getCategoriasDeModelo } from "./categorias";
import { MARCAS } from "@/data/marcas";

describe("categorias", () => {
  it("solo expone categorías con modelos en el catálogo", () => {
    const cats = getCategoriasConConteo();
    expect(cats.length).toBeGreaterThan(0);
    for (const cat of cats) {
      expect(cat.count).toBeGreaterThan(0);
    }
    const slugs = cats.map((c) => c.slug);
    expect(slugs).not.toContain("camion" as never);
  });

  it("clasifica todos los modelos del catálogo", () => {
    const total = MARCAS.reduce((n, m) => n + m.modelos.length, 0);
    let clasificados = 0;
    for (const marca of MARCAS) {
      for (const modelo of marca.modelos) {
        const cats = getCategoriasDeModelo(modelo.nombre);
        expect(cats.length).toBeGreaterThan(0);
        clasificados++;
      }
    }
    expect(clasificados).toBe(total);
  });

  it("conteos por categoría", () => {
    const cats = getCategoriasConConteo();
    expect(cats.map((c) => `${c.slug}:${c.count}`)).toMatchInlineSnapshot(`
      [
        "electrico:12",
        "hibrido:16",
        "suv:88",
        "hatchback:10",
        "sedan:5",
        "pickup:15",
        "offroad:4",
      ]
    `);
  });
});
