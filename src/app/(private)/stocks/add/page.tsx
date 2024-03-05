import AddForm from "@/components/stocks/form";

export default async function Page() {
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <h1 className="text-3xl">Dodaj akcje</h1>
      <AddForm />
    </div>
  );
}
