"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  hideText?: boolean;
  isGroup?: boolean;
  matchPath?: boolean;
};

export default function NavLink({
  title,
  href,
  icon,
  links,
  isGroup,
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
  return isGroup ? (
    <div>
      <div className={`px-5 rounded-lg font-medium w-full text-font/70`}>
        <span
          style={{ fontSize: 13 }}
          className={hideText ? "opacity-0 absolute" : "opacity-100"}
        >
          {title}
        </span>
      </div>
      <div className="space-y-1.5 px-4 mt-1.5">
        {links?.map((link) => (
          <NavLink {...link} hideText={hideText} key={link.href} />
        ))}
      </div>
    </div>
  ) : (
    <Link
      className={`px-5 rounded-lg text-sm font-medium flex items-center gap-4 ${
        isActive ? "bg-light" : "hover:bg-light bg-white text-font/70"
      }`}
      href={href}
      style={{ fontSize: 13, height: 34 }}
    >
      <Icon size={15} />
      <span className={hideText ? "opacity-0 absolute" : "opacity-100"}>
        {title}
      </span>
    </Link>
  );
}
