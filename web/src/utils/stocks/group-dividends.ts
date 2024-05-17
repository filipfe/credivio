export default function groupDividends(dividends: Dividend[]) {
  const date = new Date();
  return dividends.reduce(
    (prev, curr) => {
      const past = { ...prev, past: [...prev.past, curr] };
      if (!curr.date) return past;
      const [day, month, year] = curr.date.split(".");
      const dividendDate = new Date(`${year}-${month}-${day}`);
      return dividendDate.getTime() >= date.getTime()
        ? { ...prev, future: [...prev.future, curr] }
        : past;
    },
    { future: [] as Dividend[], past: [] as Dividend[] }
  );
}
