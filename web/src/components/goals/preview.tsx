"use client";

import { useContext } from "react";
import Block from "../ui/block";
import RadialChart from "../ui/charts/radial-chart";
import { TimelineContext } from "@/app/(private)/goals/providers";

export default function Preview(priority: Goal) {
  const { activeRecord } = useContext(TimelineContext);
  const goal = activeRecord || priority;
  const { title, saved, price } = goal;

  return (
    <Block title={title}>
      {/* <div className="grid grid-cols-2 flex-1"> */}
      {/* <div></div> */}
      <div className="relative flex-1">
        <div className="absolute inset-0 h-full w-full flex items-center justify-center">
          <RadialChart data={[{ value: ((saved || 0) / price) * 100 }]} />
        </div>
      </div>
      {/* </div> */}
    </Block>
  );
}
