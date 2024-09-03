export default function getDisabledMonths(curr: number): string[] {
  const result: string[] = [];
  for (let i = curr + 1; i <= 11; i++) {
    result.push(i.toString());
  }
  return result;
}
