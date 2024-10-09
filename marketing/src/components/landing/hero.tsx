import GridBackground from "@/assets/svg/grid-bg";
import ScrollCarousel from "./scroll-carousel";
import StockCard from "./cards/stock";
import GoalCard from "./cards/goal";
import IncomeCard from "./cards/income";
import ExpensesCard from "./cards/expenses";

export default function Hero() {
  return (
    <section className="bg-primary-dark px-6 flex flex-col items-center gap-8 overflow-hidden relative pb-4">
      <div className="relative max-w-7xl mx-auto z-10 flex flex-col gap-4 items-center py-12 lg:py-24 w-full rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]">
        <h1 className="text-4xl lg:text-6xl text-white text-center font-black max-w-3xl">
          Zarządzaj wszelkimi finansami z łatwością
        </h1>
        <p className="text-white/80 lg:text-lg my-4 text-center">
          Sledź przychody, wydatki i cele w jednym miejscu.
        </p>
        <div className="w-full flex items-center gap-4 max-w-max">
          <div className="bg-primary/20 rounded-md p-1 flex-1">
            <button className="bg-primary py-2.5 text-sm px-5 rounded-md text-white">
              Rozpocznij
            </button>
          </div>
          <div className="border border-white/5 rounded-md p-1 flex-1">
            <button className="rounded-md py-2.5 text-sm px-5 backdrop-blur-md border border-white/10 text-white">
              Więcej
            </button>
          </div>
        </div>
        <div className="w-full overflow-hidden flex justify-center mt-12 lg:mt-16">
          <ScrollCarousel>
            <GoalCard />
            <IncomeCard />
            <StockCard />
            <ExpensesCard />
            <GoalCard />
            <IncomeCard />
            <StockCard />
            <ExpensesCard />
          </ScrollCarousel>
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center ">
        <GridBackground />
      </div>
    </section>
  );
}
