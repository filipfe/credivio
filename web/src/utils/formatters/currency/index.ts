export default function numberFormat(
  currency: string,
  amount: number,
  notation: Intl.NumberFormatOptions["notation"] = "standard"
) {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    notation: notation,
  });

  return formatter.format(amount);
}
