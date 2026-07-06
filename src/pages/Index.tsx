import { BrandCarousel } from "@/components/brands/BrandCarousel";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestListingsPreview } from "@/components/home/LatestListingsPreview";
import { ModelCompareSection } from "@/components/home/ModelCompareSection";
import { MostReviewedPreview } from "@/components/home/MostReviewedPreview";
import { Layout } from "@/components/layout/Layout";
import { NewsPreview } from "@/components/news/NewsPreview";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BrandCarousel />
      <CategoryCarousel />
      <LatestListingsPreview />
      <MostReviewedPreview />
      <NewsPreview />
      <ModelCompareSection />
    </Layout>
  );
};

export default Index;
