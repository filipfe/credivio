"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const defaultGroupActive =
    !!links && links.findIndex((item) => pathname.startsWith(item.href)) !== -1;
  const [isGroupActive, setIsGroupActive] = useState(defaultGroupActive);
  const Icon = icon;
  const isActive = matchPath
    ? href === pathname
    : href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
  return isGroup ? (
    <div>
      <button
        disabled={defaultGroupActive}
        onClick={() => setIsGroupActive((prev) => !prev)}
        className={`h-11 px-6 rounded-lg text-sm font-medium flex items-center justify-between gap-4 w-full ${
          isActive
            ? "bg-light"
            : "hover:bg-light disabled:hover:bg-white bg-white text-font/70"
        }`}
      >
        <div className="flex items-center gap-4">
          <Icon size={16} />
          <span className={hideText ? "opacity-0 absolute" : "opacity-100"}>
            {title}
          </span>
        </div>
        {!defaultGroupActive && (
          <div
            className={`transition-transform ${
              isGroupActive ? "-rotate-90" : "rotate-0"
            }`}
          >
            <ChevronLeftIcon size={16} opacity={0.8} />
          </div>
        )}
      </button>
      <div
        className={`grid ${
          isGroupActive ? "grid-rows-[1fr] mt-1.5" : "grid-rows-[0fr]"
        } transition-all`}
      >
        <div className="overflow-hidden space-y-1.5 px-4">
          {links?.map((link) => (
            <NavLink {...link} size={15} hideText={hideText} key={link.href} />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Link
      className={`px-6 rounded-lg text-sm font-medium flex items-center gap-4 ${
        isActive ? "bg-light" : "hover:bg-light bg-white text-font/70"
      }`}
      href={href}
      style={{ fontSize: size - 2, height: size * 2.75 }}
    >
      <Icon size={size} />
      <span className={hideText ? "opacity-0 absolute" : "opacity-100"}>
        {title}
      </span>
    </Link>
  );
}
