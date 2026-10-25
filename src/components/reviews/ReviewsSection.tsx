import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { useReviews } from "@/hooks/useReviews";
import { visitorError } from "@/lib/visitor-error";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface ReviewsSectionProps {
  marcaId: string;
  modeloId: string;
  brand: string;
  model: string;
  defaultYear?: number;
}

export function ReviewsSection({
  marcaId,
  modeloId,
  brand,
  model,
  defaultYear,
}: ReviewsSectionProps) {
  const { toast } = useToast();
  const { reviews, likedMap, submitReview, likeReview, replyToReview } = useReviews(
    marcaId,
    modeloId,
  );

  const handleSubmit = (data: {
    firstName: string;
    lastName: string;
    year: number;
    rating: number;
    content: string;
  }) => {
    void submitReview({ ...data, brand, model })
      .then(() => {
        toast({
          title: "Reseña publicada",
          description: "Gracias por compartir tu experiencia.",
        });
      })
      .catch((err: unknown) => {
        console.error(err);
        toast({
          title: "No se pudo publicar",
          description: visitorError(err, "resena"),
          variant: "destructive",
        });
      });
  };

  const handleReply = (
    reviewId: string,
    data: { firstName: string; lastName: string; content: string },
  ) => {
    replyToReview(reviewId, data);
    toast({ title: "Respuesta publicada" });
  };

  return (
    <section id="resenas" className="scroll-mt-24">
      <div className="py-2 md:py-4">
        <h2 className="type-h2 text-foreground mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Reseñas de propietarios
        </h2>

        <div className="mb-8 pb-8 border-b border-border">
          <ReviewForm
            brand={brand}
            model={model}
            defaultYear={defaultYear}
            onSubmit={handleSubmit}
          />
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                liked={likedMap[review.id] ?? false}
                onLike={() => likeReview(review.id)}
                onReply={(data) => handleReply(review.id, data)}
              />
            ))}
          </div>
        ) : (
          <p className="type-body text-muted-foreground text-center py-6">
            Todavía no hay reseñas para este modelo. Sé el primero en publicar la tuya.
          </p>
        )}
      </div>
    </section>
  );
}
