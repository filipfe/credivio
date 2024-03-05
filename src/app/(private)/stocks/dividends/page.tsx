import DividendsTable from "@/components/stocks/dividends-table";
import { getDividendInfo } from "@/lib/stocks/actions";

export default async function Page() {
  const { results: dividends } = await getDividendInfo();
  const date = new Date();
  const { future, past } = dividends.reduce(
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
  return (
    <div>
      <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12">
        <h2 className="text-lg mb-2">Aktualne</h2>
        <DividendsTable dividends={future} />
      </section>
      <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12">
        <h2 className="text-lg mb-2">Przeszłe</h2>
        <DividendsTable dividends={past} />
      </section>
    </div>
  );
}
