export default function IncomeCard() {
  return (
    <div className="rounded-lg bg-primary-dark max-w-max">
      <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg flex flex-col gap-2 min-w-64">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Przychód</span>
          <small className="text-white/60">Dzisiaj</small>
        </div>
        <div className="h-10">
          <strong className="text-3xl font-bold text-white">
            +
            {new Intl.NumberFormat("pl", {
              style: "currency",
              currency: "PLN",
            }).format(2260.87)}
          </strong>
        </div>
      </article>
    </div>
  );
}
