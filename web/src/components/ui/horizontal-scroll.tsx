"use client";

import { MenuContext } from "@/app/(private)/providers";
import { ScrollShadow, cn } from "@nextui-org/react";
import { useContext } from "react";

export default function HorizontalScroll({
  children,
  className,
}: {
  children: React.ReactNode[];
  className?: string;
}) {
  const { isMenuHidden } = useContext(MenuContext);
  return (
    <ScrollShadow
      hideScrollBar
      orientation="horizontal"
      className={cn(
        "w-full",
        isMenuHidden.desktop
          ? "max-w-[calc(100vw-48px)] sm:max-w-[calc(100vw-176px)]"
          : "max-w-[calc(100vw-48px)] sm:max-w-[calc(100vw-416px)]",
        className
      )}
    >
      <div className="flex items-stretch gap-6 min-w-max">{children}</div>
    </ScrollShadow>
  );
}
