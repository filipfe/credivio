export default function formatAmount(num: string) {
  let value = num;
  value = value.match(/([0-9]*[\.|\,]{0,1}[0-9]{0,2})/g)![0].replace(",", ".");
  value = value.startsWith(".") ? "0" + value : value;
  return value;
}
