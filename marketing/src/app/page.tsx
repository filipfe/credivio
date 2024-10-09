import AIAssistant from "@/components/landing/ai-assistant";
import BentoGrid from "@/components/landing/bento-grid";
import FAQ from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import Operations from "@/components/landing/operations";
import Pricing from "@/components/pricing";

export default function Home() {
  return (
    <div>
      <Hero />
      <Operations />
      <BentoGrid />
      <AIAssistant />
      <Pricing />
      <FAQ />
    </div>
  );
}
