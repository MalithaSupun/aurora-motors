import Hero from "@/components/Hero";
import EngineSection from "@/components/EngineSection";
import BlueprintSection from "@/components/BlueprintSection";
import InteriorSection from "@/components/InteriorSection";
import GlobeSection from "@/components/GlobeSection";
import FeaturedCars from "@/components/FeaturedCars";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Hero />
      <EngineSection />
      <BlueprintSection />
      <InteriorSection />
      <GlobeSection />
      <FeaturedCars />
      <ContactSection />
    </main>
  );
}
