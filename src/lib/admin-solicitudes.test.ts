import { describe, expect, it } from "vitest";
import { buildListingReviewPatch, getSolicitudFormIssues, type SolicitudForm } from "./admin-solicitudes";

const valid: SolicitudForm = {
  title: "BYD Song Pro 2024",
  version: "DM-i",
  marcaId: "byd",
  modeloId: "byd-song-pro",
  year: "2024",
  km: "12000",
  price: "35000000",
  priceOnRequest: false,
  currency: "ARS",
  fuel: "Híbrido",
  transmission: "Automática",
  location: "Palermo",
  province: "Ciudad Autónoma de Buenos Aires",
  description: "Vehículo en excelente estado, único dueño, service oficial.",
  plan: "destacado",
  sellerName: "Ana",
  sellerEmail: "ana@example.com",
  sellerPhone: "1112345678",
  sellerType: "particular",
  adminNotes: "Revisar precio.",
};

describe("admin solicitudes", () => {
  it("pide los datos mínimos antes de aprobar", () => {
    expect(getSolicitudFormIssues({ ...valid, title: "Corto" })).toContain(
      "El título es demasiado corto.",
    );
    expect(getSolicitudFormIssues({ ...valid, price: "0" })).toContain("El precio no es válido.");
    expect(getSolicitudFormIssues({ ...valid, price: "", priceOnRequest: true })).toEqual([]);
    expect(getSolicitudFormIssues(valid)).toEqual([]);
  });

  it("arma el patch con los campos que publica clasificados", () => {
    expect(buildListingReviewPatch(valid)).toEqual({
      title: "BYD Song Pro 2024",
      version: "DM-i",
      marca_id: "byd",
      modelo_id: "byd-song-pro",
      year: 2024,
      km: 12000,
      price: 35000000,
      price_on_request: false,
      currency: "ARS",
      fuel: "Híbrido",
      transmission: "Automática",
      location: "Palermo",
      province: "Ciudad Autónoma de Buenos Aires",
      description: "Vehículo en excelente estado, único dueño, service oficial.",
      plan: "destacado",
      seller_name: "Ana",
      seller_email: "ana@example.com",
      seller_phone: "1112345678",
      seller_type: "particular",
    });
  });
});
