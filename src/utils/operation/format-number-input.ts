export default function formatNumberInput(input: string) {
  const lastChar = input.charAt(input.length - 1);
  const isValid = /\D/g.test(lastChar) && input.charAt(0) !== "0";
  if (isValid) return input;
  const prevInput = input.substring(0, input.length - 2);
  if (lastChar === "." || lastChar === ",") {
    const hasDecimal = prevInput.includes(".") || prevInput.includes(",");
    if (hasDecimal) return prevInput;
    return input;
  }
  return prevInput;
}
