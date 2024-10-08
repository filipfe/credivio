"use client";

import { useContext } from "react";
import Block from "../ui/block";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { useExpensesByLabel } from "@/lib/stats/queries";

const colors = {
  empty: "#d3d3d3",
  green: "#177981",
  yellow: "#fdbb2d",
  other: "#d3d3d3",
};

const daysOfWeek = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"];

const activityData = [
  ["empty", "yellow", "yellow", "green", "empty", "empty", "empty"],
  ["empty", "green", "green", "yellow", "empty", "empty", "empty"],
  ["empty", "empty", "green", "green", "yellow", "green", "empty"],
  ["empty", "empty", "empty", "green", "empty", "empty", "empty"],
];

export default function Incomes() {
  const { month, year, currency } = useContext(StatsFilterContext);
  const { isLoading, data: results } = useExpensesByLabel(
    currency,
    month + 1,
    year
  );

  const sum = results
    ? results.reduce((prev, curr) => prev + curr.total_amount, 0) + 1000
    : 0;

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let day = startDate;

  while (day <= endDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className={`text-center py-1 rounded-lg h-3 ${
            !isSameMonth(day, monthStart) ? "bg-white" : "bg-primary"
          }`}
        ></div>
      );
      day = addDays(day, 1);
    }
    rows.push(<div className="grid grid-cols-7 gap-1">{days}</div>);
  }

  return (
    <Block className="xl:row-span-1 w-1/2">
      <div className="grid grid-cols-7 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}
      </div>
      <div className="grid gap-2">{rows}</div>
    </Block>
  );
}
