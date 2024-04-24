"use client";

import NavLink from "./nav-link";
import { SettingsIcon } from "lucide-react";
import Nav from "./nav";
import { useContext } from "react";
import { MenuContext } from "@/app/(private)/providers";

export default function Sidebar() {
  const { isMenuHidden, setIsMenuHidden } = useContext(MenuContext);
  return (
    <div>
      <aside
        className={`fixed sm:sticky sm:top-20 w-full bg-white h-screen sm:h-[calc(100vh-80px)] px-4 flex flex-col justify-between sm:pt-0 pt-4 pb-4 z-50 sm:transition-none transition-transform ${
          isMenuHidden.desktop
            ? "max-w-[15rem] sm:max-w-[6rem]"
            : "max-w-[15rem]"
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
        onClick={() => setIsMenuHidden((prev) => ({ ...prev, mobile: false }))}
        className={`fixed bg-font/20 backdrop-blur-sm z-40 inset-0 w-screen h-screen sm:hidden ${
          isMenuHidden.mobile ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity`}
      ></div>
    </div>
  );
}
