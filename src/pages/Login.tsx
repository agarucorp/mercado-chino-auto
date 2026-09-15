import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RedirectState {
  from?: string;
}

const Login = () => {
  const { session, isAdmin, loading, configured, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as RedirectState | null)?.from ?? "/admin";

  // Al quedar la sesión confirmada como admin, volvemos a donde venía.
  useEffect(() => {
    if (!loading && session && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [loading, session, isAdmin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const message = await signIn(email, password);

    setSubmitting(false);
    setPassword("");

    if (message) {
      setError(message);
      return;
    }

    toast.success("Sesión iniciada.");
  };

  if (!loading && session && isAdmin) {
    return <Navigate to={from} replace />;
  }

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-md">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border mb-6">
            <Lock className="h-5 w-5 text-foreground" aria-hidden />
          </div>

          <h1 className="type-h1 text-foreground">Acceso de administración</h1>
          <p className="type-body text-muted-foreground mt-3">
            Ingresá con las credenciales de administrador para editar el contenido del
            sitio.
          </p>

          {!configured && (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-border bg-muted/40 p-4 flex gap-3"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="type-body-sm text-foreground">Configuración incompleta</p>
                <p className="type-body-sm text-muted-foreground mt-1">
                  Faltan las credenciales de Supabase en el archivo <code>.env</code>.
                </p>
              </div>
            </div>
          )}

          {/* Sesión válida pero sin permisos: el email existe, no está en `admins`. */}
          {!loading && session && !isAdmin && (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-border bg-muted/40 p-4 space-y-3"
            >
              <p className="type-body-sm text-foreground">
                La cuenta <span className="font-medium">{session.user.email}</span> no
                tiene permisos de administrador.
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => void signOut()}>
                Cerrar sesión
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                disabled={!configured || submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Contraseña</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={!configured || submitting}
              />
            </div>

            {error && (
              <p role="alert" className="type-body-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={!configured || submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />}
              {submitting ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>

          <p className="type-meta text-muted-foreground mt-6">
            El sitio no tiene registro público. Este acceso es solo para la administración
            del contenido.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
