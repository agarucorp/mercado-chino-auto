import { describe, expect, it } from "vitest";
import { getContactIssues } from "./contact-api";

describe("getContactIssues", () => {
  it("pide nombre, email y mensaje", () => {
    expect(getContactIssues({ name: "", email: "", message: "" })).toEqual([
      "Nombre",
      "Email válido",
      "Mensaje de al menos 10 caracteres",
    ]);
  });

  it("acepta un mensaje completo", () => {
    expect(
      getContactIssues({
        name: "Ana Pérez",
        email: "ana@example.com",
        message: "Quiero publicar un aviso de un Tiggo.",
      }),
    ).toEqual([]);
  });
});
