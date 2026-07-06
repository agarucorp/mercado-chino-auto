import type { NewsArticle } from "@/components/news/NewsCard";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface NewsFeaturedLeadProps {
  article: NewsArticle;
}

export function NewsFeaturedLead({ article }: NewsFeaturedLeadProps) {
  return (
    <article className="group grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
      <Link
        to={`/noticias/${article.id}`}
        className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px] overflow-hidden rounded-lg bg-muted"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col justify-center p-5 md:p-8 md:pl-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="type-badge px-2.5 py-0.5 bg-accent text-accent-foreground rounded-full">
            {article.category}
          </span>
          <span className="type-meta text-muted-foreground">{article.source}</span>
        </div>

        <Link to={`/noticias/${article.id}`}>
          <h2 className="type-h2 text-foreground group-hover:text-primary transition-colors">
            {article.title}
          </h2>
        </Link>

        <p className="type-body text-muted-foreground mt-4 line-clamp-4">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-2 type-meta text-muted-foreground mt-6">
          <Calendar className="w-4 h-4 shrink-0" />
          <time dateTime={article.sortDate}>{article.date}</time>
        </div>
      </div>
    </article>
  );
}
