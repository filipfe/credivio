"use client";

import NavLink from "./nav-link";
import { SettingsIcon } from "lucide-react";
import Nav from "./nav";
import { useContext, useEffect, useRef } from "react";
import { MenuContext } from "@/app/(private)/providers";
import useOutsideObserver from "@/hooks/useOutsideObserver";

export default function Sidebar() {
  const aside = useRef<HTMLElement | null>(null);
  const { isMenuHidden, setIsMenuHidden } = useContext(MenuContext);
  useOutsideObserver(aside, () =>
    setIsMenuHidden((prev) => ({ ...prev, mobile: true }))
  );

  useEffect(() => {
    const onResize = () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div>
      <aside
        ref={aside}
        className={`fixed sm:sticky top-16 bottom-0 left-0 sm:top-20 w-full bg-white sm:h-[calc(100vh-80px)] px-3 sm:px-4 flex flex-col justify-between sm:pt-0 pt-4 pb-4 z-50 sm:transition-none transition-transform ${
          isMenuHidden.desktop
            ? "max-w-[14rem] sm:max-w-[6rem]"
            : "max-w-[14rem] sm:max-w-[15rem]"
        } ${
          isMenuHidden.mobile
            ? "-translate-x-[15rem] sm:translate-x-0"
            : "translate-x-0"
        }`}
      >
        <Nav />
        <NavLink title="Ustawienia" href="/settings" icon={SettingsIcon} />
      </aside>
      <div
        className={`fixed bg-font/20 backdrop-blur-sm z-40 inset-0 w-screen h-screen sm:hidden ${
          isMenuHidden.mobile ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity`}
      ></div>
    </div>
  );
}
