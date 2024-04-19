"use client";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, createContext, useState } from "react";

type MenuContextType = {
  isMenuHidden: boolean;
  setIsMenuHidden: Dispatch<SetStateAction<boolean>>;
};

export const MenuContext = createContext<MenuContextType>({
  isMenuHidden: false,
  setIsMenuHidden: null!,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  const [isMenuHidden, setIsMenuHidden] = useState(false);

  return (
    <NextUIProvider navigate={push}>
      <MenuContext.Provider value={{ isMenuHidden, setIsMenuHidden }}>
        <div
          className={`min-h-screen grid grid-rows-[80px_1fr] ${
            isMenuHidden
              ? "sm:grid-cols-[6rem_1fr]"
              : "sm:grid-cols-[15rem_1fr]"
          } transition-[grid-template-columns]`}
        >
          <Header />
          <Sidebar />
          <main className="bg-light">{children}</main>
        </div>
      </MenuContext.Provider>
    </NextUIProvider>
  );
}
