import type { Listing } from "@/data/listings";
import { LISTINGS_DATA, getListingById as getMockListingById } from "@/data/listings";
import {
  fetchAdminListingById,
  fetchAdminListings,
  fetchApprovedListings,
  fetchListingById,
  type AdminListing,
} from "@/lib/listings-api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const APPROVED_LISTINGS_KEY = ["listings", "aprobada"] as const;
export const ADMIN_LISTINGS_KEY = ["listings", "admin"] as const;

export function useApprovedListings() {
  return useQuery<Listing[]>({
    queryKey: APPROVED_LISTINGS_KEY,
    queryFn: async () => {
      if (!isSupabaseConfigured) return LISTINGS_DATA;
      try {
        return await fetchApprovedListings();
      } catch {
        return LISTINGS_DATA;
      }
    },
    staleTime: 60_000,
  });
}

export function useListing(id: string | undefined) {
  return useQuery<Listing | null>({
    queryKey: ["listings", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return null;
      if (isSupabaseConfigured) {
        try {
          const live = await fetchListingById(id);
          if (live) return live;
        } catch {
          // Si la base no responde, el set estático cubre ids de demo.
        }
      }
      return getMockListingById(id) ?? null;
    },
  });
}

export function useAdminListings(enabled: boolean) {
  return useQuery<AdminListing[]>({
    queryKey: ADMIN_LISTINGS_KEY,
    enabled: enabled && isSupabaseConfigured,
    queryFn: fetchAdminListings,
    refetchInterval: 20_000,
  });
}

export function useAdminListing(id: string | undefined) {
  return useQuery<AdminListing | null>({
    queryKey: [...ADMIN_LISTINGS_KEY, id],
    enabled: Boolean(id) && isSupabaseConfigured,
    queryFn: () => fetchAdminListingById(id!),
  });
}
