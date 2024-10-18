"use client";

import { useSettings } from "@/lib/general/queries";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuHidden, setIsMenuHidden] = useState<IsMenuHidden>({
    mobile: true,
    desktop: false,
  });

  const { data: settings } = useSettings();

  useEffect(() => {
    setIsMenuHidden((prev) => ({ ...prev, mobile: true }));
  }, [pathname]);

  return (
    <NextUIProvider navigate={router.push} locale={settings?.language}>
      <MenuContext.Provider value={{ isMenuHidden, setIsMenuHidden }}>
        <div
          className={`min-h-screen max-w-screen grid grid-rows-[64px_1fr] sm:grid-rows-[80px_1fr] ${
            isMenuHidden.desktop
              ? "sm:grid-cols-[6rem_1fr]"
              : "sm:grid-cols-[15rem_1fr]"
          } transition-[grid-template-columns]`}
        >
          {children}
        </div>
      </MenuContext.Provider>
    </NextUIProvider>
  );
}
