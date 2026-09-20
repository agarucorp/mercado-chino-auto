import { useEffect, useState } from "react";
import type { ListingReviewPatch } from "@/lib/listings-api";
import type { PlanId, SellerType } from "@/types/database";

const SEEN_KEY = "auchar-admin-seen-solicitudes";
const SEEN_EVENT = "auchar-solicitudes-seen";

export type SolicitudForm = {
  title: string;
  version: string;
  marcaId: string;
  modeloId: string;
  year: string;
  km: string;
  price: string;
  currency: "ARS" | "USD";
  fuel: string;
  transmission: string;
  location: string;
  province: string;
  description: string;
  plan: PlanId;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerType: SellerType;
  adminNotes: string;
};

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function getSeenSolicitudIds(): Set<string> {
  return new Set(readSeen());
}

export function markSolicitudSeen(id: string): void {
  const next = new Set(readSeen());
  next.add(id);
  localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
  window.dispatchEvent(new Event(SEEN_EVENT));
}

export function useSeenSolicitudIds(): Set<string> {
  const [seen, setSeen] = useState(getSeenSolicitudIds);

  useEffect(() => {
    const refresh = () => setSeen(getSeenSolicitudIds());
    window.addEventListener(SEEN_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SEEN_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return seen;
}

export function useUnseenSolicitudIds(ids: string[]): string[] {
  const seen = useSeenSolicitudIds();
  return ids.filter((id) => !seen.has(id));
}

export function getSolicitudFormIssues(form: SolicitudForm): string[] {
  const issues: string[] = [];
  if (form.title.trim().length < 8) issues.push("El título es demasiado corto.");
  if (!form.marcaId) issues.push("Falta la marca.");
  if (!form.modeloId) issues.push("Falta el modelo.");
  if (!/^\d{4}$/.test(form.year)) issues.push("El año no es válido.");
  if (!/^\d+$/.test(form.km)) issues.push("El kilometraje no es válido.");
  if (!/^\d+(\.\d+)?$/.test(form.price) || Number(form.price) <= 0) {
    issues.push("El precio no es válido.");
  }
  if (!form.fuel) issues.push("Falta el combustible.");
  if (!form.transmission) issues.push("Falta la transmisión.");
  if (!form.location.trim()) issues.push("Falta la localidad.");
  if (!form.province) issues.push("Falta la provincia.");
  if (form.description.trim().length < 20) issues.push("La descripción es demasiado corta.");
  if (!form.sellerName.trim()) issues.push("Falta el nombre del vendedor.");
  if (!form.sellerEmail.trim()) issues.push("Falta el email del vendedor.");
  if (!form.sellerPhone.trim()) issues.push("Falta el teléfono del vendedor.");
  return issues;
}

export function buildListingReviewPatch(form: SolicitudForm): ListingReviewPatch {
  return {
    title: form.title.trim(),
    version: form.version.trim() || null,
    marca_id: form.marcaId,
    modelo_id: form.modeloId,
    year: Number(form.year),
    km: Number(form.km),
    price: Number(form.price),
    currency: form.currency,
    fuel: form.fuel,
    transmission: form.transmission,
    location: form.location.trim(),
    province: form.province,
    description: form.description.trim(),
    plan: form.plan,
    seller_name: form.sellerName.trim(),
    seller_email: form.sellerEmail.trim(),
    seller_phone: form.sellerPhone.trim(),
    seller_type: form.sellerType,
  };
}
