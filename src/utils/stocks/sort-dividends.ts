export default function sortDividends(dividends: Dividend[]) {
  return dividends.sort((a, b) => {
    const [aDay, aMonth, aYear] = a.date.split(".");
    const aTime = new Date(`${aYear}-${aMonth}-${aDay}`).getTime();
    const [bDay, bMonth, bYear] = b.date.split(".");
    const bTime = new Date(`${bYear}-${bMonth}-${bDay}`).getTime();
    return aTime - bTime;
  });
}
