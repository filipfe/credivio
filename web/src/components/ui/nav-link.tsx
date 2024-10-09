"use client";

import { MenuContext } from "@/app/(private)/providers";
import { cn } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";

type Props = {
  isMenuHidden?: boolean;
  isGroup?: boolean;
  matchPath?: boolean;
  endContent?: React.ReactNode;
};

export default function NavLink({
  title,
  href,
  icon,
  links,
  isGroup,
  matchPath,
  endContent,
}: Page & Props) {
  const [isOpen, setIsOpen] = useState(true);
  const { isMenuHidden } = useContext(MenuContext);
  const pathname = usePathname();
  const Icon = icon;
  const isActive = matchPath
    ? href === pathname
    : href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
  return isGroup && !isMenuHidden.desktop ? (
    <div className="my-0.5">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 sm:px-4 py-1 font-medium w-full text-font/70 flex items-center gap-1 justify-between"
      >
        <span style={{ fontSize: 13 }}>{title}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform",
            isOpen ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1.5 px-3 sm:px-4 mt-1.5">
            {links?.map((link) => (
              <NavLink {...link} key={link.href} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Link
      href={href}
      className={`px-3 sm:px-4 rounded-lg text-sm font-medium flex justify-center items-center gap-3 sm:gap-3.5 ${
        isActive ? "bg-light border" : "hover:bg-light bg-white text-font/70"
      }`}
      style={{ fontSize: 13, height: 34 }}
    >
      <Icon size={15} />
      <span
        className={`flex-1 mt-px ${
          isMenuHidden.desktop ? "sm:opacity-0 sm:absolute" : "opacity-100"
        }`}
      >
        {title}
      </span>
    </Link>
  );
}
