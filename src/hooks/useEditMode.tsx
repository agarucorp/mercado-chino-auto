import { useAuth } from "@/hooks/useAuth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface EditModeContextValue {
  /** true solo si además de estar activado, quien mira es admin. */
  editMode: boolean;
  /** Si mostrar el control para activarlo. */
  canEdit: boolean;
  setEditMode: (on: boolean) => void;
  toggle: () => void;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

const STORAGE_KEY = "auchar-edit-mode";

export function EditModeProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const [enabled, setEnabled] = useState(false);

  // Recordamos la preferencia para que navegar entre páginas no lo apague.
  useEffect(() => {
    if (!isAdmin) return;
    try {
      setEnabled(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // sessionStorage bloqueado: arranca apagado, sin romper nada.
    }
  }, [isAdmin]);

  const setEditMode = useCallback((on: boolean) => {
    setEnabled(on);
    try {
      sessionStorage.setItem(STORAGE_KEY, on ? "1" : "0");
    } catch {
      // Sin persistencia el modo igual funciona en esta página.
    }
  }, []);

  const value = useMemo<EditModeContextValue>(
    () => ({
      // Dejar de ser admin apaga el modo aunque el flag local siga en true.
      editMode: isAdmin && enabled,
      canEdit: isAdmin,
      setEditMode,
      toggle: () => setEditMode(!enabled),
    }),
    [isAdmin, enabled, setEditMode],
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): EditModeContextValue {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode debe usarse dentro de <EditModeProvider>");
  return ctx;
}
