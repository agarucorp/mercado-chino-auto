import { describe, expect, it } from "vitest";
import type { Listing } from "@/data/listings";
import {
  EMPTY_LISTING_FILTERS,
  listingPriceIn,
  matchesListingFilters,
} from "./listing-filters";

const RATE = 1500;

function listing(patch: Partial<Listing>): Listing {
  return {
    id: "1",
    title: "Test",
    version: "",
    price: 15_000_000,
    year: 2024,
    km: 20_000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "CABA",
    province: "CABA",
    image: "",
    images: [],
    marcaId: "chery",
    description: "",
    general: [],
    performance: [],
    security: [],
    equipment: [],
    seller: {
      name: "",
      type: "particular",
      address: "",
      city: "",
      province: "",
      listingsCount: 0,
    },
    currency: "ARS",
    ...patch,
  };
}

describe("listingPriceIn", () => {
  it("pasa pesos a dólares con el tipo de cambio", () => {
    expect(listingPriceIn(listing({ price: 15_000_000, currency: "ARS" }), "USD", RATE)).toBe(10_000);
  });

  it("pasa dólares a pesos", () => {
    expect(listingPriceIn(listing({ price: 10_000, currency: "USD" }), "ARS", RATE)).toBe(15_000_000);
  });
});

describe("matchesListingFilters", () => {
  it("incluye un aviso en pesos cuando el rango está en dólares", () => {
    const filters = {
      ...EMPTY_LISTING_FILTERS,
      priceCurrency: "USD" as const,
      priceMin: "9000",
      priceMax: "11000",
    };
    expect(
      matchesListingFilters(listing({ price: 15_000_000, currency: "ARS" }), filters, RATE),
    ).toBe(true);
    expect(
      matchesListingFilters(listing({ price: 30_000_000, currency: "ARS" }), filters, RATE),
    ).toBe(false);
  });

  it("incluye un aviso en dólares cuando el rango está en pesos", () => {
    const filters = {
      ...EMPTY_LISTING_FILTERS,
      priceCurrency: "ARS" as const,
      priceMin: "14000000",
      priceMax: "16000000",
    };
    expect(
      matchesListingFilters(listing({ price: 10_000, currency: "USD" }), filters, RATE),
    ).toBe(true);
  });

  it("deja afuera un aviso a consultar cuando hay rango de precio", () => {
    const filters = {
      ...EMPTY_LISTING_FILTERS,
      priceMin: "1",
    };
    expect(
      matchesListingFilters(listing({ priceOnRequest: true, price: 0 }), filters, RATE),
    ).toBe(false);
    expect(
      matchesListingFilters(listing({ priceOnRequest: true, price: 0 }), EMPTY_LISTING_FILTERS, RATE),
    ).toBe(true);
  });
});
