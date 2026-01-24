import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="bg-accent py-4">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <p className="text-accent-foreground text-sm md:text-base font-medium">
            🚗 El portal #1 de autos chinos en Argentina
          </p>
          <div className="flex items-center gap-4 text-accent-foreground/80 text-xs md:text-sm">
            <span><strong className="text-primary">15+</strong> Marcas</span>
            <span className="hidden sm:inline">•</span>
            <span><strong className="text-primary">500+</strong> Vehículos</span>
            <span className="hidden sm:inline">•</span>
            <span><strong className="text-primary">10K+</strong> Usuarios</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
