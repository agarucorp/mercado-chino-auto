import { BrandCarousel } from "@/components/brands/BrandCarousel";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { HeroSearchSection } from "@/components/home/HeroSearchSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestListingsPreview } from "@/components/home/LatestListingsPreview";
import { ModelCompareSection } from "@/components/home/ModelCompareSection";
import { MostReviewedPreview } from "@/components/home/MostReviewedPreview";
import { PatentamientosSection } from "@/components/home/PatentamientosSection";
import { VehicleOfTheWeekSection } from "@/components/home/VehicleOfTheWeekSection";
import { Layout } from "@/components/layout/Layout";
import { NewsPreview } from "@/components/news/NewsPreview";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HeroSearchSection />
      <BrandCarousel />
      <CategoryCarousel />
      <VehicleOfTheWeekSection />
      <LatestListingsPreview />
      <NewsPreview />
      <MostReviewedPreview />
      <PatentamientosSection />
      <ModelCompareSection />
    </Layout>
  );
};

export default Index;
