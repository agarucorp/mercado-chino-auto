import { StarRatingDisplay } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Review, ReviewReply } from "@/data/reviews";
import { formatAuthorDisplay } from "@/lib/review-store";
import { cn } from "@/lib/utils";
import { Calendar, MessageCircle, ThumbsUp, User } from "lucide-react";
import { useMemo, useState } from "react";

interface ReviewCardProps {
  review: Review;
  liked: boolean;
  onLike: () => void;
  onReply: (data: { firstName: string; lastName: string; content: string }) => void;
}

function ReplyItem({ reply }: { reply: ReviewReply }) {
  return (
    <div className="pl-4 border-l-2 border-border ml-2 py-2">
      <div className="flex items-center gap-2 mb-1">
        <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="type-meta text-foreground">{reply.author}</span>
        <span className="type-meta text-muted-foreground">· {reply.date}</span>
      </div>
      <p className="type-body-sm text-muted-foreground">{reply.content}</p>
    </div>
  );
}

export function ReviewCard({ review, liked, onLike, onReply }: ReviewCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);

  const previewName = useMemo(() => {
    if (!firstName.trim()) return null;
    return formatAuthorDisplay(firstName, lastName);
  }, [firstName, lastName]);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setReplyError("Ingresá nombre y apellido.");
      return;
    }
    if (replyContent.trim().length < 5) {
      setReplyError("La respuesta debe tener al menos 5 caracteres.");
      return;
    }

    onReply({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      content: replyContent.trim(),
    });

    setFirstName("");
    setLastName("");
    setReplyContent("");
    setShowReplyForm(false);
  };

  return (
    <article className="rounded-lg p-5 bg-muted/20">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="type-h3 text-base">{review.author}</p>
          <p className="type-meta text-muted-foreground flex items-center gap-1 flex-wrap">
            <Calendar className="w-3 h-3 shrink-0" />
            {review.date} · {review.year}
          </p>
        </div>
      </div>

      <StarRatingDisplay rating={review.rating} className="mb-3" />
      <p className="type-body text-muted-foreground">{review.content}</p>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onLike}
          className={cn(
            "inline-flex items-center gap-1.5 type-meta transition-colors",
            liked ? "text-primary" : "text-muted-foreground hover:text-primary",
          )}
          aria-pressed={liked}
        >
          <ThumbsUp className={cn("w-4 h-4", liked && "fill-primary/20")} />
          {review.likes}
        </button>
        <button
          type="button"
          onClick={() => setShowReplyForm((v) => !v)}
          className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Responder
          {(review.replies?.length ?? 0) > 0 && (
            <span>({review.replies!.length})</span>
          )}
        </button>
      </div>

      {review.replies && review.replies.length > 0 && (
        <div className="mt-4 space-y-2">
          {review.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </div>
      )}

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-4 pt-4 border-t border-border space-y-3">
          <p className="type-meta text-muted-foreground">Tu respuesta</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`reply-fn-${review.id}`}>Nombre</Label>
              <Input
                id={`reply-fn-${review.id}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nombre"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`reply-ln-${review.id}`}>Apellido</Label>
              <Input
                id={`reply-ln-${review.id}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellido"
              />
            </div>
          </div>
          {previewName && (
            <p className="type-body-sm text-muted-foreground">
              Como: <span className="text-foreground">{previewName}</span>
            </p>
          )}
          <Textarea
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Escribí tu respuesta..."
            className="resize-none"
          />
          {replyError && <p className="type-body-sm text-destructive">{replyError}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Publicar respuesta
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </article>
  );
}
