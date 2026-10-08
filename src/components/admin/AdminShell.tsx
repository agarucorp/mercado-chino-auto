import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useAdminListings } from "@/hooks/useListings";
import { useUnseenSolicitudIds } from "@/lib/admin-solicitudes";
import { cn } from "@/lib/utils";
import { ClipboardList, LogOut, Menu, Newspaper, Car, MessageSquare, Wrench } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { data = [] } = useAdminListings(true);
  const pendingIds = data.filter((listing) => listing.status === "pendiente").map((listing) => listing.id);
  const unseen = useUnseenSolicitudIds(pendingIds);
  const solicitudesActive = location.pathname.startsWith("/admin/solicitudes");

  const items = [
    { to: "/admin/noticias", label: "Noticias", icon: Newspaper, badge: 0, active: false },
    { to: "/admin/repuestos", label: "Repuestos y talleres", icon: Wrench, badge: 0, active: false },
    { to: "/admin/resenas", label: "Reseñas", icon: MessageSquare, badge: 0, active: false },
    { to: "/admin/modelos", label: "Historial por modelo", icon: Car, badge: 0, active: false },
    {
      to: "/admin/solicitudes",
      label: "Solicitudes",
      icon: ClipboardList,
      badge: unseen.length,
      active: solicitudesActive,
    },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 type-body-sm transition-colors",
              isActive || item.active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex-1">{item.label}</span>
          {item.badge > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[11px] font-medium leading-none text-white">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function AdminShellInner({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.message("Sesión cerrada.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-60 border-r border-border bg-background px-4 py-6">
        <Link to="/admin/noticias" className="type-h3 text-foreground px-3 mb-8">
          Panel
        </Link>
        <NavItems />
        <div className="mt-auto pt-6 px-3">
          <p className="type-meta text-muted-foreground truncate">{user?.email}</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 h-8 px-0 type-meta"
            onClick={() => void handleSignOut()}
          >
            <LogOut className="h-4 w-4 mr-2" aria-hidden />
            Salir
          </Button>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="md:hidden sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-between">
          <p className="type-h3 text-foreground">Panel</p>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Administración</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <NavItems onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="px-4 py-8 md:px-10 md:py-10 max-w-5xl">{children}</div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <RequireAdmin>
      <AdminShellInner>{children}</AdminShellInner>
    </RequireAdmin>
  );
}
