export default function groupFuturePast<T>(
  records: T[],
  getDate: (record: T) => Date | null,
) {
  const date = new Date();
  return records.reduce(
    (prev, curr) => {
      const past = { ...prev, past: [...prev.past, curr] };
      const recordDate = getDate(curr);
      if (!recordDate) return past;
      return recordDate.getTime() >= date.getTime()
        ? { ...prev, future: [...prev.future, curr] }
        : past;
    },
    { future: [] as T[], past: [] as T[] },
  );
}
