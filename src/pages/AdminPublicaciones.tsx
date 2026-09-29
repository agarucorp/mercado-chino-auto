import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { formatKm, formatPrice } from "@/data/listings";
import { useUnseenSolicitudIds } from "@/lib/admin-solicitudes";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useAdminListings } from "@/hooks/useListings";
import { Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function AdminPublicacionesInner() {
  const { data = [], isLoading, isError, error } = useAdminListings(true);
  const pendientes = data.filter((l) => l.status === "pendiente");
  const otros = data.filter((l) => l.status !== "pendiente");
  const nuevas = useUnseenSolicitudIds(pendientes.map((l) => l.id));
  const nuevasSet = new Set(nuevas);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="type-h1 text-foreground">Solicitudes</h1>
          <p className="type-body text-muted-foreground mt-3 max-w-2xl">
            Pedidos de publicación enviados desde Vender. Revisá los datos, completá lo que
            falte y aprobá para que el aviso salga en clasificados.
          </p>
        </div>
        <Button type="button" asChild className="shrink-0">
          <Link to="/admin/solicitudes/nueva">
            <Plus className="h-4 w-4 mr-2" aria-hidden />
            Cargar publicación
          </Link>
        </Button>
      </div>

      {nuevas.length > 0 && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-amber-500/50 bg-amber-50 px-4 py-3 type-body-sm text-amber-950"
        >
          Hay {nuevas.length} solicitud{nuevas.length === 1 ? "" : "es"} nueva
          {nuevas.length === 1 ? "" : "s"} sin revisar.
        </p>
      )}

      {!isSupabaseConfigured && (
        <p className="type-body text-muted-foreground mt-8">
          Falta configurar Supabase en el entorno para ver solicitudes reales.
        </p>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          Cargando solicitudes…
        </div>
      )}

      {isError && (
        <p role="alert" className="type-body text-muted-foreground py-16">
          {error instanceof Error ? error.message : "No se pudieron cargar las solicitudes."}
        </p>
      )}

      {!isLoading && isSupabaseConfigured && pendientes.length === 0 && (
        <p className="type-body text-muted-foreground mt-10">No hay solicitudes pendientes.</p>
      )}

      <ul className="space-y-4 mt-10">
        {pendientes.map((listing) => {
          const isNew = nuevasSet.has(listing.id);
          return (
            <li key={listing.id}>
              <Link
                to={`/admin/solicitudes/${listing.id}`}
                className={cn(
                  "flex gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/40",
                  isNew ? "border-amber-500 bg-amber-50/70" : "border-border",
                )}
              >
                <div className="w-28 shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  <img src={listing.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="type-meta text-muted-foreground">Pendiente</p>
                    {isNew && (
                      <span className="type-meta rounded-full bg-amber-500 px-2 py-0.5 text-white">
                        Nueva
                      </span>
                    )}
                  </div>
                  <h2 className="type-h3 text-foreground mt-1">
                    {listing.year} {listing.title}
                  </h2>
                  <p className="type-numeric font-semibold mt-1">
                    {formatPrice(listing.price, listing.currency ?? "ARS")}
                  </p>
                  <p className="type-meta text-muted-foreground mt-1">
                    {formatKm(listing.km)} · {listing.fuel} · {listing.location}
                  </p>
                  <p className="type-meta text-muted-foreground mt-2">
                    {listing.seller.name} · {listing.sellerEmail}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {otros.length > 0 && (
        <div className="mt-14">
          <h2 className="type-h2 text-foreground mb-4">Ya revisadas</h2>
          <ul className="space-y-3">
            {otros.map((listing) => (
              <li
                key={listing.id}
                className="rounded-lg border border-border px-4 py-3 flex items-baseline justify-between gap-3"
              >
                <div>
                  <p className="type-body-sm text-foreground">{listing.title}</p>
                  <p className="type-meta text-muted-foreground capitalize">{listing.status}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/admin/solicitudes/${listing.id}`}
                    className="type-meta underline underline-offset-4"
                  >
                    Ver
                  </Link>
                  {listing.status === "aprobada" && (
                    <Link
                      to={`/clasificados/${listing.id}`}
                      className="type-meta underline underline-offset-4"
                    >
                      Clasificados
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

const AdminPublicaciones = () => (
  <AdminShell>
    <AdminPublicacionesInner />
  </AdminShell>
);

export default AdminPublicaciones;
