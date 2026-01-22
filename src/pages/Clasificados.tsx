import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Filter, MapPin, Calendar, Fuel, Settings2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const listings = [
  {
    id: "1",
    title: "BYD Seal Excellence 2024",
    price: 85000000,
    year: 2024,
    km: 5000,
    fuel: "Eléctrico",
    transmission: "Automático",
    location: "CABA",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "Chery Tiggo 8 Pro Max 2024",
    price: 55000000,
    year: 2024,
    km: 12000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "Córdoba",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: "3",
    title: "GWM Haval H6 2023",
    price: 42000000,
    year: 2023,
    km: 25000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "Mendoza",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: "4",
    title: "JAC T8 Diesel 2023",
    price: 38000000,
    year: 2023,
    km: 30000,
    fuel: "Diesel",
    transmission: "Manual",
    location: "Santa Fe",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: "5",
    title: "Geely Coolray 2024",
    price: 35000000,
    year: 2024,
    km: 8000,
    fuel: "Nafta",
    transmission: "Automático",
    location: "CABA",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: "6",
    title: "BYD Dolphin Mini 2024",
    price: 28000000,
    year: 2024,
    km: 3000,
    fuel: "Eléctrico",
    transmission: "Automático",
    location: "Buenos Aires",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
    featured: false,
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatKm = (km: number) => {
  return new Intl.NumberFormat("es-AR").format(km) + " km";
};

const Clasificados = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Clasificados
            </h1>
            <p className="text-muted-foreground">
              Comprá y vendé vehículos chinos. Miles de ofertas verificadas en todo el país.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="bg-card rounded-xl p-4 md:p-6 card-shadow mb-8">
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
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
              <Button variant="accent">Buscar</Button>
            </div>

            {/* Expanded Filters */}
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

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{listings.length}</span> vehículos encontrados
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

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <motion.article
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all cursor-pointer"
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
                  <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                    {listing.title}
                  </h3>

                  <p className="font-display font-bold text-xl text-primary mb-4">
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
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-10">
            <Button variant="outline" size="lg">
              Cargar más vehículos
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Clasificados;
