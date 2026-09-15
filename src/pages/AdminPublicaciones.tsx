import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  ADMIN_LISTINGS_KEY,
  APPROVED_LISTINGS_KEY,
  useAdminListings,
} from "@/hooks/useListings";
import { formatKm, formatPrice } from "@/data/listings";
import { reviewListing } from "@/lib/listings-api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function AdminPublicacionesInner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data = [], isLoading, isError, error } = useAdminListings(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const pendientes = data.filter((l) => l.status === "pendiente");
  const otros = data.filter((l) => l.status !== "pendiente");

  const decide = async (
    id: string,
    status: "aprobada" | "rechazada" | "pendiente",
  ) => {
    if (!user) return;
    setBusyId(id);
    try {
      await reviewListing({
        id,
        status,
        adminNotes: notes[id] ?? "",
        reviewerId: user.id,
      });
      await queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEY });
      await queryClient.invalidateQueries({ queryKey: APPROVED_LISTINGS_KEY });
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success(
        status === "aprobada"
          ? "Aviso publicado."
          : status === "rechazada"
            ? "Aviso rechazado."
            : "Nota guardada. El aviso sigue pendiente.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <h1 className="type-h1 text-foreground">Pedidos de publicación</h1>
          <p className="type-body text-muted-foreground mt-3">
            Aprobá para que el aviso salga en clasificados. Pedir cambios deja el pedido
            pendiente y guarda tu nota (el mail al vendedor usa Resend, cuando esté
            configurado).
          </p>

          {!isSupabaseConfigured && (
            <p className="type-body text-muted-foreground mt-8">
              Falta configurar Supabase en el entorno para ver pedidos reales.
            </p>
          )}

          {isLoading && (
            <div className="flex items-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando pedidos…
            </div>
          )}

          {isError && (
            <p role="alert" className="type-body text-muted-foreground py-16">
              {error instanceof Error ? error.message : "No se pudieron cargar los pedidos."}
            </p>
          )}

          {!isLoading && isSupabaseConfigured && pendientes.length === 0 && (
            <p className="type-body text-muted-foreground mt-10">
              No hay pedidos pendientes.
            </p>
          )}

          <ul className="space-y-6 mt-10">
            {pendientes.map((listing) => (
              <li key={listing.id} className="rounded-xl border border-border p-5 space-y-4">
                <div className="flex gap-4">
                  <div className="w-28 shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={listing.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="type-meta text-muted-foreground">Pendiente</p>
                    <h2 className="type-h3 text-foreground mt-1">
                      {listing.year} {listing.title}
                    </h2>
                    <p className="type-numeric font-semibold mt-1">
                      {formatPrice(listing.price, listing.currency ?? "ARS")}
                    </p>
                    <p className="type-meta text-muted-foreground mt-1">
                      {formatKm(listing.km)} · {listing.fuel} · {listing.location}
                    </p>
                    <p className="type-body-sm text-foreground mt-3">{listing.description}</p>
                    <p className="type-meta text-muted-foreground mt-3">
                      {listing.seller.name} · {listing.sellerEmail} · {listing.sellerPhone}
                    </p>
                  </div>
                </div>

                {listing.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {listing.images.slice(0, 8).map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="h-16 w-20 object-cover rounded-md bg-muted shrink-0"
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor={`notes-${listing.id}`}>Nota para el vendedor</Label>
                  <Textarea
                    id={`notes-${listing.id}`}
                    rows={3}
                    value={notes[listing.id] ?? listing.adminNotes ?? ""}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [listing.id]: e.target.value }))
                    }
                    placeholder="Ej. Faltan fotos del interior y del odómetro."
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={busyId === listing.id}
                    onClick={() => void decide(listing.id, "aprobada")}
                  >
                    Aprobar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busyId === listing.id}
                    onClick={() => void decide(listing.id, "pendiente")}
                  >
                    Pedir cambios
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={busyId === listing.id}
                    onClick={() => void decide(listing.id, "rechazada")}
                  >
                    Rechazar
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {otros.length > 0 && (
            <div className="mt-14">
              <h2 className="type-h2 text-foreground mb-4">Ya revisados</h2>
              <ul className="space-y-3">
                {otros.map((listing) => (
                  <li
                    key={listing.id}
                    className="rounded-lg border border-border px-4 py-3 flex items-baseline justify-between gap-3"
                  >
                    <div>
                      <p className="type-body-sm text-foreground">{listing.title}</p>
                      <p className="type-meta text-muted-foreground capitalize">
                        {listing.status}
                      </p>
                    </div>
                    {listing.status === "aprobada" && (
                      <Link
                        to={`/clasificados/${listing.id}`}
                        className="type-meta underline underline-offset-4"
                      >
                        Ver aviso
                      </Link>
                    )}
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
