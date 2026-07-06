import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Filter, Plus, User, Calendar, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reviews = [
  {
    id: "1",
    brand: "BYD",
    model: "Seal",
    year: 2024,
    author: "Carlos M.",
    date: "15 Ene 2026",
    rating: 5,
    content: "Increíble vehículo. La tecnología de las baterías blade es impresionante. Llevo 6 meses de uso y el consumo es mucho menor de lo esperado. La aceleración es brutal y el sistema de infoentretenimiento muy completo.",
    likes: 24,
  },
  {
    id: "2",
    brand: "Chery",
    model: "Tiggo 8 Pro",
    year: 2023,
    author: "María L.",
    date: "12 Ene 2026",
    rating: 4,
    content: "Muy buena relación precio-calidad. El espacio interior es generoso para toda la familia. El motor turbo tiene buena respuesta. Lo único negativo es el consumo en ciudad que es un poco alto.",
    likes: 18,
  },
  {
    id: "3",
    brand: "GWM",
    model: "Haval H6",
    year: 2024,
    author: "Roberto S.",
    date: "10 Ene 2026",
    rating: 4,
    content: "Sorprendido por la calidad de terminación. El diseño interior es muy moderno y los materiales son de buena calidad. La garantía de 7 años da mucha tranquilidad.",
    likes: 15,
  },
  {
    id: "4",
    brand: "JAC",
    model: "T8",
    year: 2023,
    author: "Fernando G.",
    date: "8 Ene 2026",
    rating: 4,
    content: "Excelente pickup para trabajo y uso familiar. El motor diésel es económico y tiene buena fuerza. La cabina doble es cómoda y el equipamiento es muy completo para el precio.",
    likes: 12,
  },
];

const brands = ["Todas", "BYD", "Chery", "GWM", "Geely", "JAC", "Haval", "Jetour", "Omoda"];

const Resenas = () => {
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReviews = selectedBrand === "Todas" 
    ? reviews 
    : reviews.filter(r => r.brand === selectedBrand);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-accent text-accent" : "text-muted"}`}
      />
    ));
  };

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="type-h1 text-foreground mb-4">
              Reseñas de propietarios
            </h1>
            <p className="text-muted-foreground">
              Experiencias reales de dueños de vehículos chinos en Argentina. Compartí tu opinión y ayudá a otros compradores.
            </p>
          </motion.div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Escribir Reseña
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="type-h2">Nueva reseña</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Marca</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.slice(1).map((brand) => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Año</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2024, 2023, 2022, 2021, 2020].map((year) => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Modelo</label>
                    <input
                      type="text"
                      placeholder="Ej: Tiggo 8 Pro"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Calificación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} className="p-1 hover:scale-110 transition-transform">
                          <Star className="w-6 h-6 text-muted hover:fill-accent hover:text-accent transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tu experiencia</label>
                    <textarea
                      rows={4}
                      placeholder="Contanos sobre tu experiencia con el vehículo..."
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                  <Button className="w-full">
                    Publicar Reseña
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Reviews List */}
          <div className="max-w-3xl mx-auto space-y-6">
            {filteredReviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                        {review.brand}
                      </span>
                      <h3 className="type-h3 text-foreground">
                        {review.model} ({review.year})
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>

                <p className="type-body text-foreground/80 mb-4">
                  {review.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {review.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {review.date}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{review.likes}</span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Resenas;
