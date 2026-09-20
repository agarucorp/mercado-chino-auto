import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function secret(name: string): string {
  return (Deno.env.get(name) ?? "").trim().replace(/^["']|["']$/g, "");
}

const CONTACT_INBOX = "info.auchar@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendResend(
  to: string[],
  subject: string,
  html: string,
  replyTo?: string,
) {
  const apiKey = secret("RESEND_API_KEY");
  if (!apiKey) return { skipped: true as const, reason: "no_resend_key" };

  const from = secret("RESEND_FROM");
  if (!from) return { skipped: true as const, reason: "no_from" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`resend_${res.status}: ${detail}`);
  }
  return { skipped: false as const };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  // submitted solo necesita service role; anon puede faltar con keys nuevas
  if (!supabaseUrl || !serviceKey) return json({ error: "misconfigured" }, 500);

  let payload: {
    listingId?: string;
    event?: string;
    name?: string;
    email?: string;
    message?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const event = payload.event;

  if (event === "contact") {
    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const message = payload.message?.trim() ?? "";
    if (
      name.length < 2 ||
      name.length > 120 ||
      !EMAIL_RE.test(email) ||
      message.length < 10 ||
      message.length > 4000
    ) {
      return json({ error: "invalid_payload" }, 400);
    }

    const to = secret("CONTACT_NOTIFY_EMAIL") || CONTACT_INBOX;
    console.log("notify-contact", {
      hasKey: Boolean(secret("RESEND_API_KEY")),
      hasFrom: Boolean(secret("RESEND_FROM")),
      hasTo: Boolean(to),
    });

    try {
      const result = await sendResend(
        [to],
        `Contacto web: ${name}`,
        `<p>Llegó un mensaje desde el formulario de contacto.</p>
         <p><strong>${esc(name)}</strong> · ${esc(email)}</p>
         <p>${esc(message).replace(/\n/g, "<br>")}</p>`,
        email,
      );
      return json({ ok: true, ...result });
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : "send_failed" }, 502);
    }
  }

  const listingId = payload.listingId?.trim() ?? "";
  if (!listingId || (event !== "submitted" && event !== "reviewed")) {
    return json({ error: "invalid_payload" }, 400);
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: listing, error } = await admin
    .from("listings")
    .select("id, title, year, status, plan, seller_name, seller_email, seller_phone, admin_notes, submitted_at, created_at")
    .eq("id", listingId)
    .maybeSingle();

  if (error || !listing) return json({ error: "listing_not_found" }, 404);

  if (event === "submitted") {
    const created = new Date(listing.created_at as string).getTime();
    if (Date.now() - created > 15 * 60 * 1000) {
      return json({ error: "stale_listing" }, 403);
    }
    if (listing.status !== "pendiente") return json({ error: "unexpected_status" }, 409);
  } else {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401);
    if (!anonKey) return json({ error: "misconfigured_anon" }, 500);
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: isAdmin, error: adminError } = await userClient.rpc("is_admin");
    if (adminError || !isAdmin) return json({ error: "forbidden" }, 403);
  }

  console.log("notify-listing", event, listingId, {
    hasKey: Boolean(secret("RESEND_API_KEY")),
    hasFrom: Boolean(secret("RESEND_FROM")),
    hasTo: Boolean(secret("ADMIN_NOTIFY_EMAIL")),
  });

  const adminEmail = secret("ADMIN_NOTIFY_EMAIL");
  const siteUrl = secret("PUBLIC_SITE_URL") || "https://www.autosdechina.com.ar";
  const subject =
    event === "submitted"
      ? `Nueva solicitud: ${listing.year} ${listing.title}`
      : listing.status === "aprobada"
        ? `Tu aviso fue publicado: ${listing.title}`
        : `Hay cambios para tu aviso: ${listing.title}`;

  const html =
    event === "submitted"
      ? `<p>Entró una solicitud de aviso.</p>
         <p><strong>${esc(String(listing.year))} ${esc(String(listing.title))}</strong> · plan ${esc(String(listing.plan))}</p>
         <p>Vendedor: ${esc(String(listing.seller_name))} · ${esc(String(listing.seller_email))} · ${esc(String(listing.seller_phone))}</p>
         <p><a href="${esc(siteUrl)}/admin/solicitudes">Abrir solicitudes</a></p>`
      : `<p>Hola ${esc(String(listing.seller_name))},</p>
         <p>Estado: <strong>${esc(String(listing.status))}</strong></p>
         ${listing.admin_notes ? `<p>Comentario: ${esc(String(listing.admin_notes))}</p>` : ""}
         <p><a href="${esc(siteUrl)}/vender">Volvé al formulario</a> si hay que corregir algo.</p>`;

  const to =
    event === "submitted"
      ? adminEmail
        ? [adminEmail]
        : []
      : [listing.seller_email as string];

  if (to.length === 0) return json({ ok: true, skipped: true, reason: "no_recipient" });

  try {
    const result = await sendResend(to, subject, html);
    return json({ ok: true, ...result });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "send_failed" }, 502);
  }
});
