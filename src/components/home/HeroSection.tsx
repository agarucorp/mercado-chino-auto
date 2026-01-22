import { motion } from "framer-motion";
import { TrendingUp, Car, Users } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "15+", label: "Marcas Chinas" },
  { icon: Car, value: "500+", label: "Vehículos Listados" },
  { icon: Users, value: "10K+", label: "Usuarios Activos" },
];

export const HeroSection = () => {
  return (
    <section className="relative hero-bg py-12 md:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full mb-6">
              🚗 El portal #1 de autos chinos en Argentina
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight"
          >
            Noticias, Reseñas y{" "}
            <span className="text-gradient">Clasificados</span> de Vehículos
            Chinos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Descubrí las últimas novedades del mercado automotriz chino en
            Argentina. Comprá, vendé y conocé todo sobre las marcas que están
            revolucionando la industria.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  {value}
                </div>
                <div className="text-muted-foreground text-sm">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
