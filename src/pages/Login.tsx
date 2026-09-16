import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

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
    }
  };

  if (!loading && session && isAdmin) {
    return <Navigate to={from} replace />;
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {!loading && session && !isAdmin ? (
          <Button type="button" variant="outline" className="w-full" onClick={() => void signOut()}>
            Cerrar sesión
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
        )}
      </div>
    </main>
  );
};

export default Login;
