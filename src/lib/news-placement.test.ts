import { describe, expect, it } from "vitest";
import { isBrandWideNews, isGeneralNews, newsMatchesModelo } from "./news-placement";

describe("isGeneralNews", () => {
  it("es general solo sin marca ni modelo", () => {
    expect(isGeneralNews({ marcaId: undefined, modeloId: undefined })).toBe(true);
    expect(isGeneralNews({ marcaId: "", modeloId: "" })).toBe(true);
  });

  it("no es general si tiene marca (aunque sea todos los modelos)", () => {
    expect(isGeneralNews({ marcaId: "byd", modeloId: undefined })).toBe(false);
    expect(isGeneralNews({ marcaId: "byd", modeloId: "byd-song-pro" })).toBe(false);
  });
});

describe("isBrandWideNews", () => {
  it("es brand-wide con marca y sin modelo", () => {
    expect(isBrandWideNews({ marcaId: "byd", modeloId: undefined })).toBe(true);
    expect(isBrandWideNews({ marcaId: "byd", modeloId: "" })).toBe(true);
  });

  it("no es brand-wide sin marca o con modelo concreto", () => {
    expect(isBrandWideNews({ marcaId: undefined, modeloId: undefined })).toBe(false);
    expect(isBrandWideNews({ marcaId: "byd", modeloId: "byd-song-pro" })).toBe(false);
  });
});

describe("newsMatchesModelo", () => {
  it("incluye modelo concreto y todos los modelos de la marca", () => {
    expect(
      newsMatchesModelo({ marcaId: "byd", modeloId: "byd-song-pro" }, "byd", "byd-song-pro"),
    ).toBe(true);
    expect(
      newsMatchesModelo({ marcaId: "byd", modeloId: undefined }, "byd", "byd-song-pro"),
    ).toBe(true);
    expect(
      newsMatchesModelo({ marcaId: "byd", modeloId: "byd-dolphin-mini" }, "byd", "byd-song-pro"),
    ).toBe(false);
    expect(
      newsMatchesModelo({ marcaId: "baic", modeloId: "baic-eu5-plus" }, "baic", "baic-eu5"),
    ).toBe(true);
  });
});
