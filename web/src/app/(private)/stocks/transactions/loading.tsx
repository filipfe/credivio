import Loader from "@/components/stocks/loader";

export default function Loading() {
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6">
      <Loader records={8} />
    </div>
  );
}
