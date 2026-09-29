import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_INBOX, getContactIssues, submitContact } from "@/lib/contact-api";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const issues = getContactIssues({ name, email, message });
    if (issues.length > 0) {
      toast.error(
        issues.length === 1 ? issues[0] : `Faltan ${issues.length} datos en el formulario.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitContact({ name, email, message });
      if (result.mailSent) {
        toast.success("Mensaje enviado. Te respondemos a la brevedad.");
        setName("");
        setEmail("");
        setMessage("");
        return;
      }
      toast.error(
        result.mailError
          ? `No se pudo enviar el mensaje (${result.mailError}).`
          : "No se pudo enviar el mensaje.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar el mensaje.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="border-t border-border bg-background py-12 md:py-16">
      <div className="container mx-auto">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 items-start">
          <div>
            <h2 className="type-h2 text-foreground">Contacto</h2>
            <p className="type-body text-muted-foreground mt-3 max-w-md">
              Escribinos por consultas sobre marcas, publicaciones o alianzas comerciales.
            </p>
            <div className="mt-8 space-y-1.5">
              <p className="type-body text-muted-foreground inline-flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-foreground" />
                <a
                  href={`mailto:${CONTACT_INBOX}`}
                  className="hover:text-foreground transition-colors"
                >
                  {CONTACT_INBOX}
                </a>
              </p>
              <p className="type-meta text-muted-foreground pl-6">Buenos Aires, Argentina</p>
            </div>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contacto-nombre">Nombre</Label>
              <Input
                id="contacto-nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto-email">Email</Label>
              <Input
                id="contacto-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto-mensaje">Mensaje</Label>
              <Textarea
                id="contacto-mensaje"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="resize-none"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />}
              {submitting ? "Enviando…" : "Enviar mensaje"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
