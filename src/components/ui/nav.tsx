"use client";

import { MenuContext } from "@/app/(private)/providers";
import { LINKS, PAGES } from "@/const";
import { useContext } from "react";
import NavLink from "./nav-link";

export default function Nav() {
  const { isMenuHidden } = useContext(MenuContext);
  const links = isMenuHidden ? LINKS : PAGES;
  return (
    <nav className="flex flex-col gap-3">
      {links.map((group) => (
        <NavLink {...group} isGroup={!!group.links} key={group.href} />
      ))}
    </nav>
  );
}
