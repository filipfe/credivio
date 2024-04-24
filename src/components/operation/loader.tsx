import Loader from "../stocks/loader";

export default function OperationsLoader() {
  return (
    <div className="sm:px-10 py-6 sm:pt-8 sm:pb-24 flex flex-col h-full gap-6 lg:grid grid-cols-2">
      <Loader records={8} />
      <Loader records={8} />
    </div>
  );
}
