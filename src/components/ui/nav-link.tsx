"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  hideText?: boolean;
  isGroup?: boolean;
  matchPath?: boolean;
  size?: number;
};

export default function NavLink({
  title,
  href,
  icon,
  links,
  isGroup,
  hideText,
  size = 16,
  matchPath,
}: Page & Props) {
  const pathname = usePathname();
  const Icon = icon;
  const isActive = matchPath
    ? href === pathname
    : href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
  return isGroup ? (
    <div>
      <div
        className={`h-11 px-6 rounded-lg text-sm font-medium flex items-center gap-4 w-full text-font/70`}
      >
        <span className={hideText ? "opacity-0 absolute" : "opacity-100"}>
          {title}
        </span>
      </div>
      <div className="space-y-1.5 px-4 mt-1.5">
        {links?.map((link) => (
          <NavLink {...link} size={15} hideText={hideText} key={link.href} />
        ))}
      </div>
    </div>
  ) : (
    <Link
      className={`px-6 rounded-lg text-sm font-medium flex items-center gap-4 ${
        isActive ? "bg-light" : "hover:bg-light bg-white text-font/70"
      }`}
      href={href}
      style={{ fontSize: size - 2, height: size * 2.5 }}
    >
      <Icon size={size} />
      <span className={hideText ? "opacity-0 absolute" : "opacity-100"}>
        {title}
      </span>
    </Link>
  );
}
