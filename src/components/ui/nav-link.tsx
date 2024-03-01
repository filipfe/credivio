"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  title,
  href,
  icon,
  hideText,
}: Page & { hideText?: boolean }) {
  const pathname = usePathname();
  const Icon = icon;
  return (
    <Link
      className={`h-11 px-6 rounded-lg text-sm font-medium flex items-center gap-4 ${
        (href === "/" ? pathname === "/" : pathname.startsWith(href))
          ? "bg-light"
          : "hover:bg-light bg-white text-font/75"
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
