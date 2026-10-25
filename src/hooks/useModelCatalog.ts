import { getCatalogSnapshot, subscribeModelCatalog } from "@/lib/model-catalog";
import { useSyncExternalStore } from "react";

export function useCatalogSnapshot() {
  return useSyncExternalStore(subscribeModelCatalog, getCatalogSnapshot, getCatalogSnapshot);
}
