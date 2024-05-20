export default function ExpensesCard() {
  return (
    <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white">Wydatki</h3>
        <small className="text-white/60">30 dni</small>
      </div>
      <div className="h-24 rounded-md px-2 relative">
        <div className="relative z-10 h-full flex items-end justify-between">
          <div className="h-full rounded-t-full bg-secondary w-4"></div>
          <div className="h-2/3 rounded-t-full bg-secondary w-4"></div>
          <div className="h-3/4 rounded-t-full bg-secondary w-4"></div>
          <div className="h-full rounded-t-full bg-secondary w-4"></div>
          <div className="h-full rounded-t-full bg-secondary w-4"></div>
          <div className="h-1/3 rounded-t-full bg-secondary w-4"></div>
        </div>
        <div className="absolute inset-0 w-full h-full flex flex-col justify-between">
          <div className="h-px bg-white/20 rounded-full"></div>
          <div className="h-px bg-white/20 rounded-full"></div>
          <div className="h-px bg-white/20 rounded-full"></div>
          <div className="h-px bg-white/20 rounded-full"></div>
          <div className="h-px bg-white/20 rounded-full"></div>
        </div>
      </div>
    </article>
  );
}
