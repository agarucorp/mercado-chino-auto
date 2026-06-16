import { getMarcaIniciales, getMarcaLogoUrl } from "@/data/marca-logos";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MarcaLogoProps {
  marcaId: string;
  nombre: string;
  className?: string;
  imageClassName?: string;
}

export function MarcaLogo({ marcaId, nombre, className, imageClassName }: MarcaLogoProps) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getMarcaLogoUrl(marcaId);
  const iniciales = getMarcaIniciales(nombre);

  if (!logoUrl || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted text-muted-foreground font-sans font-semibold tabular-nums select-none",
          className,
        )}
        aria-label={`Logo de ${nombre}`}
      >
        <span className="text-sm sm:text-base">{iniciales}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img
        src={logoUrl}
        alt={`Logo ${nombre}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn("max-h-full max-w-full object-contain", imageClassName)}
      />
    </div>
  );
}
