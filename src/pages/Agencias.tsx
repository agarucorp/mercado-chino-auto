import { Layout } from "@/components/layout/Layout";
import { MARCAS } from "@/data/marcas";
import { buildRepresentantes, getMarcaNombre } from "@/lib/marcas";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const REPRESENTANTES = buildRepresentantes(MARCAS);

const Agencias = () => {
  return (
    <Layout>
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="type-h1 text-foreground mb-4">Agencias y representantes</h1>
            <p className="type-body text-muted-foreground prose-content">
              Empresas con representación oficial de marcas chinas en Argentina. Contactá a la
              agencia correspondiente para información de ventas y postventa.
            </p>
          </motion.div>

          <div className="space-y-4">
            {REPRESENTANTES.map((rep, index) => (
              <motion.div
                key={rep.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-card rounded-xl p-6 card-shadow"
              >
                <h2 className="type-h3 text-foreground">{rep.nombre}</h2>
                <p className="type-meta text-muted-foreground mt-1 tabular-nums">
                  {rep.marcaIds.length} marca{rep.marcaIds.length !== 1 ? "s" : ""} oficial
                  {rep.marcaIds.length !== 1 ? "es" : ""}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {rep.marcaIds.map((marcaId) => (
                    <Link
                      key={marcaId}
                      to={`/marcas/${marcaId}`}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {getMarcaNombre(MARCAS, marcaId)}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Agencias;
