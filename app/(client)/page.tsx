import { HomeAiPreviewSection } from "@/app/components/home/HomeAiPreviewSection";
import { HomeFeedbackSection } from "@/app/components/home/HomeFeedbackSection";
import { HomeFinalCtaSection } from "@/app/components/home/HomeFinalCtaSection";
import { HomeFooter } from "@/app/components/home/HomeFooter";
import { HomeHeroSection } from "@/app/components/home/HomeHeroSection";
import { HomeProcessSection } from "@/app/components/home/HomeProcessSection";
import { HomeTrustStrip } from "@/app/components/home/HomeTrustStrip";

export default function HomePage() {
  return (
    <main className="min-h-screen scroll-smooth bg-[#f9f4ec] text-slate-950 transition-colors dark:bg-[#05070b] dark:text-white">
      <HomeHeroSection />
      <HomeTrustStrip />
      <HomeProcessSection />
      <HomeAiPreviewSection />
      <HomeFeedbackSection />
      <HomeFinalCtaSection />
      <HomeFooter />
    </main>
  );
}
