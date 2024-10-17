"use client";

import { MenuContext } from "@/app/(private)/(sidebar)/providers";
import { Dict } from "@/const/dict";
import { cn } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";

type Props = {
  isGroup?: boolean;
  matchPath?: boolean;
  endContent?: React.ReactNode;
  dict?: Dict["private"]["_navigation"];
};

export default function NavLink({
  title,
  href,
  icon,
  links,
  isGroup,
  matchPath,
  dict,
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
        <span
          className="whitespace-nowrap text-ellipsis"
          style={{ fontSize: 13 }}
        >
          {title}
        </span>
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
              <NavLink
                {...link}
                title={
                  dict ? dict[link.href.slice(1) as keyof typeof dict] : ""
                }
                key={link.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Link
      href={href}
      className={cn(
        `px-3 sm:px-4 rounded-lg text-sm font-medium grid transition-all items-center ${
          isActive ? "bg-light border" : "hover:bg-light bg-white text-font/70"
        }`,
        isMenuHidden.desktop
          ? "grid-cols-[1fr]"
          : "gap-3 sm:gap-3.5 grid-cols-[15px_1fr]"
      )}
      style={{ fontSize: 13, height: 34 }}
    >
      <div className="grid place-content-center">
        <Icon size={15} />
      </div>
      <span
        className={`flex-1 whitespace-nowrap text-ellipsis mt-px ${
          isMenuHidden.desktop ? "sm:opacity-0 absolute" : "opacity-100"
        }`}
      >
        {title}
      </span>
    </Link>
  );
}
