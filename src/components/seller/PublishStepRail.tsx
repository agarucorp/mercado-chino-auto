import { cn } from "@/lib/utils";
import {
  PUBLISH_STEPS,
  type ListingDraft,
  type PublishStepId,
  isStepComplete,
} from "@/lib/listing-draft";
import { Check } from "lucide-react";

interface PublishStepRailProps {
  activeStep: PublishStepId;
  draft: ListingDraft;
  onGoTo: (step: PublishStepId) => void;
}

export function PublishStepRail({ activeStep, draft, onGoTo }: PublishStepRailProps) {
  return (
    <nav aria-label="Progreso de publicación" className="space-y-0">
      {PUBLISH_STEPS.map((step, index) => {
        const done = isStepComplete(draft, step.id);
        const active = activeStep === step.id;
        const isLast = index === PUBLISH_STEPS.length - 1;

        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onGoTo(step.id)}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border type-meta transition-colors",
                  done && "border-foreground bg-foreground text-background",
                  active && !done && "border-foreground text-foreground",
                  !active && !done && "border-border text-muted-foreground",
                )}
                aria-current={active ? "step" : undefined}
                aria-label={`${step.title}${done ? " (completado)" : ""}`}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </button>
              {!isLast && (
                <div
                  className={cn(
                    "w-px flex-1 min-h-[2.5rem]",
                    done ? "bg-foreground" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => onGoTo(step.id)}
              className="pb-8 text-left min-w-0 pt-1"
            >
              <p
                className={cn(
                  "type-meta",
                  active || done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.short}
              </p>
              <p
                className={cn(
                  "type-body-sm mt-0.5",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
