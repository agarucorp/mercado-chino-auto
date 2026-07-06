import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatKm, formatPrice, LISTINGS_DATA } from "@/data/listings";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Fuel,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

const Clasificados = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="type-h1 text-foreground mb-4">Clasificados</h1>
            <p className="text-muted-foreground">
              Comprá y vendé vehículos chinos. Miles de ofertas verificadas en todo el país.
            </p>
          </motion.div>

          <div className="rounded-xl p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </Button>
              <Button>Buscar</Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">Marca</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="byd">BYD</SelectItem>
                      <SelectItem value="chery">Chery</SelectItem>
                      <SelectItem value="gwm">GWM</SelectItem>
                      <SelectItem value="geely">Geely</SelectItem>
                      <SelectItem value="jac">JAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Año</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Combustible</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="nafta">Nafta</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electrico">Eléctrico</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ubicación</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="caba">CABA</SelectItem>
                      <SelectItem value="bsas">Buenos Aires</SelectItem>
                      <SelectItem value="cordoba">Córdoba</SelectItem>
                      <SelectItem value="mendoza">Mendoza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{LISTINGS_DATA.length}</span>{" "}
              vehículos encontrados
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price-low">Menor precio</SelectItem>
                <SelectItem value="price-high">Mayor precio</SelectItem>
                <SelectItem value="km-low">Menor kilometraje</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LISTINGS_DATA.map((listing, index) => (
              <motion.article
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/clasificados/${listing.id}`}
                  className="group block overflow-hidden transition-colors"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {listing.featured && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="type-h3 text-foreground group-hover:text-primary transition-colors mb-2">
                      {listing.year} {listing.title}
                    </h3>

                    <p className="type-numeric font-semibold text-xl text-primary mb-4">
                      {formatPrice(listing.price)}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {listing.year}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Settings2 className="w-4 h-4" />
                        {formatKm(listing.km)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Fuel className="w-4 h-4" />
                        {listing.fuel}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {listing.location}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg">
              Cargar más vehículos
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Clasificados;
