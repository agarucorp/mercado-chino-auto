import { loadModelCatalog } from "@/lib/model-catalog-api";
import { useEffect, type ReactNode } from "react";

export function ModelCatalogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void loadModelCatalog();
  }, []);

  return children;
}
