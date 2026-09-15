import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AdminBar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdmin) return null;
  if (location.pathname.startsWith("/admin")) return null;

  const handleSignOut = async () => {
    await signOut();
    toast.message("Sesión cerrada.");
    navigate("/");
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] print:hidden">
      <div className="flex items-center gap-3 rounded-full border border-border bg-background/95 backdrop-blur px-4 py-2 shadow-lg">
        <span className="hidden sm:block type-meta text-muted-foreground max-w-[14rem] truncate">
          {user?.email}
        </span>
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-3 type-meta"
          onClick={() => navigate("/admin/noticias")}
        >
          Panel
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => void handleSignOut()}
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
