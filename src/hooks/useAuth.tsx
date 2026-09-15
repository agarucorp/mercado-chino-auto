import type { Session, User } from "@supabase/supabase-js";
import {
  SUPABASE_MISSING_MESSAGE,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /**
   * Solo sirve para decidir qué mostrar. La autorización real la aplica RLS en
   * la base: si esto se falsea desde la consola, las queries igual fallan.
   */
  isAdmin: boolean;
  loading: boolean;
  configured: boolean;
  /** Devuelve el mensaje de error, o null si entró bien. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "Email not confirmed": "El usuario todavía no confirmó su email.",
  "Too many requests": "Demasiados intentos. Esperá un momento y probá de nuevo.",
};

function translateError(message: string): string {
  return ERROR_MESSAGES[message] ?? message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    let active = true;

    const applySession = async (next: Session | null) => {
      if (!active) return;
      setSession(next);

      if (!next) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Quién es admin lo decide la base, no un claim del token.
      const { data, error } = await client.rpc("is_admin");
      if (!active) return;

      setIsAdmin(!error && data === true);
      setLoading(false);
    };

    void client.auth.getSession().then(({ data }) => applySession(data.session));

    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      // supabase-js mantiene un lock mientras corre este callback: llamar a la
      // API desde adentro puede trabar la sesión. Lo diferimos un tick.
      setTimeout(() => void applySession(next), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return SUPABASE_MISSING_MESSAGE;

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return error ? translateError(error.message) : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setIsAdmin(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signOut,
    }),
    [session, isAdmin, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
