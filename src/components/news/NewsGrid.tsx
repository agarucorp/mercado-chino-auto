import { NewsCard, NewsCardProps } from "./NewsCard";

interface NewsGridProps {
  news: NewsCardProps[];
}

export const NewsGrid = ({ news }: NewsGridProps) => {
  const featuredNews = news.find((n) => n.featured);
  const regularNews = news.filter((n) => !n.featured);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Featured Article - Takes 2 columns */}
      {featuredNews && (
        <div className="lg:col-span-2">
          <NewsCard {...featuredNews} />
        </div>
      )}

      {/* First regular article next to featured */}
      {regularNews[0] && (
        <div className="lg:col-span-1">
          <NewsCard {...regularNews[0]} />
        </div>
      )}

      {/* Rest of articles in 3-column grid */}
      {regularNews.slice(1).map((article) => (
        <div key={article.id} className="lg:col-span-1">
          <NewsCard {...article} />
        </div>
      ))}
    </div>
  );
};
