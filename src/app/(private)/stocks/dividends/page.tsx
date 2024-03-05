import DividendsTable from "@/components/stocks/dividends-table";
import { getDividendInfo } from "@/lib/stocks/actions";

export default async function Page() {
  const { results: dividends } = await getDividendInfo();
  return (
    <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12">
      <h2 className="text-lg mb-2">Dywidendy</h2>
      <DividendsTable dividends={dividends} />
    </section>
  );
}
