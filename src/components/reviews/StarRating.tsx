import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
  className?: string;
}

export function StarRatingInput({
  value,
  onChange,
  size = "md",
  className,
}: StarRatingInputProps) {
  const starSize = size === "sm" ? "w-5 h-5" : "w-7 h-7";

  return (
    <div className={cn("flex gap-1", className)} role="group" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 rounded hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${star} estrella${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              starSize,
              star <= value ? "fill-accent text-accent" : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

interface StarRatingDisplayProps {
  rating: number;
  className?: string;
}

export function StarRatingDisplay({ rating, className }: StarRatingDisplayProps) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating ? "fill-accent text-accent" : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
