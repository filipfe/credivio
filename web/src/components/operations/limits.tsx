"use client";

import LimitRef from "./limits/ref";
import { useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import LimitForm from "./limits/form";

export default function Limits({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [defaultLimit, setDefaultLimit] = useState<NewLimit>({
    currency: defaultCurrency,
    period: "daily",
    amount: "",
  });

  return (
    <>
      <div className="flex flex-col 2xl:grid grid-cols-3 gap-4 sm:gap-6 justify-center col-span-full">
        <LimitRef
          period="daily"
          defaultCurrency={defaultCurrency}
          onAdd={(currency, amount) => {
            setDefaultLimit({
              currency,
              period: "daily",
              amount: amount || "",
            });
            onOpen();
          }}
        />
        <LimitRef
          period="weekly"
          defaultCurrency={defaultCurrency}
          onAdd={(currency, amount) => {
            setDefaultLimit({
              currency,
              period: "weekly",
              amount: amount || "",
            });
            onOpen();
          }}
        />
        <LimitRef
          period="monthly"
          defaultCurrency={defaultCurrency}
          onAdd={(currency, amount) => {
            setDefaultLimit({
              currency,
              period: "monthly",
              amount: amount || "",
            });
            onOpen();
          }}
        />
      </div>
      <LimitForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        defaultLimit={defaultLimit}
      />
    </>
  );
}
