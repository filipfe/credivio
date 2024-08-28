export default function formatInterval(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string,
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  // Localize the number and unit together
  const formattedUnit = rtf.format(value, unit);

  // The idea is to create a phrase like "co miesiąc" or "co 2 tygodnie"
  const numberFormat = new Intl.NumberFormat(locale);
  const formattedNumber = numberFormat.format(value);

  // Insert the localized number into the phrase if it's not singular
  return value === 1
    ? `${formattedUnit}`
    : formattedUnit.replace(/\d+/, formattedNumber);
}
