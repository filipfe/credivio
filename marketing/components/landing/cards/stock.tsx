export default function StockCard() {
  return (
    <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
      <span className="text-white/60 text-[12px]">PKNORLEN</span>
      <h3 className="text-white font-medium text-lg">PKN</h3>
      <div className="h-10">
        <strong className="text-3xl font-bold text-white">
          {new Intl.NumberFormat("pl", {
            style: "currency",
            currency: "PLN",
          }).format(67.24)}
        </strong>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between">
          <small className="text-white/60">C/Z</small>
          <small className="text-white/80">10</small>
        </div>
        <div className="flex items-center justify-between">
          <small className="text-white/60">C/WK</small>
          <small className="text-white/80">43</small>
        </div>
        <div className="flex items-center justify-between">
          <small className="text-white/60">C/WK</small>
          <small className="text-white/80">43</small>
        </div>
        <div className="flex items-center justify-between">
          <small className="text-white/60">C/WK</small>
          <small className="text-white/80">43</small>
        </div>
      </div>
    </article>
  );
}
