"use client";

import LimitRef from "./limits/ref";
import { useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import LimitForm from "./limits/form";

export default function Limits({ settings }: { settings: Settings }) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [defaultLimit, setDefaultLimit] = useState<NewLimit>({
    currency: settings.currency,
    period: "daily",
    amount: "",
  });

  return (
    <>
      <div className="flex flex-col 2xl:grid grid-cols-3 gap-4 sm:gap-6 justify-center col-span-full">
        <LimitRef
          period="daily"
          settings={settings}
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
          settings={settings}
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
          settings={settings}
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
        timezone={settings.timezone}
      />
    </>
  );
}
