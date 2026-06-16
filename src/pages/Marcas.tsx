import { MarcaLogo } from "@/components/brands/MarcaLogo";
import { Layout } from "@/components/layout/Layout";
import { MARCAS } from "@/data/marcas";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MARCAS_ORDENADAS = [...MARCAS].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es"),
);

const Marcas = () => {
  return (
    <Layout>
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="type-h1 text-foreground mb-2">Todas las marcas</h1>
            <p className="type-body text-muted-foreground">
              {MARCAS.length} marcas con presencia oficial en Argentina
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {MARCAS_ORDENADAS.map((marca, index) => (
              <motion.div
                key={marca.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
              >
                <Link
                  to={`/marcas/${marca.slug}`}
                  className="flex flex-col items-center gap-2.5 group"
                >
                  <div className="w-full aspect-square rounded-xl border border-border bg-card flex items-center justify-center p-4 transition-all group-hover:border-primary/30 group-hover:shadow-sm">
                    <MarcaLogo
                      marcaId={marca.id}
                      nombre={marca.nombre}
                      className="w-full h-full"
                      imageClassName="max-h-12"
                    />
                  </div>
                  <span className="type-meta text-center text-foreground/80 group-hover:text-primary transition-colors">
                    {marca.nombre}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Marcas;
