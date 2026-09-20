import { isSupabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_INBOX = "info.auchar@gmail.com";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export function getContactIssues(payload: ContactPayload): string[] {
  const missing: string[] = [];
  if (payload.name.trim().length < 2) missing.push("Nombre");
  if (!EMAIL_RE.test(payload.email.trim())) missing.push("Email válido");
  if (payload.message.trim().length < 10) {
    missing.push("Mensaje de al menos 10 caracteres");
  }
  return missing;
}

export async function submitContact(
  payload: ContactPayload,
): Promise<{ mailSent: boolean; mailError?: string }> {
  if (!isSupabaseConfigured) {
    return { mailSent: false, mailError: "supabase_missing" };
  }

  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  const res = await fetch(`${url}/functions/v1/notify-listing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
    },
    body: JSON.stringify({
      event: "contact",
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    skipped?: boolean;
    reason?: string;
  };

  if (!res.ok) {
    const mailError =
      typeof body.error === "string" ? body.error : `notify_contact_${res.status}`;
    console.error("notify-contact", mailError);
    return { mailSent: false, mailError };
  }

  if (body.skipped) {
    return { mailSent: false, mailError: body.reason ?? "skipped" };
  }

  return { mailSent: true };
}
