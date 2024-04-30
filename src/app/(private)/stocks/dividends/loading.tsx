import Loader from "@/components/stocks/loader";

export default function Loading() {
  return (
    <div className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-10">
      <Loader records={8} />
    </div>
  );
}
