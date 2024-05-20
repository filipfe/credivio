import BentoGrid from "@/components/landing/bento-grid";
import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="bg-white py-24"></section>
      <BentoGrid />
    </div>
  );
}
