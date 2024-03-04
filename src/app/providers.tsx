"use client";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { PAGES } from "@/const";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const sublinks = PAGES.find(({ href }) => href === pathname)?.links;
  return (
    <div
      className={`min-h-screen grid grid-rows-[80px_1fr] ${
        isMenuHidden ? "grid-cols-[6rem_1fr]" : "grid-cols-[16rem_1fr]"
      } transition-[grid-template-columns]`}
    >
      <Header
        links={sublinks}
        isMenuHidden={isMenuHidden}
        setIsMenuHidden={setIsMenuHidden}
      />
      <Sidebar isMenuHidden={isMenuHidden} />
      <main className="bg-light">{children}</main>
    </div>
  );
}
