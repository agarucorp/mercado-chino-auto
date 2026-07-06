import { describe, expect, it } from "vitest";
import { searchCatalog } from "./search";

describe("searchCatalog", () => {
  it("encuentra marcas por nombre", () => {
    const results = searchCatalog("byd");
    expect(results.some((r) => r.type === "marca" && r.title === "BYD")).toBe(true);
  });

  it("encuentra modelos por nombre", () => {
    const results = searchCatalog("tiggo");
    expect(results.some((r) => r.type === "modelo" && r.title.toLowerCase().includes("tiggo"))).toBe(
      true,
    );
  });

  it("devuelve vacío sin query", () => {
    expect(searchCatalog("")).toEqual([]);
    expect(searchCatalog("   ")).toEqual([]);
  });
});
