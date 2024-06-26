export default function GoalCard() {
  return (
    <div className="rounded-lg bg-primary-dark max-w-max">
      <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg flex flex-col gap-2 min-w-64">
        <small className="text-white/60">
          {new Intl.DateTimeFormat("pl-PL", {
            dateStyle: "short",
          }).format(new Date())}
        </small>
        <h3 className="text-white font-medium text-xl leading-tight">Gitara</h3>
        <div className="h-10 flex items-end">
          <strong className="text-3xl font-bold text-white">$640</strong>
          <sub className="text-sm mb-2 ml-1 text-white"> / $800</sub>
        </div>
        <div className="flex items-center justify-between">
          <small className="text-white/60">Progress</small>
          <small className="text-white/80">80%</small>
        </div>
        <div className="h-1 rounded-full bg-white/20">
          <div className="h-full rounded-full bg-secondary w-2/3"></div>
        </div>
      </article>
    </div>
  );
}
