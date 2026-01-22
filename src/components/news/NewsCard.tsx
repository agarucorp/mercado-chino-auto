import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  source: string;
  date: string;
  featured?: boolean;
}

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
        className="group relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
      >
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full uppercase tracking-wide">
              {category}
            </span>
            <span className="text-background/80 text-sm">{source}</span>
          </div>
          
          <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-background mb-3 leading-tight">
            {title}
          </h2>
          
          <p className="text-background/80 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl">
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
      className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full uppercase tracking-wide">
          {category}
        </span>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
          <span>{source}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
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
