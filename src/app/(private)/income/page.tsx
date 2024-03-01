import Add from "@/components/ui/add";

export default function Page() {
  return (
    <div className="px-12 pt-8 pb-24">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl">Przychód</h1>
        <Add type="income" />
      </div>
      <section className="grid grid-cols-4 gap-y-10 gap-x-6 mt-8"></section>
    </div>
  );
}
