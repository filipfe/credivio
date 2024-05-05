import GridBackground from "@/assets/svg/grid-bg";

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-88px)] bg-primary-dark px-6 lg:px-[16vw] flex flex-col items-center gap-8 overflow-hidden relative">
      <div className="relative z-10 flex flex-col gap-4 items-center py-8 lg:py-16 w-full rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]">
        <h2 className="text-secondary text-center font-medium text-xl sm:text-2xl">
          Elevate your business
        </h2>
        <h1 className="text-4xl lg:text-6xl text-white text-center font-bold max-w-3xl">
          Make your site pop with Gill UI Kit template
        </h1>
        <p className="text-white/80 lg:text-lg my-4 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="w-full flex items-center gap-4 max-w-max">
          <div className="bg-primary/20 rounded-md p-1">
            <button className="bg-primary py-2.5 text-sm px-5 rounded-md">
              Get started
            </button>
          </div>
          <div className="border border-white/5 rounded-md p-1">
            <button className="rounded-md py-2.5 text-sm px-5 backdrop-blur-md border border-white/10">
              Get started
            </button>
          </div>
        </div>
        <div className="w-full overflow-hidden flex justify-center mt-8">
          <div className="flex items-center min-w-max gap-2">
            <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">In progress</span>
                <small className="text-white/60">Today</small>
              </div>
              <h3 className="text-white font-medium text-xl leading-tight">
                Working on
                <br /> Booking App
              </h3>
              <div className="h-10"></div>
              <small className="text-white/60">Progress</small>
              <div className="h-1 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-secondary w-2/3"></div>
              </div>
            </article>
            <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">In progress</span>
                <small className="text-white/60">Today</small>
              </div>
              <h3 className="text-white font-medium text-xl leading-tight">
                Working on
                <br /> Booking App
              </h3>
              <div className="h-10"></div>
              <small className="text-white/60">Progress</small>
              <div className="h-1 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-secondary w-2/3"></div>
              </div>
            </article>
            <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">In progress</span>
                <small className="text-white/60">Today</small>
              </div>
              <h3 className="text-white font-medium text-xl leading-tight">
                Working on
                <br /> Booking App
              </h3>
              <div className="h-10"></div>
              <small className="text-white/60">Progress</small>
              <div className="h-1 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-secondary w-2/3"></div>
              </div>
            </article>
            <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Calendar</span>
                <span className="text-white/60 text-[12px]">1 PM</span>
              </div>
              <h3 className="text-white font-medium text-lg">Calendar</h3>
            </article>
            <article className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">In progress</span>
                <span className="text-white/60 text-[12px]">Today</span>
              </div>
              <h3 className="text-white font-medium text-lg">
                Working on Booking App
              </h3>
            </article>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center ">
        <GridBackground />
      </div>
    </section>
  );
}
