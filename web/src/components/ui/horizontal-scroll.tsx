"use client";

import { MenuContext } from "@/app/(private)/providers";
import { ScrollShadow, cn } from "@nextui-org/react";
import { useContext } from "react";

type Props = {
  children: React.ReactNode[];
  className?: string;
  innerClassName?: string;
};

export default function HorizontalScroll({
  children,
  className,
  innerClassName,
}: Props) {
  const { isMenuHidden } = useContext(MenuContext);
  return (
    <ScrollShadow
      hideScrollBar
      orientation="horizontal"
      className={cn(
        "w-full",
        isMenuHidden.desktop
          ? "max-w-[100vw] sm:max-w-[calc(100vw-176px)]"
          : "max-w-[100vw] sm:max-w-[calc(100vw-416px)]",
        className
      )}
    >
      <div className={cn("flex items-stretch gap-6 min-w-max", innerClassName)}>
        {children}
      </div>
    </ScrollShadow>
  );
}
