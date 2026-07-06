import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("El formulario de contacto estará activo próximamente.");
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
            <div className="mt-8 space-y-3">
              <p className="type-body text-muted-foreground inline-flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-foreground" />
                contacto@auchar.com.ar
              </p>
              <p className="type-body text-muted-foreground inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-foreground" />
                Buenos Aires, Argentina
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contacto-nombre">Nombre</Label>
              <Input id="contacto-nombre" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto-email">Email</Label>
              <Input id="contacto-email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contacto-mensaje">Mensaje</Label>
              <Textarea id="contacto-mensaje" rows={4} required className="resize-none" />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Enviar mensaje
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
