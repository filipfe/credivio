// "use client";

// import { MenuContext } from "@/app/(private)/providers";
import { PAGES } from "@/const";
// import { useContext } from "react";
import NavLink from "./nav-link";

export default function Nav() {
  // const { isMenuHidden } = useContext(MenuContext);
  // const links = isMenuHidden.desktop ? LINKS : PAGES;
  return (
    <nav className="flex flex-col gap-2">
      {PAGES.map((group) => (
        <NavLink {...group} key={group.href} />
      ))}
    </nav>
  );
}

// isGroup={false && !!group.links}
