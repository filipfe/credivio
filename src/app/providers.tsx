"use client";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { LINKS } from "@/const";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const page = LINKS.find(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  );
  return (
    <div
      className={`min-h-screen grid grid-rows-[80px_1fr] ${
        isMenuHidden ? "grid-cols-[6rem_1fr]" : "grid-cols-[16rem_1fr]"
      } transition-[grid-template-columns]`}
    >
      <Header
        links={page?.links}
        isMenuHidden={isMenuHidden}
        setIsMenuHidden={setIsMenuHidden}
      />
      <Sidebar isMenuHidden={isMenuHidden} />
      <main className="bg-light">{children}</main>
    </div>
  );
}
