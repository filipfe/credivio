import { WebVitals } from "@/components/web-vitals";
import { Providers } from "./providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <WebVitals />
      {children}
    </Providers>
  );
}
