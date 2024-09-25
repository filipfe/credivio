import { RootProvider } from "fumadocs-ui/provider";
import { I18nProvider } from "fumadocs-ui/i18n";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Header from "@/components/ui/header/content";
import Banner from "@/components/ui/banner";
import Footer from "@/components/ui/footer";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang} className="light" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider locale={params.lang}>
          <RootProvider>
            <Header />
            {children}
            <Banner />
            <Footer />
          </RootProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
