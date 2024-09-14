"use client";

import Toast from "@/components/ui/toast";
import UniversalSelect from "@/components/ui/universal-select";
import useClientQuery from "@/hooks/useClientQuery";
import { updatePreferences } from "@/lib/settings/actions";
import { getLanguages } from "@/lib/settings/queries";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type Props = {
  defaultValue: string;
};

export default function LanguageSelect({ defaultValue }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(defaultValue);
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    isLoading,
    mutate,
    data: languages,
  } = useSWR("languages", () => getLanguages());

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
        mutate();
        toast.custom((t) => (
          <Toast {...t} type="success" message="Pomyślnie zmieniono dane!" />
        ));
      }
    });

  return (
    <form action={action} ref={formRef}>
      <UniversalSelect
        // size="sm"
        name="language"
        // radius="md"
        aria-label="Language select"
        label="Język"
        selectedKeys={[selected]}
        isLoading={isLoading || isPending}
        isDisabled={isLoading || isPending}
        elements={languages ? languages.map((lang) => lang.name) : []}
        placeholder="Wybierz język"
        onChange={(e) => setSelected(e.target.value)}
      />
      <input type="hidden" name="name" value="language_code" />
      <input
        type="hidden"
        name="value"
        value={languages?.find((lang) => lang.name === selected)?.code}
      />
    </form>
  );
}
