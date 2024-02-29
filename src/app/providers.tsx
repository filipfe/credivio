"use client";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { NextUIProvider } from "@nextui-org/react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  return (
    <NextUIProvider>
      <div
        className={`min-h-screen grid grid-rows-[80px_1fr] ${
          isMenuHidden ? "grid-cols-[4rem_1fr]" : "grid-cols-[16rem_1fr]"
        } transition-[grid-template-columns]`}
      >
        <Header />
        <Sidebar />
        <main className="bg-light">{children}</main>
      </div>
    </NextUIProvider>
  );
}
