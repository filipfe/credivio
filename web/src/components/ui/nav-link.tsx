"use client";

import { MenuContext } from "@/app/(private)/providers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

type Props = {
  isMenuHidden?: boolean;
  isGroup?: boolean;
  matchPath?: boolean;
};

export default function NavLink({
  title,
  href,
  icon,
  links,
  isGroup,
  matchPath,
}: Page & Props) {
  const { isMenuHidden } = useContext(MenuContext);
  const pathname = usePathname();
  const Icon = icon;
  const isActive = matchPath
    ? href === pathname
    : href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
  return isGroup && !isMenuHidden.desktop ? (
    <div>
      <div className={`px-4 rounded-lg font-medium w-full text-font/70`}>
        <span style={{ fontSize: 13 }}>{title}</span>
      </div>
      <div className="space-y-1.5 px-4 mt-1.5">
        {links?.map((link) => (
          <NavLink {...link} key={link.href} />
        ))}
      </div>
    </div>
  ) : (
    <Link
      className={`px-4 rounded-lg text-sm font-medium flex justify-center items-center gap-4 ${
        isActive ? "bg-light" : "hover:bg-light bg-white text-font/70"
      }`}
      href={href}
      style={{ fontSize: 13, height: 34 }}
    >
      <Icon size={15} />
      <span
        className={`flex-1 ${
          isMenuHidden.desktop ? "sm:opacity-0 sm:absolute" : "opacity-100"
        }`}
      >
        {title}
      </span>
    </Link>
  );
}
