"use client";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  const [isMenuHidden, setIsMenuHidden] = useState(false);

  return (
    <NextUIProvider navigate={push}>
      <div
        className={`min-h-screen grid grid-rows-[80px_1fr] ${
          isMenuHidden ? "grid-cols-[6rem_1fr]" : "grid-cols-[15rem_1fr]"
        } transition-[grid-template-columns]`}
      >
        <Header isMenuHidden={isMenuHidden} setIsMenuHidden={setIsMenuHidden} />
        <Sidebar isMenuHidden={isMenuHidden} />
        <main className="bg-light">{children}</main>
      </div>
    </NextUIProvider>
  );
}
