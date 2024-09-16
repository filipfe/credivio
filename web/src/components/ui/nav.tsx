"use client";

import { LINKS, PAGES } from "@/const";
import NavLink from "./nav-link";
import { MenuContext } from "@/app/(private)/providers";
import { useContext } from "react";

export default function Nav() {
  const { isMenuHidden } = useContext(MenuContext);
  const links = isMenuHidden.desktop ? LINKS : PAGES;
  return (
    <nav className="flex flex-col gap-2">
      {links.map((group) => (
        <NavLink {...group} isGroup={!!group.links} key={group.href} />
      ))}
    </nav>
  );
}
