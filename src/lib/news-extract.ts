export interface ExtractedNews {
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string | null;
  sourceName: string | null;
  sourceUrl: string;
}

const TITLE_ATTR =
  /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i;
const TITLE_ATTR_REV =
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i;
const DESC_ATTR =
  /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i;
const DESC_NAME =
  /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i;
const IMAGE_ATTR =
  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i;
const SITE_ATTR =
  /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["'][^>]*>/i;
const TITLE_TAG = /<title[^>]*>([^<]+)<\/title>/i;

function decodeEntities(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(html: string, ...patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return decodeEntities(match[1]);
  }
  return null;
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

/** Extrae titular, bajada, cuerpo e imagen de HTML crudo (og: + article/p). */
export function extractFromHtml(html: string, sourceUrl: string): ExtractedNews {
  const title =
    pick(html, TITLE_ATTR, TITLE_ATTR_REV, TITLE_TAG) ?? "Sin título";
  const excerpt =
    pick(html, DESC_ATTR, DESC_NAME) ?? stripTags(html).slice(0, 220);
  const imageUrl = pick(html, IMAGE_ATTR);
  const sourceName = pick(html, SITE_ATTR) ?? hostnameOf(sourceUrl);

  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? html;
  const paragraphs = [...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter((p) => p.length > 40)
    .slice(0, 16);

  const body = paragraphs.join("\n\n") || excerpt;

  return {
    title,
    excerpt: excerpt.slice(0, 400),
    body,
    imageUrl,
    sourceName,
    sourceUrl,
  };
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Parsea la respuesta de r.jina.ai (markdown con encabezado Title/URL Source). */
export function extractFromJina(markdown: string, sourceUrl: string): ExtractedNews {
  const title =
    markdown.match(/^Title:\s*(.+)$/m)?.[1]?.trim() ||
    markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    "Sin título";
  const sourceName =
    markdown.match(/^URL Source:\s*https?:\/\/([^/\s]+)/m)?.[1]?.replace(/^www\./, "") ??
    hostnameOf(sourceUrl);

  const imageUrl =
    markdown.match(/!\[[^\]]*]\((https?:\/\/[^)\s]+)\)/)?.[1] ?? null;

  const contentIndex = markdown.search(/^Markdown Content:\s*$/m);
  const content =
    contentIndex >= 0
      ? markdown.slice(contentIndex).replace(/^Markdown Content:\s*/m, "")
      : markdown;
  const withoutTitle = content.replace(/^#\s+.+\n+/, "").trim();
  const body = withoutTitle.replace(/!\[[^\]]*]\([^)]+\)/g, "").trim();
  const excerpt = body.split(/\n+/)[0]?.slice(0, 280) || title;

  return {
    title,
    excerpt,
    body: body || excerpt,
    imageUrl,
    sourceName,
    sourceUrl,
  };
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
