"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";

type Props = { data: Group[] };

export default function PortfolioAccordion({ data }: Props) {
  return (
    <Accordion defaultExpandedKeys={[data[0].name]} className="col-span-3">
      {data.map(({ children, name, value, color, label }, k) => (
        <AccordionItem
          title={
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundColor: color }}
                className="w-6 h-4 rounded"
              ></div>
              <span className="text-lg">{label}</span>
              <span className="text-sm">
                {/* {((value / total) * 100).toFixed(2)}% */}
                100%
              </span>
            </div>
          }
          key={name}
        >
          {children}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
