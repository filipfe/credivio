import AddForm from "@/components/operation/form";

export default async function Page() {
  return (
    <div className="sm:px-10 pt-4 pb-16 sm:py-8 flex flex-col h-full">
      <AddForm type="expense" />
    </div>
  );
}
