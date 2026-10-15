import { AdminShell } from "@/components/admin/AdminShell";
import { NuevaPublicacionDialog } from "@/components/admin/NuevaPublicacionDialog";
import { Button } from "@/components/ui/button";
import { formatKm, formatListingPrice } from "@/data/listings";
import { useUnseenSolicitudIds } from "@/lib/admin-solicitudes";
import { ADMIN_LISTINGS_KEY, APPROVED_LISTINGS_KEY, useAdminListings } from "@/hooks/useListings";
import { setHomePick, setWeeklyPick, type AdminListing } from "@/lib/listings-api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Loader2, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function DestacadosHome({ aprobadas }: { aprobadas: AdminListing[] }) {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEY }),
      queryClient.invalidateQueries({ queryKey: APPROVED_LISTINGS_KEY }),
    ]);

  const toggleWeekly = async (listing: AdminListing) => {
    setBusyId(listing.id);
    try {
      await setWeeklyPick(listing.id, !listing.isWeeklyPick);
      await invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setBusyId(null);
    }
  };

  const togglePick = async (listing: AdminListing) => {
    const currentPicks = aprobadas.filter((l) => l.homePickOrder != null).length;
    if (listing.homePickOrder == null && currentPicks >= 3) {
      toast.error('Ya hay 3 elegidos para "Los más vistos". Sacá uno antes de sumar otro.');
      return;
    }

    setBusyId(listing.id);
    try {
      if (listing.homePickOrder != null) {
        await setHomePick(listing.id, null);
      } else {
        const used = new Set(aprobadas.map((l) => l.homePickOrder).filter(Boolean));
        const nextSlot = [1, 2, 3].find((n) => !used.has(n)) ?? 1;
        await setHomePick(listing.id, nextSlot);
      }
      await invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setBusyId(null);
    }
  };

  if (aprobadas.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 className="type-h2 text-foreground mb-2">Destacados en la home</h2>
      <p className="type-body text-muted-foreground mb-4 max-w-2xl">
        El carrusel de Vehículo de la semana muestra los avisos con plan Premium y los que marques acá. Si pasás uno a Básico y no está marcado, sale del carrusel. Hasta 3 avisos van a "Los más vistos".
      </p>
      <ul className="space-y-2">
        {aprobadas.map((listing) => (
          <li
            key={listing.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
          >
            <div className="w-16 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
              <img src={listing.image} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="type-body-sm text-foreground flex-1 min-w-[10rem] truncate">
              {listing.year} {listing.title}
              <span className="type-meta text-muted-foreground ml-2 capitalize">{listing.plan}</span>
            </p>
            <Button
              type="button"
              size="sm"
              variant={listing.isWeeklyPick ? "default" : "outline"}
              disabled={busyId === listing.id}
              onClick={() => void toggleWeekly(listing)}
            >
              <Star className="h-3.5 w-3.5 mr-1.5" aria-hidden />
              De la semana
            </Button>
            <Button
              type="button"
              size="sm"
              variant={listing.homePickOrder != null ? "default" : "outline"}
              disabled={busyId === listing.id}
              onClick={() => void togglePick(listing)}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" aria-hidden />
              Más vistos{listing.homePickOrder != null ? ` #${listing.homePickOrder}` : ""}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPublicacionesInner() {
  const { data = [], isLoading, isError, error } = useAdminListings(true);
  const pendientes = data.filter((l) => l.status === "pendiente");
  const otros = data.filter((l) => l.status !== "pendiente");
  const aprobadas = data.filter((l) => l.status === "aprobada");
  const nuevas = useUnseenSolicitudIds(pendientes.map((l) => l.id));
  const nuevasSet = new Set(nuevas);
  const [nuevaOpen, setNuevaOpen] = useState(false);

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
        <Button type="button" className="shrink-0" onClick={() => setNuevaOpen(true)}>
          <Plus className="h-4 w-4 mr-2" aria-hidden />
          Cargar publicación
        </Button>
      </div>

      <NuevaPublicacionDialog open={nuevaOpen} onOpenChange={setNuevaOpen} />

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
                    {formatListingPrice(listing)}
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
                  <p className="type-meta text-muted-foreground capitalize">
                    {listing.sold ? "vendido" : listing.status}
                  </p>
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

      <DestacadosHome aprobadas={aprobadas} />
    </>
  );
}

const AdminPublicaciones = () => (
  <AdminShell>
    <AdminPublicacionesInner />
  </AdminShell>
);

export default AdminPublicaciones;
