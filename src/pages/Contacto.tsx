import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Contacto = () => {
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="type-h1 text-foreground mb-3">Contacto</h1>
            <p className="type-body text-muted-foreground max-w-lg mx-auto">
              El formulario de contacto está al final de cada página. Podés escribirnos desde ahí o
              volver al inicio.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href="#contacto">Ir al formulario</a>
              </Button>
              <Button asChild>
                <Link to="/">Volver al inicio</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contacto;
