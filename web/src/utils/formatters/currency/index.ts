"use client";

import { usePreferences } from "@/lib/settings/queries";

interface Props extends Intl.NumberFormatOptions {
  currency: string;
  amount: number;
  language_code?: Locale;
}

export default function NumberFormat(
  { amount, language_code, notation = "standard", ...props }: Props,
) {
  const { data: preferences } = usePreferences();

  const formatter = new Intl.NumberFormat(
    language_code || preferences?.language.code,
    {
      style: "currency",
      notation,
      ...props,
    },
  );

  return formatter.format(amount);
}
