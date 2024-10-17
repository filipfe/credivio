"use client";

import { useSettings } from "@/lib/general/queries";

interface Props extends Intl.NumberFormatOptions {
  currency: string;
  amount: number;
  language_code?: Locale;
}

export default function NumberFormat({
  amount,
  language_code,
  notation = "standard",
  ...props
}: Props) {
  const { data: settings } = useSettings();

  const formatter = new Intl.NumberFormat(language_code || settings?.language, {
    style: "currency",
    notation,
    ...props,
  });

  return formatter.format(amount);
}
