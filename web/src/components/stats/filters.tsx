"use client";

import Block from "@/components/ui/block";
import { useContext } from "react";
import MonthInput from "./inputs/month";
import YearInput from "./inputs/year";
import getDisabledMonths from "@/utils/operations/get-disabled-months";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { now } from "@internationalized/date";

export default function Filters() {
  const {
    month,
    setMonth,
    year,
    setYear,
    currency,
    setCurrency,
    settings: { timezone },
  } = useContext(StatsFilterContext);

  const today = now(timezone);

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prevYear) => prevYear - 1);
    } else {
      setMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prevYear) => prevYear + 1);
    } else {
      setMonth((prevMonth) => prevMonth + 1);
    }
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);

    if (newYear === today.year) {
      setMonth(today.month - 1);
    } else if (newYear < today.year) {
      setMonth(11);
    } else {
      setMonth(0);
    }
  };

  const isPreviousMonthDisabled = year === 2023 && month === 0;

  const isNextMonthDisabled = () => {
    if (year > today.year) {
      return true;
    } else if (year === today.year && month >= today.month - 1) {
      return true;
    }
    return false;
  };

  return (
    <div className="sticky top-24 xl:static col-start-1 col-end-3 border bg-white py-2 px-4 flex items-center gap-3 rounded-md justify-between z-10">
      <UniversalSelect
        className="w-20 sm:w-28"
        name="currency"
        size="sm"
        radius="md"
        aria-label="Waluta"
        selectedKeys={[currency]}
        elements={CURRENCIES}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <div className="flex gap-1">
        <button
          className="border h-8 min-w-8 rounded-md bg-[#fafafa]"
          onClick={handlePreviousMonth}
          disabled={isPreviousMonthDisabled}
        >
          <ChevronLeft
            size={12}
            className={`self-center w-full ${
              isPreviousMonthDisabled && "text-[#e5e5e7]"
            }`}
          />
        </button>
        <MonthInput
          value={month}
          disabledKeys={
            year === today.year ? getDisabledMonths(today.month - 1) : []
          }
          onChange={setMonth}
        />
        <YearInput value={year} onChange={handleYearChange} />
        <button
          className="border h-8 min-w-8 rounded-md bg-[#fafafa]"
          onClick={handleNextMonth}
          disabled={isNextMonthDisabled()}
        >
          <ChevronRight
            size={12}
            className={`self-center w-full ${
              isNextMonthDisabled() && "text-[#e5e5e7]"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
