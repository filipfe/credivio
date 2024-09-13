"use client";

import Toast from "@/components/ui/toast";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { updatePreferences } from "@/lib/settings/actions";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

type Props = {
  defaultValue: string;
};

export default function CurrencySelect({ defaultValue }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(defaultValue);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!formRef.current || selected === defaultValue) return;
    formRef.current.requestSubmit();
  }, [selected]);

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await updatePreferences(formData);
      if (res?.error) {
        toast.custom((t) => <Toast {...t} message={res.error} type="error" />);
      } else {
        toast.custom((t) => (
          <Toast {...t} type="success" message="Pomyślnie zmieniono dane!" />
        ));
      }
    });

  return (
    <form action={action} ref={formRef}>
      <UniversalSelect
        name="currency"
        aria-label="Currency select"
        label="Waluta"
        selectedKeys={[selected]}
        isLoading={isPending}
        isDisabled={isPending}
        elements={CURRENCIES}
        onChange={(e) => setSelected(e.target.value)}
      />
      <input type="hidden" name="name" value="currency" />
      <input type="hidden" name="value" value={selected} />
    </form>
  );
}
