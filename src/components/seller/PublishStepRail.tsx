import { cn } from "@/lib/utils";
import {
  PUBLISH_STEPS,
  type ListingDraft,
  type PublishStepId,
  isStepComplete,
  isStepUnlocked,
} from "@/lib/listing-draft";
import { Check, Lock } from "lucide-react";

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
        const unlocked = isStepUnlocked(draft, step.id);
        const active = activeStep === step.id;
        const isLast = index === PUBLISH_STEPS.length - 1;

        const label = `${step.title}${
          done ? " (completado)" : unlocked ? "" : " (bloqueado)"
        }`;

        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onGoTo(step.id)}
                disabled={!unlocked}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border type-meta transition-colors",
                  done && "border-foreground bg-foreground text-background",
                  active && !done && "border-foreground text-foreground",
                  !active && !done && unlocked && "border-border text-muted-foreground",
                  !unlocked && "border-border text-muted-foreground/50 cursor-not-allowed",
                )}
                aria-current={active ? "step" : undefined}
                aria-label={label}
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : unlocked ? (
                  index + 1
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
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
              disabled={!unlocked}
              className={cn(
                "pb-8 text-left min-w-0 pt-1",
                !unlocked && "cursor-not-allowed",
              )}
              tabIndex={-1}
              aria-hidden
            >
              <p
                className={cn(
                  "type-meta",
                  active || done ? "text-foreground" : "text-muted-foreground",
                  !unlocked && "text-muted-foreground/50",
                )}
              >
                {step.short}
              </p>
              <p
                className={cn(
                  "type-body-sm mt-0.5",
                  active ? "text-foreground" : "text-muted-foreground",
                  !unlocked && "text-muted-foreground/50",
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
