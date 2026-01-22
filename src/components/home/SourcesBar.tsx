import { motion } from "framer-motion";

const sources = [
  "Autoblog",
  "Motor1",
  "Parabrisas",
  "16 Válvulas",
  "Autocity",
  "La Nación Autos",
  "Infobae Autos",
];

export const SourcesBar = () => {
  return (
    <section className="border-b border-border py-6 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            Fuentes:
          </span>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {sources.map((source, index) => (
              <motion.span
                key={source}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-foreground/70 text-sm font-medium hover:text-primary transition-colors cursor-pointer"
              >
                {source}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
