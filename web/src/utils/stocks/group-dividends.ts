import groupFuturePast from "../formatters/group-future-past";

export default function groupDividends(records: Dividend[]) {
  return groupFuturePast<Dividend>(records, (dividend) => {
    if (!dividend.date) return null;
    const [day, month, year] = dividend.date.split(".");
    const date = new Date(`${year}-${month}-${day}`);
    return date;
  });
}
