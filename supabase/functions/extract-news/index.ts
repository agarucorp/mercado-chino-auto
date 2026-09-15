import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function meta(html: string, property: string): string | null {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return decode(match[1].trim());
  }
  return null;
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function strip(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hostName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !anonKey || !serviceKey) return json({ error: "misconfigured" }, 500);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: isAdmin, error: adminError } = await userClient.rpc("is_admin");
  if (adminError || !isAdmin) return json({ error: "forbidden" }, 403);

  let payload: { url?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const url = payload.url?.trim() ?? "";
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return json({ error: "invalid_url" }, 400);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return json({ error: "invalid_url" }, 400);
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("169.254.")
  ) {
    return json({ error: "blocked_host" }, 400);
  }

  const pageRes = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "MercadoChinoAutoBot/1.0" },
  });
  if (!pageRes.ok) return json({ error: `fetch_failed_${pageRes.status}` }, 502);
  const html = await pageRes.text();

  const title =
    meta(html, "og:title") ||
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
    "";
  const excerpt = meta(html, "og:description") || meta(html, "description") || "";
  const sourceName = meta(html, "og:site_name") || hostName(url);
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  const body = strip(articleMatch?.[0] ?? html).slice(0, 8000);

  let imageUrl: string | null = meta(html, "og:image") || meta(html, "twitter:image");
  if (imageUrl) {
    try {
      imageUrl = new URL(imageUrl, url).toString();
    } catch {
      imageUrl = null;
    }
  }

  if (imageUrl) {
    try {
      const imgRes = await fetch(imageUrl, { redirect: "follow" });
      if (imgRes.ok) {
        const bytes = new Uint8Array(await imgRes.arrayBuffer());
        if (bytes.byteLength > 0 && bytes.byteLength < 8_000_000) {
          const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
          const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
          const path = `${crypto.randomUUID()}.${ext}`;
          const admin = createClient(supabaseUrl, serviceKey);
          const { error: uploadError } = await admin.storage.from("news-images").upload(path, bytes, {
            contentType,
            upsert: false,
          });
          if (!uploadError) {
            imageUrl = admin.storage.from("news-images").getPublicUrl(path).data.publicUrl;
          }
        }
      }
    } catch {
      // keep remote og:image
    }
  }

  return json({
    title: decode(title),
    excerpt: decode(excerpt).slice(0, 400),
    body,
    imageUrl,
    sourceName,
    sourceUrl: url,
  });
});
