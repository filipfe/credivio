"use client";

import { MenuContext } from "@/app/(private)/providers";
import { ScrollShadow } from "@nextui-org/react";
import { useContext } from "react";
import GoalRef from "./ref";

export default function GoalsList({ goals }: { goals: Goal[] }) {
  const { isMenuHidden } = useContext(MenuContext);
  return (
    <ScrollShadow
      hideScrollBar
      orientation="horizontal"
      className={
        isMenuHidden ? "max-w-[calc(100vw-176px)]" : "max-w-[calc(100vw-320px)]"
      }
    >
      <div className="flex items-stretch gap-6 w-max">
        {goals.map((item, k) => (
          <GoalRef {...item} key={`goal:${k}`} />
        ))}
      </div>
    </ScrollShadow>
  );
}
