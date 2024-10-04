import BentoGrid from "@/components/landing/bento-grid";
import Hero from "@/components/landing/hero";
import Pricing from "@/components/pricing";

export default function Home() {
  return (
    <div>
      <Hero />
      <BentoGrid />
      <Pricing />
    </div>
  );
}
