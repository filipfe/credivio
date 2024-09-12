"use client";

import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import Block from "../ui/block";
import { useEffect, useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import usePreferences from "@/hooks/usePreferences";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import formatAmount from "@/utils/operations/format-amount";
import { addLimit } from "@/lib/operations/actions";
import toast from "@/utils/toast";

const periods = [
  {
    value: "daily",
    label: "Dzienny",
  },
  {
    value: "weekly",
    label: "Tygodniowy",
  },
  {
    value: "monthly",
    label: "Miesięczny",
  },
];

interface NewLimit {
  amount: string;
  period?: "daily" | "weekly" | "monthly";
  currency?: string;
}

type Props = {
  defaultPeriod: "daily" | "weekly" | "monthly";
};

export default function LimitForm({ defaultPeriod }: Props) {
  const { data: preferences, isLoading } = usePreferences();
  const [isPending, startTransition] = useTransition();
  const [singleRecord, setSingleRecord] = useState<NewLimit>({
    amount: "",
    ...(defaultPeriod ? { period: defaultPeriod } : {}),
  });

  useEffect(() => {
    if (!preferences?.currency) return;
    setSingleRecord((prev) => ({ ...prev, currency: preferences.currency }));
  }, [preferences?.currency]);

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await addLimit(formData);
      if (res?.error) {
        toast({
          type: "error",
          message: "Wystąpił błąd przy dodawaniu limitu",
        });
      }
    });

  return (
    <Block title="Nowy limit" className="w-full max-w-xl">
      <form action={action}>
        <div className="grid grid-cols-[1fr_128px] gap-4">
          <Select
            placeholder="Wybierz okres"
            label="Okres"
            required
            name="period"
            selectedKeys={singleRecord.period ? [singleRecord.period] : []}
            isRequired
            className="col-span-2"
            classNames={{
              trigger: "bg-light shadow-none border",
            }}
            onChange={(e) =>
              setSingleRecord((prev) => ({
                ...prev,
                period: e.target.value as any,
              }))
            }
          >
            {periods.map((period) => (
              <SelectItem key={period.value}>{period.label}</SelectItem>
            ))}
          </Select>
          <Input
            classNames={{ inputWrapper: "bg-light shadow-none border" }}
            name="amount"
            label="Kwota"
            placeholder="0.00"
            isRequired
            required
            value={singleRecord.amount}
            onBlur={(_) => {
              const value = parseFloat(singleRecord.amount);
              !isNaN(value) &&
                setSingleRecord((prev) => ({
                  ...prev,
                  amount: value === 0 ? "" : value.toString(),
                }));
            }}
            onChange={(e) => {
              setSingleRecord((prev) => ({
                ...prev,
                amount: formatAmount(e.target.value),
              }));
            }}
          />
          <UniversalSelect
            name="currency"
            isLoading={isLoading}
            isDisabled={isLoading}
            label="Waluta"
            required
            isRequired
            selectedKeys={singleRecord.currency ? [singleRecord.currency] : []}
            elements={CURRENCIES}
            placeholder="Wybierz walutę"
            disallowEmptySelection
            onChange={(e) =>
              setSingleRecord((prev) => ({ ...prev, currency: e.target.value }))
            }
          />
        </div>
        <div className="mt-6 ml-auto max-w-max">
          <Button
            disableRipple
            color="primary"
            type="submit"
            isDisabled={isPending}
          >
            {isPending ? (
              <Spinner color="white" size="sm" />
            ) : (
              <CheckIcon size={16} />
            )}
            Zapisz
          </Button>
        </div>
      </form>
    </Block>
  );
}
