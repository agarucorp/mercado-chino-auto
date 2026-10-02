import { AdminShell } from "@/components/admin/AdminShell";
import { StarRatingInput } from "@/components/reviews/StarRating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/data/reviews";
import { useAdminReviews, useReviewMutations } from "@/hooks/useReviews";
import type { ReviewPatch } from "@/lib/reviews-api";
import { Loader2, Pencil, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function AdminResenasInner() {
  const { data: reviews = [], isLoading, isError, error } = useAdminReviews();
  const { update, remove } = useReviewMutations();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Review | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Review | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((review) =>
      [review.brand, review.model, review.author, review.content].join(" ").toLowerCase().includes(q),
    );
  }, [query, reviews]);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const review = pendingDelete;
    setPendingDelete(null);
    remove.mutate(review.id, {
      onSuccess: () => toast.success("Reseña borrada."),
      onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo borrar."),
    });
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="type-h2 text-foreground">Reseñas</h1>
        <p className="type-body text-muted-foreground mt-1">
          Quien publica no tiene cuenta, así que solo desde acá se corrige o se saca una reseña.
        </p>
      </div>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por modelo, autor o texto"
        className="mb-6 max-w-md"
        aria-label="Buscar reseñas"
      />

      {isLoading && (
        <p className="type-body text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Cargando reseñas
        </p>
      )}

      {isError && (
        <p className="type-body text-destructive">
          {error instanceof Error ? error.message : "No se pudieron cargar las reseñas."}
        </p>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <p className="type-body text-muted-foreground">No hay reseñas para mostrar.</p>
      )}

      <ul className="space-y-3">
        {filtered.map((review) => (
          <li key={review.id} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="type-h3 text-base">
                  {review.brand} {review.model}
                  <span className="type-meta text-muted-foreground font-normal"> · {review.year}</span>
                </p>
                <p className="type-meta text-muted-foreground mt-1 flex items-center gap-1">
                  {review.author} · {review.date}
                  <Star className="w-3.5 h-3.5 fill-accent text-accent ml-1" aria-hidden />
                  {review.rating}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button type="button" variant="ghost" size="icon" aria-label="Editar reseña" onClick={() => setEditing(review)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Borrar reseña"
                  onClick={() => setPendingDelete(review)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="type-body text-muted-foreground mt-3 line-clamp-3">{review.content}</p>
          </li>
        ))}
      </ul>

      <ReviewEditorDialog
        review={editing}
        saving={update.isPending}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (!editing) return;
          update.mutate(
            { id: editing.id, patch },
            {
              onSuccess: () => {
                toast.success("Reseña actualizada.");
                setEditing(null);
              },
              onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo guardar."),
            },
          );
        }}
      />

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Borrar esta reseña?</AlertDialogTitle>
            <AlertDialogDescription>
              Deja de verse en la ficha del modelo. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Borrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}

function ReviewEditorDialog({
  review,
  saving,
  onClose,
  onSave,
}: {
  review: Review | null;
  saving: boolean;
  onClose: () => void;
  onSave: (patch: ReviewPatch) => void;
}) {
  return (
    <Dialog open={review !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        {review && (
          <EditorForm key={review.id} review={review} saving={saving} onClose={onClose} onSave={onSave} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditorForm({
  review,
  saving,
  onClose,
  onSave,
}: {
  review: Review;
  saving: boolean;
  onClose: () => void;
  onSave: (patch: ReviewPatch) => void;
}) {
  const [firstName, setFirstName] = useState(review.firstName ?? "");
  const [lastName, setLastName] = useState(review.lastName ?? "");
  const [year, setYear] = useState(String(review.year));
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return;
    }
    const parsedYear = Number(year);
    if (!parsedYear || parsedYear < 1990 || parsedYear > new Date().getFullYear() + 1) {
      setError("Ingresá un año válido.");
      return;
    }
    if (rating < 1) {
      setError("Elegí una calificación.");
      return;
    }
    if (content.trim().length < 20) {
      setError("El texto tiene que tener al menos 20 caracteres.");
      return;
    }
    setError(null);
    onSave({
      firstName,
      lastName,
      year: parsedYear,
      rating,
      content,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {review.brand} {review.model}
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="review-first">Nombre</Label>
            <Input id="review-first" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-last">Apellido</Label>
            <Input id="review-last" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-year">Año del vehículo</Label>
          <Input id="review-year" inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Calificación</Label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-content">Texto</Label>
          <Textarea id="review-content" rows={5} value={content} onChange={(event) => setContent(event.target.value)} />
        </div>
        {error && <p className="type-meta text-destructive">{error}</p>}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function AdminResenas() {
  return <AdminResenasInner />;
}
