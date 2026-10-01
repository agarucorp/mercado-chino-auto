import { describe, expect, it } from "vitest";
import { MARCAS } from "@/data/marcas";
import { DNRPA_PATENTAMIENTOS, type DnrpaPatentamiento } from "@/data/dnrpa-patentamientos";
import {
  formatEnteroAr,
  labelPeriodoDnrpa,
  marcasConPatentamientos,
  rankPatentamientos,
} from "./dnrpa";
import { resolveModeloId } from "./marcas";

const FIXTURE: DnrpaPatentamiento[] = [
  {
    year: 2026,
    marcaId: "byd",
    modeloId: "byd-atto-2-dm-i",
    marcaNombre: "BYD",
    modeloNombre: "Atto 2 DM-i",
    cantidad: 100,
  },
  {
    year: 2025,
    marcaId: "byd",
    modeloId: "byd-atto-2-dm-i",
    marcaNombre: "BYD",
    modeloNombre: "Atto 2 DM-i",
    cantidad: 40,
  },
  {
    year: 2026,
    marcaId: "gwm",
    modeloId: "gwm-haval-h6-hev",
    marcaNombre: "GWM",
    modeloNombre: "HAVAL H6 HEV",
    cantidad: 50,
  },
];

const TOTALS = {
  inscripciones: { 2025: 1000, 2026: 2000 },
  chinos: { 2025: 80, 2026: 200 },
};

describe("rankPatentamientos", () => {
  it("filtra por año y arma el ranking", () => {
    const result = rankPatentamientos({ year: 2026 }, FIXTURE, TOTALS);
    expect(result.rows.map((r) => r.modeloId)).toEqual([
      "byd-atto-2-dm-i",
      "gwm-haval-h6-hev",
    ]);
    expect(result.totalCatalogo).toBe(150);
    expect(result.totalChinos).toBe(200);
    expect(result.rows[0].share).toBeCloseTo(100 / 150);
  });

  it("suma años cuando el filtro es todos", () => {
    const result = rankPatentamientos({ year: "todos", marcaId: "byd" }, FIXTURE, TOTALS);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].cantidad).toBe(140);
    expect(result.totalChinos).toBe(280);
  });
});

describe("marcasConPatentamientos", () => {
  it("lista marcas con datos en el período", () => {
    const marcas = marcasConPatentamientos(2025, FIXTURE);
    expect(marcas).toEqual([{ id: "byd", nombre: "BYD" }]);
  });
});

describe("snapshot DNRPA", () => {
  it("solo referencia modelos del catálogo", () => {
    const ids = new Set(
      MARCAS.flatMap((marca) => marca.modelos.map((modelo) => modelo.id)),
    );
    expect(DNRPA_PATENTAMIENTOS.length).toBeGreaterThan(0);
    for (const row of DNRPA_PATENTAMIENTOS) {
      expect(ids.has(resolveModeloId(row.modeloId))).toBe(true);
    }
  });
});

describe("labels DNRPA", () => {
  it("nombra el recorte 2026 como YTD", () => {
    expect(labelPeriodoDnrpa(2026)).toContain("2026");
    expect(labelPeriodoDnrpa("todos")).toBe("2024–2026");
  });

  it("formatea enteros en es-AR", () => {
    expect(formatEnteroAr(4821)).toMatch(/4/);
  });
});
