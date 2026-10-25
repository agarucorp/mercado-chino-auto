type VisitorArea = "publicar" | "contacto" | "resena" | "noticias" | "repuestos";

const TECHNICAL =
  /schema cache|row-level|violates|constraint|PGRST|duplicate key|jwt|permission denied|column |relation |function public|notify_listing|failed to fetch|network|storage|bucket|supabase|postgres|\bsql\b/i;

/** Mensaje para quien no administra el sitio. El detalle técnico queda en la consola. */
export function visitorError(err: unknown, area: VisitorArea): string {
  const raw = err instanceof Error ? err.message : "";

  if (raw && !TECHNICAL.test(raw)) return raw;

  const text = raw.toLowerCase();
  if (/failed to fetch|network|load failed|offline/.test(text)) {
    return "No hay conexión.";
  }
  if (area === "publicar" && /foto|image|storage|bucket|listing_images/.test(text)) {
    return "No se pudieron guardar las fotos.";
  }
  if (area === "publicar" && /check constraint|price|email|year|kilomet/.test(text)) {
    return "El precio, el año o el email no se pudo guardar.";
  }

  switch (area) {
    case "publicar":
      return "No se pudo enviar la solicitud.";
    case "contacto":
      return "No se pudo enviar el mensaje.";
    case "resena":
      return "No se pudo publicar la reseña.";
    case "noticias":
      return "No se pudieron cargar las noticias.";
    case "repuestos":
      return "No se pudieron cargar los proveedores.";
  }
}
