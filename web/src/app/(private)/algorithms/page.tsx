import { getAlgorithms } from "@/lib/algorithms/actions";

export default async function Page() {
  const { results } = await getAlgorithms();
  return (
    <div className="sm:px-10 py-4 sm:py-8 sm:pb-24 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      {results.map((alg) => (
        <div>{alg.title}</div>
      ))}
    </div>
  );
}
