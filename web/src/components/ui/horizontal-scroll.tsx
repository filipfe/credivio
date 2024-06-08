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
        isMenuHidden.desktop
          ? "max-w-[100vw] md:max-w-[calc(100vw-176px)]"
          : "max-w-[100vw] md:max-w-[calc(100vw-320px)]",
        className
      )}
    >
      <div className="flex items-stretch gap-6 w-max">{children}</div>
    </ScrollShadow>
  );
}
