"use client";

import { Button, DateInput, Input, Spinner, Textarea } from "@nextui-org/react";
import formatAmount from "@/utils/operations/format-amount";
import { useEffect, useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Block from "../ui/block";
import { format } from "date-fns";
import toast from "@/utils/toast";
import { addRecurringPayment } from "@/lib/recurring-payments/actions";
import useDefaultCurrency from "@/hooks/useDefaultCurrency";
import { I18nProvider } from "@react-aria/i18n";
import { CalendarDate, parseDate } from "@internationalized/date";

interface NewRecurringPayment
  extends Partial<
    Omit<RecurringPayment, "amount" | "created_at" | "type" | "start_date">
  > {
  amount: string;
  type?: "income" | "expense";
  start_date: CalendarDate;
}

const defaultRecord: Omit<NewRecurringPayment, "currency"> = {
  title: "",
  amount: "",
  start_date: parseDate(format(new Date(), "yyyy-MM-dd")),
  interval_amount: 1,
  interval_unit: "month",
};

export default function RecurringPaymentForm() {
  const { data: defaultCurrency, isLoading } = useDefaultCurrency();
  const [isPending, startTransition] = useTransition();
  const [singleRecord, setSingleRecord] = useState<NewRecurringPayment>({
    ...defaultRecord,
    currency: defaultCurrency,
  });

  useEffect(() => {
    if (!defaultCurrency) return;
    setSingleRecord((prev) => ({ ...prev, currency: defaultCurrency }));
  }, [defaultCurrency]);

  return (
    <Block title="Nowa płatność cykliczna" className="w-full max-w-4xl">
      <form
        className="grid grid-cols-2 gap-4"
        action={(formData) =>
          startTransition(async () => {
            const { error } = await addRecurringPayment(formData);
            if (error) {
              toast({
                type: "error",
                message: "Wystąpił błąd przy dodawaniu płatności cyklicznej",
              });
            }
          })
        }
      >
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="title"
          label="Tytuł"
          placeholder="Rachunki"
          isRequired
          value={singleRecord.title}
          onChange={(e) =>
            setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="amount"
          label="Kwota"
          placeholder="0.00"
          isRequired
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
          selectedKeys={singleRecord.currency ? [singleRecord.currency] : []}
          elements={CURRENCIES}
          placeholder="Wybierz walutę"
          disallowEmptySelection
          onChange={(e) =>
            setSingleRecord((prev) => ({ ...prev, currency: e.target.value }))
          }
        />
        <I18nProvider
          locale={new Intl.Locale("pl-PL", { calendar: "gregory" }).toString()}
        >
          <DateInput
            classNames={{ inputWrapper: "!bg-light" }}
            name="start_date"
            label="Data rozpoczęcia"
            value={singleRecord.start_date}
            //   placeholder="24.01.2024"
            //   type="date"
          />
        </I18nProvider>
        <div className="col-span-2 flex justify-end mt-4">
          <Button color="primary" type="submit" isDisabled={isPending}>
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
