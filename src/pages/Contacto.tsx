import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contacto = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("El formulario de contacto estará activo próximamente.");
  };

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="type-h1 text-foreground mb-3">Contacto</h1>
            <p className="type-body text-muted-foreground prose-content mb-8">
              Escribinos por consultas sobre marcas, publicaciones o alianzas comerciales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                contacto@auchar.com.ar
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Buenos Aires, Argentina
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-card rounded-xl p-6 card-shadow border border-border">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea id="mensaje" rows={5} required />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Enviar mensaje
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contacto;
