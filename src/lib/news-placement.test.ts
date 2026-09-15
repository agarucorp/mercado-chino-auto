import { describe, expect, it } from "vitest";
import { isGeneralNews } from "./news-placement";

describe("isGeneralNews", () => {
  it("es general si no hay modelo", () => {
    expect(isGeneralNews({ modeloId: undefined })).toBe(true);
    expect(isGeneralNews({ modeloId: "" })).toBe(true);
  });

  it("no es general si está atada a un modelo", () => {
    expect(isGeneralNews({ modeloId: "byd-song-pro" })).toBe(false);
  });
});
