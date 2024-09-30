"use client";

import Block from "@/components/ui/block";
import { useContext } from "react";
import MonthInput from "../ui/inputs/month";
import YearInput from "../ui/inputs/year";
import getDisabledMonths from "@/utils/operations/get-disabled-months";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import { ChevronLeft, ChevronRight } from "lucide-react";

const now = new Date();

export default function Filters() {
  const { month, setMonth, year, setYear, currency, setCurrency } =
    useContext(StatsFilterContext);

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

    if (newYear === now.getFullYear()) {
      setMonth(now.getMonth());
    } else if (newYear < now.getFullYear()) {
      setMonth(11);
    } else {
      setMonth(0);
    }
  };

  const isPreviousMonthDisabled = () => {
    if (year === 2023 && month === 0) {
      return true;
    } else return false;
  };

  const isNextMonthDisabled = () => {
    if (year > now.getFullYear()) {
      return true;
    } else if (year === now.getFullYear() && month >= now.getMonth()) {
      return true;
    }
    return false;
  };

  return (
    <Block className="xl:col-span-6 flex-1" title="">
      <div className="flex flex-col gap-2 w-full items-center">
        <UniversalSelect
          className="w-32"
          name="currency"
          size="sm"
          radius="md"
          aria-label="Waluta"
          selectedKeys={[currency]}
          elements={CURRENCIES}
          onChange={(e) => setCurrency(e.target.value)}
        />
        <div className="flex gap-1 w-1/4">
          <button
            className="border h-8 min-w-8 rounded-md bg-[#fafafa]"
            onClick={handlePreviousMonth}
            disabled={isPreviousMonthDisabled()}
          >
            <ChevronLeft
              size={12}
              className={`self-center w-full ${
                isPreviousMonthDisabled() && "text-[#e5e5e7]"
              }`}
            />
          </button>
          <MonthInput
            value={month}
            disabledKeys={
              year === now.getFullYear()
                ? getDisabledMonths(now.getMonth())
                : []
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
    </Block>
  );
}
