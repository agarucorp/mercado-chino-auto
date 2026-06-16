import { MarcaHeader, MarcaModelosList } from "@/components/brands/MarcaModelosList";
import { Layout } from "@/components/layout/Layout";
import { MARCAS } from "@/data/marcas";
import { getMarcaBySlug } from "@/lib/marcas";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

const MarcaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const marca = slug ? getMarcaBySlug(MARCAS, slug) : undefined;

  if (!marca) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <MarcaHeader marca={marca} />

            <div>
              <h2 className="type-h2 text-foreground mb-6">Modelos</h2>
              <MarcaModelosList marca={marca} />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MarcaDetail;
