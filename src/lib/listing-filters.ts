import type { Listing } from "@/data/listings";

export type PriceCurrency = "ARS" | "USD";

export interface ListingFilters {
  marcaId: string;
  year: string;
  fuel: string;
  location: string;
  transmission: string;
  priceCurrency: PriceCurrency;
  priceMin: string;
  priceMax: string;
  kmMin: string;
  kmMax: string;
}

export const EMPTY_LISTING_FILTERS: ListingFilters = {
  marcaId: "all",
  year: "all",
  fuel: "all",
  location: "all",
  transmission: "all",
  priceCurrency: "ARS",
  priceMin: "",
  priceMax: "",
  kmMin: "",
  kmMax: "",
};

export function listingPriceIn(
  listing: Pick<Listing, "price" | "currency" | "priceOnRequest">,
  currency: PriceCurrency,
  usdArs: number,
): number {
  if (listing.priceOnRequest) return Number.NaN;
  const from = listing.currency ?? "ARS";
  if (from === currency) return listing.price;
  if (!Number.isFinite(usdArs) || usdArs <= 0) return listing.price;
  return currency === "USD" ? listing.price / usdArs : listing.price * usdArs;
}

function fuelKey(fuel: string): string {
  const n = fuel.toLowerCase();
  if (n.includes("híbr") || n.includes("hibr")) return "hibrido";
  if (n.includes("eléct") || n.includes("elect")) return "electrico";
  if (n.includes("diés") || n.includes("dies")) return "diesel";
  if (n.includes("naft")) return "nafta";
  return n;
}

function matchesTransmission(value: string, filter: string): boolean {
  const n = value.toLowerCase();
  if (filter === "manual") return n.includes("manual");
  if (filter === "automatica") {
    return n.includes("automát") || n.includes("automat") || n.includes("cvt");
  }
  return true;
}

function inRange(value: number, minRaw: string, maxRaw: string): boolean {
  const min = minRaw.trim() === "" ? null : Number(minRaw);
  const max = maxRaw.trim() === "" ? null : Number(maxRaw);
  if (min !== null && Number.isFinite(min) && value < min) return false;
  if (max !== null && Number.isFinite(max) && value > max) return false;
  return true;
}

export function matchesListingFilters(
  listing: Listing,
  filters: ListingFilters,
  usdArs: number,
): boolean {
  if (filters.marcaId !== "all" && listing.marcaId !== filters.marcaId) return false;
  if (filters.year !== "all" && String(listing.year) !== filters.year) return false;
  if (filters.fuel !== "all" && fuelKey(listing.fuel) !== filters.fuel) return false;
  if (filters.location !== "all" && listing.location !== filters.location) return false;
  if (!matchesTransmission(listing.transmission, filters.transmission)) return false;
  if (!inRange(listing.km, filters.kmMin, filters.kmMax)) return false;

  const filteringPrice = filters.priceMin.trim() !== "" || filters.priceMax.trim() !== "";
  if (listing.priceOnRequest) {
    if (filteringPrice) return false;
  } else {
    const price = listingPriceIn(listing, filters.priceCurrency, usdArs);
    if (!inRange(price, filters.priceMin, filters.priceMax)) return false;
  }

  return true;
}

export function countActiveFilters(filters: ListingFilters): number {
  let n = 0;
  if (filters.marcaId !== "all") n += 1;
  if (filters.year !== "all") n += 1;
  if (filters.fuel !== "all") n += 1;
  if (filters.location !== "all") n += 1;
  if (filters.transmission !== "all") n += 1;
  if (filters.priceMin.trim() || filters.priceMax.trim()) n += 1;
  if (filters.kmMin.trim() || filters.kmMax.trim()) n += 1;
  return n;
}
