import { NewsCard, type NewsArticle } from "@/components/news/NewsCard";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, Pencil, X } from "lucide-react";

interface SortableNewsCardProps {
  article: NewsArticle;
  onDelete: (article: NewsArticle) => void;
  onEdit: (article: NewsArticle) => void;
  onMove: (article: NewsArticle, direction: -1 | 1) => void;
  isFirst: boolean;
  isLast: boolean;
}

const stopDrag = (e: React.PointerEvent) => e.stopPropagation();

export function SortableNewsCard({
  article,
  onDelete,
  onEdit,
  onMove,
  isFirst,
  isLast,
}: SortableNewsCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: article.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative rounded-lg touch-none",
        isDragging && "z-50 opacity-80 ring-2 ring-foreground",
      )}
      {...attributes}
      {...listeners}
    >
      <div className="pointer-events-none select-none">
        <NewsCard {...article} />
      </div>

      {article.published === false && (
        <span className="absolute left-2 bottom-2 type-meta rounded-full border border-border bg-background/95 px-2 py-0.5">
          Oculta
        </span>
      )}

      <div className="absolute right-2 top-2 flex gap-1.5 pointer-events-auto">
        <button
          type="button"
          onPointerDown={stopDrag}
          disabled={isFirst}
          onClick={() => onMove(article, -1)}
          className="rounded-full border border-border bg-background/95 p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
          aria-label="Subir importancia"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onPointerDown={stopDrag}
          disabled={isLast}
          onClick={() => onMove(article, 1)}
          className="rounded-full border border-border bg-background/95 p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
          aria-label="Bajar importancia"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onPointerDown={stopDrag}
          onClick={() => onEdit(article)}
          className="rounded-full border border-border bg-background/95 p-1.5 text-muted-foreground hover:text-foreground"
          aria-label={`Editar «${article.title}»`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onPointerDown={stopDrag}
          onClick={() => onDelete(article)}
          className="rounded-full border border-border bg-background/95 p-1.5 text-muted-foreground hover:text-destructive"
          aria-label={`Eliminar «${article.title}»`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        className="absolute left-2 top-2 rounded-full border border-border bg-background/95 p-1.5 text-muted-foreground"
        aria-hidden
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
