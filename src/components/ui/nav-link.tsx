"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { hideText?: boolean; matchPath?: boolean };

export default function NavLink({
  title,
  href,
  icon,
  hideText,
  matchPath,
}: Page & Props) {
  const pathname = usePathname();
  const Icon = icon;
  const isActive = matchPath
    ? href === pathname
    : href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
  return (
    <Link
      className={`h-11 px-6 rounded-lg text-sm font-medium flex items-center gap-4 ${
        isActive ? "bg-light" : "hover:bg-light bg-white text-font/75"
      }`}
      href={href}
      key={href}
    >
      <Icon size={16} />
      <span className={hideText ? "opacity-0 absolute" : "opacity-100"}>
        {title}
      </span>
    </Link>
  );
}
