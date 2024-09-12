"use client";

import Block from "../ui/block";
import Empty from "../ui/empty";
import LimitRef from "./limits/ref";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import { useLimits } from "@/lib/operations/queries";
import { useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import LimitForm from "./limits/form";

export default function Limits({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const { data: limits } = useLimits(currency);
  const [defaultPeriod, setDefaultPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const daily = limits?.find((limit) => limit.period === "daily");
  const weekly = limits?.find((limit) => limit.period === "weekly");
  const monthly = limits?.find((limit) => limit.period === "monthly");
  return (
    <>
      <Block
        title="Limity"
        cta={
          <UniversalSelect
            className="w-20"
            name="currency"
            size="sm"
            radius="md"
            aria-label="Waluta"
            defaultSelectedKeys={[currency]}
            elements={CURRENCIES}
            onChange={(e) => setCurrency(e.target.value)}
          />
        }
        // className="col-start-1 col-end-3 row-start-2 row-end-3"
        className="col-span-4 row-start-3 row-end-4"
      >
        <div className="flex flex-col sm:grid grid-cols-3 justify-center">
          <div className="pb-6 sm:pb-0 sm:pr-4 flex flex-col">
            <h4 className="text-sm">Dzień</h4>
            {daily ? (
              <LimitRef {...daily} currency={currency} />
            ) : (
              <Empty
                className="min-h-24"
                cta={{
                  title: "Ustaw limit",
                  href: "/expenses/limits/add?period=daily",
                  onClick: () => {
                    setDefaultPeriod("daily");
                    onOpen();
                  },
                }}
              />
            )}
          </div>
          <div className="py-6 border-y sm:border-y-0 sm:py-0 sm:px-4 sm:border-x flex flex-col">
            <h4 className="text-sm">Tydzień</h4>
            {weekly ? (
              <LimitRef {...weekly} currency={currency} />
            ) : (
              <Empty
                className="min-h-24"
                cta={{
                  title: "Ustaw limit",
                  href: "/expenses/limits/add?period=weekly",
                  onClick: () => {
                    setDefaultPeriod("weekly");
                    onOpen();
                  },
                }}
              />
            )}
          </div>
          <div className="pt-6 sm:pt-0 sm:pl-4 flex flex-col">
            <h4 className="text-sm">Miesiąc</h4>
            {monthly ? (
              <LimitRef {...monthly} currency={currency} />
            ) : (
              <Empty
                className="min-h-24"
                cta={{
                  title: "Ustaw limit",
                  href: "/expenses/limits/add?period=monthly",
                  onClick: () => {
                    setDefaultPeriod("monthly");
                    onOpen();
                  },
                }}
              />
            )}
          </div>
        </div>
      </Block>
      <LimitForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        period={defaultPeriod}
        currency={currency}
      />
    </>
  );
}
