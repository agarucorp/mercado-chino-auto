import { Layout } from "@/components/layout/Layout";
import { NewsGrid } from "@/components/news/NewsGrid";
import { NEWS_DATA } from "@/data/news";
import { motion } from "framer-motion";

const Noticias = () => {
  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="type-h1 text-foreground mb-2">Noticias</h1>
            <p className="type-body text-muted-foreground prose-content">
              Las novedades más recientes del mercado automotriz chino en Argentina
            </p>
          </motion.div>
          <NewsGrid news={NEWS_DATA} />
        </div>
      </section>
    </Layout>
  );
};

export default Noticias;
