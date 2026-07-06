import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Car, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Vender = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8" />
            </div>
            <h1 className="type-h1 text-foreground mb-4">Vendé tu vehículo</h1>
            <p className="type-body text-muted-foreground prose-content mx-auto mb-8">
              Publicá tu auto chino en AUCHAR y llegá a compradores interesados en el mercado
              argentino. Próximamente podrás crear tu aviso desde aquí.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/clasificados">
                  <Car className="w-4 h-4 mr-2" />
                  Ver clasificados
                </Link>
              </Button>
              <Button variant="outline" disabled>
                Publicar aviso (próximamente)
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Vender;
