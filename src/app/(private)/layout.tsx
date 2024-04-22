import { WebVitals } from "@/components/test";
import { Providers } from "./providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <WebVitals />
      {children}
    </Providers>
  );
}
