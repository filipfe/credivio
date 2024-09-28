import { WebVitals } from "@/components/web-vitals";
import Providers from "./providers";
import MobileActions from "@/components/ui/cta/mobile-actions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <WebVitals />
      <main className="bg-light">{children}</main>
      <MobileActions />
    </Providers>
  );
}
