import Link from "next/link";
import GoalCard from "../landing/cards/goal";
import IncomeCard from "../landing/cards/income";
import GridBackground from "@/assets/svg/grid-bg";
import { Dict } from "@/dict";

export default function Banner({ dict: { title } }: { dict: Dict["banner"] }) {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto sm:rounded-xl bg-primary-dark py-32 sm:py-16 relative overflow-hidden">
        <div className="flex flex-col items-center gap-6 relative z-10">
          <h2 className="text-white text-3xl lg:text-4xl lg:leading-tight leading-tight font-black max-w-lg text-center">
            {title}
          </h2>
          <div className="bg-primary/20 rounded-md p-1 flex items-center">
            <Link
              href="https://credivio.vercel.app"
              className="bg-primary py-2.5 text-sm px-5 rounded-md text-white"
            >
              Rozpocznij
            </Link>
          </div>
        </div>
        <div className="absolute right-6 -bottom-4 z-10">
          <IncomeCard />
        </div>
        <div className="absolute left-6 -top-4 z-10">
          <GoalCard />
        </div>
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <GridBackground />
        </div>
      </div>
    </section>
  );
}
