import AIAssistant from "@/components/landing/ai-assistant";
import BentoGrid from "@/components/landing/bento-grid";
import FAQ from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import Management from "@/components/landing/management";
import Operations from "@/components/landing/operations";
import Pricing from "@/components/pricing";
import getDictionary from "@/dict";

export default async function Home({ params: { lang } }: PageProps) {
  const {
    landing: { hero, operations },
  } = await getDictionary(lang);
  return (
    <div>
      <Hero dict={hero} />
      <Operations dict={operations} />
      <BentoGrid />
      <AIAssistant />
      <Management />
      <Pricing />
      <FAQ />
    </div>
  );
}
