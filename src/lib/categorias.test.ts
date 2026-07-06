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
        "electrico:18",
        "hibrido:10",
        "suv:93",
        "hatchback:15",
        "sedan:9",
        "pickup:19",
        "comercial:18",
        "offroad:4",
      ]
    `);
  });
});
