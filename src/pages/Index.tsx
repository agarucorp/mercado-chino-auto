import { BrandCarousel } from "@/components/brands/BrandCarousel";
import { HeroSection } from "@/components/home/HeroSection";
import { Layout } from "@/components/layout/Layout";
import { NewsPreview } from "@/components/news/NewsPreview";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BrandCarousel />
      <NewsPreview />
    </Layout>
  );
};

export default Index;
