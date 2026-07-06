import { StarRatingInput } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatAuthorDisplay } from "@/lib/review-store";
import { useMemo, useState } from "react";

interface ReviewFormProps {
  brand: string;
  model: string;
  defaultYear?: number;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    year: number;
    rating: number;
    content: string;
  }) => void;
}

export function ReviewForm({ brand, model, defaultYear, onSubmit }: ReviewFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState(defaultYear?.toString() ?? new Date().getFullYear().toString());
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const previewName = useMemo(() => {
    if (!firstName.trim()) return null;
    return formatAuthorDisplay(firstName, lastName);
  }, [firstName, lastName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim()) {
      setError("Ingresá tu nombre.");
      return;
    }
    if (!lastName.trim()) {
      setError("Ingresá tu apellido.");
      return;
    }
    if (rating < 1) {
      setError("Seleccioná una calificación con estrellas.");
      return;
    }
    if (content.trim().length < 20) {
      setError("La reseña debe tener al menos 20 caracteres.");
      return;
    }

    const parsedYear = Number(year);
    if (!parsedYear || parsedYear < 1990 || parsedYear > new Date().getFullYear() + 1) {
      setError("Ingresá un año válido.");
      return;
    }

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      year: parsedYear,
      rating,
      content: content.trim(),
    });

    setFirstName("");
    setLastName("");
    setRating(0);
    setContent("");
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="type-h3 text-foreground">Escribí tu reseña</p>
        <p className="type-body-sm text-muted-foreground mt-1">
          Compartí tu experiencia con el {brand} {model}. Tu nombre se mostrará como nombre y
          primera letra del apellido.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="review-first-name">Nombre</Label>
          <Input
            id="review-first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ej: Carlos"
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-last-name">Apellido</Label>
          <Input
            id="review-last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Ej: Martínez"
            autoComplete="family-name"
          />
        </div>
      </div>

      {previewName && (
        <p className="type-body-sm text-muted-foreground">
          Se publicará como: <span className="font-medium text-foreground">{previewName}</span>
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="review-year">Año del vehículo</Label>
        <Input
          id="review-year"
          type="number"
          min={1990}
          max={new Date().getFullYear() + 1}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="max-w-[140px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Calificación</Label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-content">Tu experiencia</Label>
        <Textarea
          id="review-content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contanos sobre consumo, confort, service, equipamiento..."
          className="type-body resize-none"
        />
      </div>

      {error && <p className="type-body-sm text-destructive">{error}</p>}

      <Button type="submit" variant="default">
        Publicar reseña
      </Button>
    </form>
  );
}
