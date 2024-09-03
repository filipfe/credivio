"use client";

import Toast from "@/components/ui/toast";
import UniversalSelect from "@/components/ui/universal-select";
import useClientQuery from "@/hooks/useClientQuery";
import { updatePreferences } from "@/lib/settings/actions";
import { getLanguages } from "@/lib/settings/queries";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  defaultValue: string;
};

export default function LanguageSelect({ defaultValue }: Props) {
  const [selected, setSelected] = useState(defaultValue);
  const { isLoading, results: languages } = useClientQuery({
    query: getLanguages(),
  });
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!formRef.current || selected === defaultValue) return;
    formRef.current.requestSubmit();
  }, [selected]);

  const onSubmit = async (formData: FormData) => {
    const res = await updatePreferences(formData);
    if (res?.error) {
      toast.custom((t) => <Toast {...t} message={res.error} type="error" />);
    }
  };

  return (
    <form action={onSubmit} ref={formRef}>
      <UniversalSelect
        // size="sm"
        name="language"
        // radius="md"
        aria-label="Language select"
        label="Język"
        selectedKeys={[selected]}
        isLoading={isLoading}
        isDisabled={isLoading}
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
