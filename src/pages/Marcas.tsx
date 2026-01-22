import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, Car, ChevronRight, ExternalLink } from "lucide-react";

const brands = [
  { id: "byd", name: "BYD", logo: "🚗", models: 8 },
  { id: "chery", name: "Chery", logo: "🚙", models: 12 },
  { id: "gwm", name: "GWM", logo: "🚐", models: 6 },
  { id: "geely", name: "Geely", logo: "🚘", models: 5 },
  { id: "jac", name: "JAC", logo: "🛻", models: 7 },
  { id: "haval", name: "Haval", logo: "🚖", models: 4 },
  { id: "jetour", name: "Jetour", logo: "🚗", models: 3 },
  { id: "omoda", name: "Omoda", logo: "🚙", models: 2 },
];

const representatives = [
  {
    id: "soc",
    name: "SOC Automotriz",
    brands: ["BYD", "Haval"],
    website: "#",
  },
  {
    id: "socma",
    name: "SOCMA",
    brands: ["Chery", "Omoda", "Jetour"],
    website: "#",
  },
  {
    id: "nio-motors",
    name: "NIO Motors Argentina",
    brands: ["GWM"],
    website: "#",
  },
  {
    id: "auto-geely",
    name: "Auto Geely SA",
    brands: ["Geely"],
    website: "#",
  },
  {
    id: "jac-motors",
    name: "JAC Motors Argentina",
    brands: ["JAC"],
    website: "#",
  },
];

const Marcas = () => {
  const [activeTab, setActiveTab] = useState<"marcas" | "representantes">("marcas");

  return (
    <Layout>
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Marcas y Representantes
            </h1>
            <p className="text-muted-foreground">
              Conocé todas las marcas chinas con presencia oficial en Argentina y sus representantes autorizados.
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab("marcas")}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "marcas"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Car className="w-5 h-5" />
              Marcas
            </button>
            <button
              onClick={() => setActiveTab("representantes")}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "representantes"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="w-5 h-5" />
              Representantes Oficiales
            </button>
          </div>

          {/* Brands Grid */}
          {activeTab === "marcas" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all cursor-pointer border border-transparent hover:border-primary/20"
                >
                  <div className="text-5xl mb-4">{brand.logo}</div>
                  <h3 className="font-display font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{brand.models} modelos</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver modelos
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Representatives List */}
          {activeTab === "representantes" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto space-y-4"
            >
              {representatives.map((rep, index) => (
                <motion.div
                  key={rep.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-lg text-foreground">
                        {rep.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {rep.brands.map((brand) => (
                          <span
                            key={brand}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={rep.website}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Web
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Marcas;
