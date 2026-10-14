import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  source: string;
  date: string;
  year: number;
  sortDate: string;
  featured?: boolean;
  /** Entra en el carrusel de últimos lanzamientos del inicio. */
  homeLaunch?: boolean;
  marcaId?: string;
  modeloId?: string;
  /** URL de la nota original, cuando la noticia se importó de otro medio. */
  sourceUrl?: string;
  /** Orden manual definido por el admin. Menor = primero. */
  position?: number;
  body?: string;
  published?: boolean;
  imageAlt?: string;
}

/** @deprecated Use NewsArticle */
export type NewsCardProps = NewsArticle;

export const NewsCard = ({
  id,
  title,
  excerpt,
  image,
  category,
  source,
  date,
  featured = false,
}: NewsCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden rounded-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="type-badge absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground rounded-full">
          {category}
        </span>
        {featured && (
          <span className="type-badge absolute top-3 right-3 px-3 py-1 bg-foreground text-background rounded-full">
            Destacada
          </span>
        )}
      </div>
      
      <div className="pt-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
          <span>{source}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        
        <h3 className="type-h3 text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="type-body text-muted-foreground line-clamp-2 mb-4">
          {excerpt}
        </p>
        
        <Link
          to={`/noticias/${id}`}
          className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
        >
          Leer más
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
};
