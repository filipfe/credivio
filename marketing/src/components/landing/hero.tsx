import GridBackground from "@/assets/svg/grid-bg";
import ScrollCarousel from "./scroll-carousel";
import StockCard from "./cards/stock";
import GoalCard from "./cards/goal";
import IncomeCard from "./cards/income";
import ExpensesCard from "./cards/expenses";
import { Dict } from "@/dict";

export default function Hero({ dict }: { dict: Dict["landing"]["hero"] }) {
  const { title, cta } = dict;
  return (
    <section className="bg-primary-dark sm:px-6 flex flex-col items-center gap-8 overflow-hidden relative pb-4">
      <div className="relative max-w-7xl mx-auto z-10 flex flex-col gap-4 items-center py-12 sm:py-16 lg:py-24 w-full sm:rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]">
        <div className="px-6 flex flex-col gap-4 items-center">
          <h1 className="text-4xl max-w-lg sm:text-5xl sm:max-w-xl lg:text-6xl text-white text-center font-black lg:max-w-3xl">
            {title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base my-4 text-center">
            Sledź przychody, wydatki i cele w jednym miejscu.
          </p>
          <div className="w-full flex items-center sm:gap-4 gap-2 max-w-max">
            <div className="bg-primary/20 rounded-md p-1 flex-1">
              <button className="whitespace-nowrap bg-primary py-2.5 text-sm px-5 rounded-md text-white">
                {cta.primary}
              </button>
            </div>
            <div className="border border-white/5 rounded-md p-1 flex-1">
              <button className="whitespace-nowrap rounded-md py-2.5 text-sm px-5 backdrop-blur-md border border-white/10 text-white">
                {cta.secondary}
              </button>
            </div>
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
