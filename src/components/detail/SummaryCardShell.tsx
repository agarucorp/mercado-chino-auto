import { cn } from "@/lib/utils";
import { Heart, Share2 } from "lucide-react";
import type { ReactNode } from "react";

interface SummaryCardShellProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  showActions?: boolean;
}

export function SummaryCardShell({
  title,
  children,
  footer,
  className,
  showActions = true,
}: SummaryCardShellProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card p-5 md:p-6 space-y-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h1 className="type-h3 text-base sm:text-lg font-semibold leading-snug text-foreground uppercase">
          {title}
        </h1>
        {showActions && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              aria-label="Guardar en favoritos"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              aria-label="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {children}
      {footer && (
        <p className="type-meta text-muted-foreground text-center text-xs pt-1">{footer}</p>
      )}
    </div>
  );
}

interface SpecHighlightGridProps {
  items: { icon: ReactNode; label: string; value: string }[];
}

export function SpecHighlightGrid({ items }: SpecHighlightGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 py-4 border-y border-border">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-muted-foreground">{item.icon}</span>
          <span className="type-meta text-xs text-muted-foreground">{item.label}</span>
          <span className="type-numeric text-sm font-medium text-foreground leading-tight">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
