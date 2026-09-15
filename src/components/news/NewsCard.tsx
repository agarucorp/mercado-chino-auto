import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
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
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
      >
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-3">
            <span className="type-badge px-3 py-1 bg-accent text-accent-foreground rounded-full">
              {category}
            </span>
            <span className="type-meta text-background/80">{source}</span>
          </div>
          
          <h2 className="type-hero text-background mb-3">
            {title}
          </h2>
          
          <p className="type-body text-background/80 mb-4 line-clamp-2 max-w-2xl">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-background/60 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            
            <Link
              to={`/noticias/${id}`}
              className="flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
            >
              Leer más
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.article>
    );
  }

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
