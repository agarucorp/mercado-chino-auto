import { BrandCarousel } from "@/components/brands/BrandCarousel";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { HeroSearchSection } from "@/components/home/HeroSearchSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LaunchCarousel } from "@/components/home/LaunchCarousel";
import { LatestListingsPreview } from "@/components/home/LatestListingsPreview";
import { ModelCompareSection } from "@/components/home/ModelCompareSection";
import { MostViewedListingsSection } from "@/components/home/MostViewedListingsSection";
import { PatentamientosSection } from "@/components/home/PatentamientosSection";
import { RepuestosSection } from "@/components/home/RepuestosSection";
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
      <LaunchCarousel />
      <LatestListingsPreview />
      <NewsPreview />
      <RepuestosSection />
      <MostViewedListingsSection />
      <PatentamientosSection />
      <ModelCompareSection />
    </Layout>
  );
};

export default Index;
