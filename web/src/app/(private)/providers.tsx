"use client";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import usePreferences from "@/hooks/usePreferences";
import { getAccount } from "@/lib/settings/queries";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";

type IsMenuHidden = {
  mobile: boolean;
  desktop: boolean;
};

type MenuContextType = {
  isMenuHidden: IsMenuHidden;
  setIsMenuHidden: Dispatch<SetStateAction<IsMenuHidden>>;
};

export const MenuContext = createContext<MenuContextType>({
  isMenuHidden: {
    mobile: true,
    desktop: false,
  },
  setIsMenuHidden: null!,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  const pathname = usePathname();
  const [isMenuHidden, setIsMenuHidden] = useState<IsMenuHidden>({
    mobile: true,
    desktop: false,
  });

  const { data: preferences } = usePreferences();

  useEffect(() => {
    setIsMenuHidden((prev) => ({ ...prev, mobile: true }));
  }, [pathname]);

  return (
    <NextUIProvider navigate={push} locale={preferences?.language.code}>
      <MenuContext.Provider value={{ isMenuHidden, setIsMenuHidden }}>
        <div
          className={`min-h-screen max-w-screen grid grid-rows-[64px_1fr] sm:grid-rows-[80px_1fr] ${
            isMenuHidden.desktop
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
