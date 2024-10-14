"use client";

import { Button, DateInput, Input, Spinner } from "@nextui-org/react";
import formatAmount from "@/utils/operations/format-amount";
import { useEffect, useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Block, { Section } from "../ui/block";
import { format } from "date-fns";
import toast from "@/utils/toast";
import { addRecurringPayment } from "@/lib/recurring-payments/actions";
import { I18nProvider } from "@react-aria/i18n";
import { CalendarDate, parseDate } from "@internationalized/date";
import { usePreferences } from "@/lib/settings/queries";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

interface NewRecurringPayment
  extends Partial<
    Omit<
      RecurringPayment,
      "amount" | "created_at" | "type" | "start_date" | "interval_amount"
    >
  > {
  amount: string;
  type?: "income" | "expense";
  start_date: CalendarDate;
  interval_amount: string;
}

const defaultRecord: Omit<NewRecurringPayment, "currency"> = {
  title: "",
  amount: "",
  start_date: parseDate(format(tomorrow, "yyyy-MM-dd")),
  interval_amount: "1",
  interval_unit: "month",
};

export default function RecurringPaymentForm() {
  const { data: preferences, isLoading } = usePreferences();
  const [isPending, startTransition] = useTransition();
  const [singleRecord, setSingleRecord] = useState<NewRecurringPayment>({
    ...defaultRecord,
    currency: preferences?.currency,
  });
  const [isStartTimeInvalid, setIsStartTimeInvalid] = useState(false);

  useEffect(() => {
    if (!preferences?.currency) return;
    setSingleRecord((prev) => ({ ...prev, currency: preferences.currency }));
  }, [preferences?.currency]);

  return (
    <Block title="Nowa płatność cykliczna" className="w-full max-w-4xl">
      <form
        action={(formData) =>
          startTransition(async () => {
            if (!singleRecord.start_date) return setIsStartTimeInvalid(true);
            const res = await addRecurringPayment(formData);
            if (res?.error) {
              toast({
                type: "error",
                message: "Wystąpił błąd przy dodawaniu płatności cyklicznej",
              });
            }
          })
        }
      >
        <Section
          title="Dane"
          className="flex flex-col md:grid grid-cols-2 gap-4"
          wrapperClassName="pb-8"
        >
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="title"
            label="Tytuł"
            placeholder="Rachunki"
            isRequired
            required
            value={singleRecord.title}
            onChange={(e) =>
              setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
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
          <UniversalSelect
            name="type"
            label="Typ transakcji"
            isRequired
            required
            selectedKeys={singleRecord.type ? [singleRecord.type] : []}
            elements={[
              { name: "Przychód", value: "income" },
              { name: "Wydatek", value: "expense" },
            ]}
            placeholder="Wybierz typ transakcji"
            disallowEmptySelection
            onChange={(e) =>
              setSingleRecord((prev) => ({
                ...prev,
                type: e.target.value as "income" | "expense",
              }))
            }
          />
        </Section>
        <Section
          title="Interwał"
          className="grid grid-cols-[88px_1fr] md:grid-cols-[88px_1fr_1fr] gap-4"
        >
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="interval_amount"
            label="Wartość"
            placeholder="1"
            isRequired
            required
            value={singleRecord.interval_amount}
            onChange={(e) =>
              setSingleRecord((prev) => ({
                ...prev,
                interval_amount: e.target.value.replace(/\D/g, ""),
              }))
            }
          />
          <UniversalSelect
            name="interval_unit"
            label="Interwał"
            isRequired
            required
            selectedKeys={
              singleRecord.interval_unit ? [singleRecord.interval_unit] : []
            }
            elements={[
              { name: "Dzień", value: "day" },
              { name: "Tydzień", value: "week" },
              { name: "Miesiąc", value: "month" },
            ]}
            placeholder="Wybierz interwał"
            disallowEmptySelection
            onChange={(e) =>
              setSingleRecord((prev) => ({
                ...prev,
                interval_unit: e.target.value,
              }))
            }
          />
          <DateInput
            className="col-span-2 md:col-span-1"
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="start_date"
            isRequired
            isInvalid={isStartTimeInvalid || undefined}
            errorMessage={
              isStartTimeInvalid
                ? singleRecord.start_date
                  ? "Nieprawidłowa data"
                  : "Pole wymagane"
                : undefined
            }
            label="Data rozpoczęcia"
            value={singleRecord.start_date}
            minValue={parseDate(format(tomorrow, "yyyy-MM-dd"))}
            onChange={(date) => {
              setIsStartTimeInvalid(false);
              setSingleRecord((prev) => ({ ...prev, start_date: date }));
            }}
          />
          {/* TODO: replace with the actual input */}
          <input
            type="hidden"
            name="interval_amount"
            value={singleRecord.interval_amount}
          />
        </Section>
        <div className="col-span-2 flex justify-end mt-4">
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
