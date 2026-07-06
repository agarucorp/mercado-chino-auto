import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const NAV_TOP = 80;

interface DetailStickyAsideProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sidebar fija en desktop (≥1024px).
 * Usa position:fixed al scrollear para comportamiento fiable en todos los navegadores.
 */
export function DetailStickyAside({ children, className }: DetailStickyAsideProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardStyle, setCardStyle] = useState<CSSProperties>({});

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      const track = trackRef.current;
      const card = cardRef.current;

      if (!mq.matches || !track || !card) {
        setCardStyle({});
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const cardHeight = card.offsetHeight;
      const trackTop = window.scrollY + trackRect.top;
      const trackBottom = trackTop + track.offsetHeight;
      const width = trackRect.width;
      const left = trackRect.left;

      const scrollY = window.scrollY;
      const pinTop = scrollY + NAV_TOP;

      if (pinTop <= trackTop) {
        setCardStyle({ width });
        return;
      }

      if (pinTop + cardHeight >= trackBottom) {
        setCardStyle({
          position: "absolute",
          top: track.offsetHeight - cardHeight,
          left: 0,
          width,
        });
        return;
      }

      setCardStyle({
        position: "fixed",
        top: NAV_TOP,
        left,
        width,
        zIndex: 20,
      });
    };

    update();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro && trackRef.current) ro.observe(trackRef.current);
    if (ro && cardRef.current) ro.observe(cardRef.current);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);

    return () => {
      ro?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  return (
    <aside className={cn("hidden lg:block w-full h-full min-h-0", className)}>
      <div ref={trackRef} className="relative h-full w-full">
        <div ref={cardRef} style={cardStyle}>
          {children}
        </div>
      </div>
    </aside>
  );
}

export function DetailMobileAside({ children }: { children: ReactNode }) {
  return <div className="lg:hidden">{children}</div>;
}

interface DetailPageGridProps {
  children: ReactNode;
  sidebar: ReactNode;
  className?: string;
}

export function DetailPageGrid({ children, sidebar, className }: DetailPageGridProps) {
  return (
    <div
      className={cn(
        "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:gap-8",
        className,
      )}
    >
      <div className="space-y-8 min-w-0">{children}</div>
      {sidebar}
    </div>
  );
}
