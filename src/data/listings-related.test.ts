import { describe, expect, it } from "vitest";
import { LISTINGS_DATA, getRelatedListings } from "./listings";

describe("getRelatedListings", () => {
  it("excluye el aviso actual y prioriza la misma marca", () => {
    const listing = LISTINGS_DATA[0];
    const related = getRelatedListings(listing, 3, LISTINGS_DATA);
    expect(related).toHaveLength(3);
    expect(related.some((item) => item.id === listing.id)).toBe(false);
    expect(related[0].marcaId).toBe(listing.marcaId);
  });
});
